import { IsArray, IsOptional, IsString } from 'class-validator';
import { Customer } from 'src/customer/entities/customer.entity';

export class CreateInvoiceDto {
  //   @IsString()
  //   invoiceNumber: string;
  @IsString()
  email?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsArray()
  @IsString({ each: true })
  customer?: string[];

  //   @IsDate()
  //   invoiceDueDate?: Date;

  @IsArray()
  items?: [
    {
      description: string;
      amount: number;
    },
  ];

  @IsString()
  terms?: string;
}
