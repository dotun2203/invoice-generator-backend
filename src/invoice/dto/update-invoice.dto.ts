import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateInvoiceDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  customer?: string[];

  @IsOptional()
  @IsDate()
  invoiceDueDate?: Date;

  @IsOptional()
  @IsArray()
  items?: [
    {
      description: string;
      amount: number;
    },
  ];

  @IsOptional()
  @IsString()
  terms?: string;
}
