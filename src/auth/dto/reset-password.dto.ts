import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

export class ResetandForgotPasswordDto {
  email: string;
  formerPassword?: string;
}
