import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/model/user.model';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'mailer/mailer.service';

import { LoginDto } from './dto/login.dto';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';

import { ConfigService } from '@nestjs/config';

import { RefreshToken } from 'src/user/model/refreshToken.schema';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { ResetToken } from 'src/user/model/resetToken.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
    @InjectModel(ResetToken.name) private resetTokenModel: Model<ResetToken>,
    readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private usersService: UserService,
    private configService: ConfigService,
  ) {}

  async generateUserTokens(userId) {
    const accessToken = this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      },
    );

    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, userId);

    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(token: string, userId: any) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.refreshTokenModel.updateOne(
      { userId },
      { $set: { expiryDate } },
      {
        upsert: true,
      },
    );
  }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.usersService.findByEmail(createUserDto.email);

    if (userExists) throw new BadRequestException('user already exists');

    const newUser = await this.usersService.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 12),
    });
    const tokens = await this.generateUserTokens(newUser.id);

    const url = `localhost:3000`;
    const verificationlink = `${url}/confirm-email?token=${newUser.confirmationToken}`;

    await this.mailerService.sendWelcomeEmail(
      newUser.email,
      newUser.name,
      verificationlink,
    );

    return { tokens };
  }

  async signin(loginAuthDto: LoginDto) {
    const { email, password } = loginAuthDto;

    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('wrong credentials');

    console.log('retrieved user:', user);

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches)
      throw new BadRequestException('incorrect email or password');

    const tokens = await this.generateUserTokens(user._id);
    return tokens;
  }

  async resetPassowrd(newPassword: string, resetToken: string) {
    // find valid reset token document
    const token = await this.resetTokenModel.findOneAndDelete({
      token: resetToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('invalid link');
    }

    // change user password. hash it also

    const user = await this.userModel.findById(token.userId);
    if (!user) {
      throw new InternalServerErrorException();
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: 'password change successfully' };
  }

  async forgotPassword(email: string) {
    // check that the user exists
    const user = await this.usersService.findByEmail(email);

    // if yes, generate password reset link

    if (user) {
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const resetToken = nanoid(64);
      await this.resetTokenModel.create({
        token: resetToken,
        userId: user._id,
        expiryDate,
      });

      this.mailerService.sendResetPasswordEmail(email, resetToken);
    }

    return { message: 'if this user exists, they will receive a mail' };
  }

  async logout(userId: number) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  async changePassword(userId, oldPassword, newPassword) {
    // find the user

    const user = await this.userModel.findById(userId);

    if (!user) throw new NotFoundException('user not found ...');
    // compare old password with existing password

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) throw new UnauthorizedException('wrong credentials');
    // change user's password also hash it before storing

    const newHashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = newHashedPassword;
    await user.save();
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.refreshTokenModel.findOne({
      refreshToken: refreshToken,
      expiryDate: { $gte: new Date() },
    });

    // if (!token) throw new UnauthorizedException('redirect to login'); //throw user back to login screen to login

    return await this.generateUserTokens(token.userId);
  }
}
