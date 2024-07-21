import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Customer } from 'src/customer/entities/customer.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { v4 as uuidv4 } from 'uuid';

// export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'duplicate email entered'] })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  emailConfirmed: boolean;

  @Prop({ default: () => uuidv4() })
  confirmationToken: string;

  @Prop()
  refreshToken: string;

  // @Prop()
  // tokenVersion: number;

  @Prop()
  passswordResetToken: string;

  @Prop({ type: Date })
  passwordResetExpires: number;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }])
  customers: Customer[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }])
  invoices: Invoice[];
}
export const UserSchema = SchemaFactory.createForClass(User);
