import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DiaryCategoryService } from '../services/diary-category.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateDiaryCategoryRequestDto } from 'src/diary/dtos/create-diary-category.request.dto';
import { UpdateDiaryCategoryRequestDto } from 'src/diary/dtos/update-diary-category.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { DiaryCategoryResponseDto } from 'src/diary/dtos/diary-category.response.dto';

@Controller('diary-categories')
export class DiaryCategoryController {
  constructor(private readonly diaryCategoryService: DiaryCategoryService) {}

  // ==================== PUBLIC ROUTES ====================

  @Get()
  async findAllPublic(): Promise<HttpResponse<DiaryCategoryResponseDto[]>> {
    const categories = await this.diaryCategoryService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Diary categories retrieved successfully',
      data: categories,
    };
  }

  // ==================== ADMIN ROUTES ====================

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateDiaryCategoryRequestDto
  ): Promise<HttpResponse<DiaryCategoryResponseDto>> {
    const category = await this.diaryCategoryService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Diary category created successfully',
      data: category,
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<HttpResponse<DiaryCategoryResponseDto[]>> {
    const categories = await this.diaryCategoryService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Diary categories retrieved successfully',
      data: categories,
    };
  }

  @Get('admin/available-sort-orders/:parentId')
  @UseGuards(JwtAuthGuard)
  async findAvailableSortOrders(
    @Param('parentId') parentId: string
  ): Promise<HttpResponse<number[]>> {
    const sortOrders = await this.diaryCategoryService.findAvailableSortOrders(parentId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Available sort orders retrieved successfully',
      data: sortOrders,
    };
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string): Promise<HttpResponse<DiaryCategoryResponseDto>> {
    const category = await this.diaryCategoryService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Diary category retrieved successfully',
      data: category,
    };
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDiaryCategoryRequestDto
  ): Promise<HttpResponse<DiaryCategoryResponseDto>> {
    const category = await this.diaryCategoryService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Diary category updated successfully',
      data: category,
    };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.diaryCategoryService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Diary category deleted successfully',
    };
  }

  @Get(':endpoint')
  async findByEndpoint(
    @Param('endpoint') endpoint: string
  ): Promise<HttpResponse<DiaryCategoryResponseDto>> {
    const category = await this.diaryCategoryService.findByEndpoint(endpoint);
    return {
      statusCode: HttpStatus.OK,
      message: 'Diary category retrieved successfully',
      data: category,
    };
  }
}
