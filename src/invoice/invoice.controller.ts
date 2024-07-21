import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import mongoose from 'mongoose';
import { upload } from 'utils/upload.middleware';

import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as Cloudinary } from 'cloudinary';

Cloudinary.config({
  cloud_name: 'dx2tfgavx',
  api_key: '679971742912843',
  api_secret: 'Kz_TIXSKmztoaSyWFBpgUakFpw8',
});

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post(':id')
  async create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @Param('id') id: string,
    // @UploadedFile() logo: Express.Multer.File,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('user not found', 404);

    // const result = await Cloudinary.uploader.upload(logo.path);
    // createInvoiceDto.logo = result.secure_url;
    return await this.invoiceService.create(id, createInvoiceDto);
  }

  @Get()
  async findAll() {
    return await this.invoiceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('user not found', 404);
    return await this.invoiceService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('user not found', 404);
    return await this.invoiceService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('user not found', 404);
    return await this.invoiceService.remove(id);
  }
}
