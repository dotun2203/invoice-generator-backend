import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class ResetToken {
  @Prop()
  token: string;

  @Prop({ type: mongoose.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @Prop()
  expiryDate: Date;
}

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);
