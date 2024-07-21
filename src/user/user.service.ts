import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './model/user.model';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll() {
    return this.userModel.find().populate('customers');
  }

  async findById(id: string) {
    return await this.userModel
      .findById(id)
      .populate([
        'customers',
        { path: 'invoices', populate: { path: 'customer', model: 'Customer' } },
      ]);
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findByConfirmationEmail(confirmationToken: string) {
    return this.userModel.findOne({ confirmationToken }).exec();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async remove(id: number) {
    return this.userModel.findByIdAndDelete(id);
  }
}
