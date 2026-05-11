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
import { BlogService } from '../services/blog.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateBlogRequestDto } from 'src/blog/dtos/create-blog.request.dto';
import { UpdateBlogRequestDto } from 'src/blog/dtos/update-blog.request.dto';
import { BlogFilterParamDto } from 'src/blog/dtos/blog-filter.param.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { CurrentUser } from 'src/_core/decorators/current-user.decorator';
import type { JwtValidationReturn } from 'src/_common/interfaces/interface';
import { ClientIp } from 'src/_core/decorators/client-ip.decorator';
import { BlogResponseDto } from 'src/blog/dtos/blog.response.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // ==================== PUBLIC ROUTES ====================

  @Get()
  async findAllPublic(
    @Query() filter: BlogFilterParamDto
  ): Promise<HttpResponse<BlogResponseDto[]>> {
    const result = await this.blogService.findAllPublic(filter);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blogs retrieved successfully',
      data: result,
    };
  }

  @Post(':id/view')
  async incrementView(
    @Param('id') id: string,
    @ClientIp() ipAddress: string
  ): Promise<HttpResponse<unknown>> {
    const result = await this.blogService.incrementView(id, ipAddress);
    return {
      statusCode: HttpStatus.OK,
      message: 'View recorded',
      data: result,
    };
  }

  @Post(':id/like')
  async toggleLike(
    @Param('id') id: string,
    @ClientIp() ipAddress: string
  ): Promise<HttpResponse<unknown>> {
    const result = await this.blogService.toggleLike(id, ipAddress);
    return {
      statusCode: HttpStatus.OK,
      message: result.liked ? 'Liked' : 'Unliked',
      data: result,
    };
  }

  // ==================== ADMIN ROUTES ====================

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateBlogRequestDto,
    @CurrentUser() user: JwtValidationReturn
  ): Promise<HttpResponse<BlogResponseDto>> {
    const blog = await this.blogService.create(dto, user.userId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Blog created successfully',
      data: blog,
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() filter: BlogFilterParamDto
  ): Promise<HttpResponse<BlogResponseDto[]>> {
    const result = await this.blogService.findAll(filter);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blogs retrieved successfully',
      data: result,
    };
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string): Promise<HttpResponse<BlogResponseDto>> {
    const blog = await this.blogService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog retrieved successfully',
      data: blog,
    };
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogRequestDto
  ): Promise<HttpResponse<BlogResponseDto>> {
    const blog = await this.blogService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog updated successfully',
      data: blog,
    };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.blogService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Blog deleted successfully',
    };
  }

  @Get(':endpoint')
  async findByEndpoint(
    @Param('endpoint') endpoint: string
  ): Promise<HttpResponse<BlogResponseDto>> {
    const blog = await this.blogService.findByEndpoint(endpoint);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog retrieved successfully',
      data: blog,
    };
  }
}
