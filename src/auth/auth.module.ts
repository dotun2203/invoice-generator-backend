import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerService } from 'mailer/mailer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/model/user.model';

import {
  RefreshToken,
  RefreshTokenSchema,
} from 'src/user/model/refreshToken.schema';
import { ResetToken, ResetTokenSchema } from 'src/user/model/resetToken.schema';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    JwtModule.register({}),
    UserModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      {
        name: RefreshToken.name,
        schema: RefreshTokenSchema,
      },
      {
        name: ResetToken.name,
        schema: ResetTokenSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailerService],
})
export class AuthModule {}
