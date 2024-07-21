import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;
}
