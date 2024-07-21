import { HttpException, Injectable, Req } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './entities/customer.entity';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/model/user.model';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(id: string, createCustomerDto: CreateCustomerDto) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new Error('User with the provided ID not found');
    }

    const newCustomer = new this.customerModel(createCustomerDto);

    const savedCustomer = await newCustomer.save();

    await user.updateOne({
      $push: {
        customers: savedCustomer._id,
      },
    });

    return { savedCustomer, userId: user._id };
  }

  async findAll() {
    return await this.customerModel.find();
  }

  // const objectId = new Types.ObjectId(id);
  async findOne(id: string) {
    if (!id) throw new Error('not found');
    return await this.customerModel.findById(id);
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    return await this.customerModel.findByIdAndUpdate(id, updateCustomerDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.customerModel.findByIdAndDelete(id);
  }
}
