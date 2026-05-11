import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateBookingRequestDto } from 'src/tour/dtos/create-booking.request.dto';
import { UpdateBookingRequestDto } from 'src/tour/dtos/update-booking.request.dto';
import { BookingFilterParamDto } from 'src/tour/dtos/booking-filter.param.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { BookingResponseDto } from 'src/tour/dtos/booking.response.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // ==================== PUBLIC ROUTES ====================

  @Post()
  async create(
    @Body() dto: CreateBookingRequestDto
  ): Promise<HttpResponse<BookingResponseDto>> {
    const booking = await this.bookingService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Booking submitted successfully',
      data: booking,
    };
  }

  // ==================== ADMIN ROUTES ====================

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() filter: BookingFilterParamDto
  ): Promise<HttpResponse<BookingResponseDto[]>> {
    const result = await this.bookingService.findAll(filter);
    return {
      statusCode: HttpStatus.OK,
      message: 'Bookings retrieved successfully',
      data: result,
    };
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string): Promise<HttpResponse<BookingResponseDto>> {
    const booking = await this.bookingService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Booking retrieved successfully',
      data: booking,
    };
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBookingRequestDto
  ): Promise<HttpResponse<BookingResponseDto>> {
    const booking = await this.bookingService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Booking updated successfully',
      data: booking,
    };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.bookingService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Booking deleted successfully',
    };
  }
}
