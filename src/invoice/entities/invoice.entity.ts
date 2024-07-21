import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import mongoose from 'mongoose';
import { Customer } from 'src/customer/entities/customer.entity';

@Schema({ timestamps: true })
export class Invoice {
  @Prop()
  from: string;

  @Prop()
  @IsOptional()
  logo: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }])
  customer: Customer[];

  // @Prop()
  // invoiceNumber: string;

  @Prop()
  items: [
    {
      description: string;
      amount: number;
    },
  ];

  // @Prop()
  // invoiceDueDate: Date;

  @Prop()
  terms: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
