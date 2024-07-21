import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from './entities/invoice.entity';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/user/model/user.model';
import { Customer } from 'src/customer/entities/customer.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async create(id: string, createInvoiceDto: CreateInvoiceDto) {
    const user = await this.userModel.findById(id);

    if (!user) throw new Error('please login');

    const customer = await this.customerModel.find({
      _id: { $in: createInvoiceDto.customer },
    });

    const newInvoice = new this.invoiceModel(createInvoiceDto);
    newInvoice.customer = customer;
    const savedInvoice = await newInvoice.save();

    await user.updateOne({
      $push: {
        invoices: savedInvoice._id,
      },
    });

    return { savedInvoice, userId: user._id };
  }

  async findAll() {
    return await this.invoiceModel.find();
  }

  async findOne(id: string) {
    if (!id) throw new Error('not found');
    return await this.invoiceModel.findById(id);
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    if (!id) throw new Error('not found');
    return await this.invoiceModel.findByIdAndUpdate(id, updateInvoiceDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.invoiceModel.findByIdAndDelete(id);
  }
}
