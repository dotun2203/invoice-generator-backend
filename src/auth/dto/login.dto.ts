import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'please enter correct email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
