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
import { CustomTourRequestService } from '../services/custom-tour-request.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateCustomTourRequestRequestDto } from 'src/tour/dtos/create-custom-tour-request.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { CustomTourRequestResponseDto } from 'src/tour/dtos/custom-tour-request.response.dto';

@Controller('custom-tour-requests')
export class CustomTourRequestController {
  constructor(
    private readonly customTourRequestService: CustomTourRequestService
  ) {}

  // ==================== PUBLIC ROUTES ====================

  @Post()
  async create(
    @Body() dto: CreateCustomTourRequestRequestDto
  ): Promise<HttpResponse<CustomTourRequestResponseDto>> {
    const request = await this.customTourRequestService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Custom tour request submitted successfully',
      data: request,
    };
  }

  // ==================== ADMIN ROUTES ====================

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<HttpResponse<CustomTourRequestResponseDto[]>> {
    const result = await this.customTourRequestService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Custom tour requests retrieved successfully',
      data: result,
    };
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string): Promise<HttpResponse<CustomTourRequestResponseDto>> {
    const request = await this.customTourRequestService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Custom tour request retrieved successfully',
      data: request,
    };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.customTourRequestService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Custom tour request deleted successfully',
    };
  }
}
