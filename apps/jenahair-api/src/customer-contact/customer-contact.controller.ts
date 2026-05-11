import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CustomerContactService } from './customer-contact.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateCustomerContactRequestDto } from 'src/customer-contact/dtos/create-customer-contact.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { CustomerContactResponseDto } from 'src/customer-contact/dtos/customer-contact.response.dto';

@Controller('contacts')
export class CustomerContactController {
  constructor(private readonly customerContactService: CustomerContactService) {}

  // ==================== PUBLIC ROUTES ====================

  @Post()
  async create(
    @Body() dto: CreateCustomerContactRequestDto
  ): Promise<HttpResponse<CustomerContactResponseDto>> {
    const contact = await this.customerContactService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Contact submitted successfully',
      data: contact,
    };
  }

  // ==================== ADMIN ROUTES ====================

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<HttpResponse<CustomerContactResponseDto[]>> {
    const result = await this.customerContactService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Customer contacts retrieved successfully',
      data: result,
    };
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string): Promise<HttpResponse<CustomerContactResponseDto>> {
    const contact = await this.customerContactService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Customer contact retrieved successfully',
      data: contact,
    };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.customerContactService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Customer contact deleted successfully',
    };
  }
}
