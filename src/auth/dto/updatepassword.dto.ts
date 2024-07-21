import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  oldPassword?: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
