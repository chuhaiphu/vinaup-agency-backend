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
import { BlogCategoryService } from '../services/blog-category.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateBlogCategoryRequestDto } from 'src/blog/dtos/create-blog-category.request.dto';
import { UpdateBlogCategoryRequestDto } from 'src/blog/dtos/update-blog-category.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { BlogCategoryResponseDto } from 'src/blog/dtos/blog-category.response.dto';

@Controller('blog-categories')
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}

  // ==================== PUBLIC ROUTES ====================

  @Get()
  async findAllPublic(): Promise<HttpResponse<BlogCategoryResponseDto[]>> {
    const categories = await this.blogCategoryService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog categories retrieved successfully',
      data: categories,
    };
  }

  // ==================== ADMIN ROUTES ====================

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateBlogCategoryRequestDto
  ): Promise<HttpResponse<BlogCategoryResponseDto>> {
    const category = await this.blogCategoryService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Blog category created successfully',
      data: category,
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<HttpResponse<BlogCategoryResponseDto[]>> {
    const categories = await this.blogCategoryService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog categories retrieved successfully',
      data: categories,
    };
  }

  @Get('admin/available-sort-orders/:parentId')
  @UseGuards(JwtAuthGuard)
  async findAvailableSortOrders(
    @Param('parentId') parentId: string
  ): Promise<HttpResponse<number[]>> {
    const sortOrders = await this.blogCategoryService.findAvailableSortOrders(parentId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Available sort orders retrieved successfully',
      data: sortOrders,
    };
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string): Promise<HttpResponse<BlogCategoryResponseDto>> {
    const category = await this.blogCategoryService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog category retrieved successfully',
      data: category,
    };
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogCategoryRequestDto
  ): Promise<HttpResponse<BlogCategoryResponseDto>> {
    const category = await this.blogCategoryService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog category updated successfully',
      data: category,
    };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.blogCategoryService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Blog category deleted successfully',
    };
  }

  @Get(':endpoint')
  async findByEndpoint(
    @Param('endpoint') endpoint: string
  ): Promise<HttpResponse<BlogCategoryResponseDto>> {
    const category = await this.blogCategoryService.findByEndpoint(endpoint);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog category retrieved successfully',
      data: category,
    };
  }
}
