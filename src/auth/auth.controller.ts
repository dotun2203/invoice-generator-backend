import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  BadRequestException,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  async signin(@Body() loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (user.emailConfirmed) {
      return this.authService.signin(loginDto);
    } else {
      throw new BadRequestException('please confirm your email');
    }
  }

  @Get('confirm-email')
  async confirmEmail(@Query('token') token: string) {
    if (!token) throw new BadRequestException('confirmation token is required');

    const user = await this.userService.findByConfirmationEmail(token);

    if (!user) {
      throw new BadRequestException('Invalid confirmation token');
    }
    user.emailConfirmed = true;
    user.confirmationToken = undefined; // Optional: Clear confirmation token after use
    await user.save();

    return { message: 'Email confirmed successfully' };
  }

  @Put('reset-password')
  async resetpassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassowrd(
      resetPasswordDto.newPassword,
      resetPasswordDto.resetToken,
    );
  }

  @Post('forgot-password')
  async forgotpassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  @Post('refresh')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @UseGuards(AuthGuard)
  @Put('change-password')
  async changePassword(
    @Body() changepasswordDto: ChangePasswordDto,
    @Req() req,
  ) {
    return this.authService.changePassword(
      req.userId,
      changepasswordDto.oldPassword,
      changepasswordDto.newPassword,
    );
  }
}
