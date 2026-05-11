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
import { BlogCategoryBlogService } from '../services/blog-category-blog.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateBlogCategoryBlogRequestDto } from 'src/blog/dtos/create-blog-category-blog.request.dto';
import { UpdateBlogCategoryBlogRequestDto } from 'src/blog/dtos/update-blog-category-blog.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { BlogCategoryBlogResponseDto } from 'src/blog/dtos/blog-category-blog.response.dto';

@Controller('blog-category-blogs')
export class BlogCategoryBlogController {
  constructor(
    private readonly blogCategoryBlogService: BlogCategoryBlogService,
  ) {}

  // ==================== PUBLIC ROUTES (GET, no guard) ====================

  @Get()
  async findAll(): Promise<HttpResponse<BlogCategoryBlogResponseDto[]>> {
    const relations = await this.blogCategoryBlogService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog-category-blog relations retrieved successfully',
      data: relations,
    };
  }

  @Get('blog/:blogId')
  async findByBlogId(
    @Param('blogId') blogId: string,
  ): Promise<HttpResponse<BlogCategoryBlogResponseDto[]>> {
    const relations = await this.blogCategoryBlogService.findByBlogId(blogId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog-category-blog relations retrieved successfully',
      data: relations,
    };
  }

  @Get('category/:blogCategoryId')
  async findByBlogCategoryId(
    @Param('blogCategoryId') blogCategoryId: string,
  ): Promise<HttpResponse<BlogCategoryBlogResponseDto[]>> {
    const relations =
      await this.blogCategoryBlogService.findByBlogCategoryId(blogCategoryId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog-category-blog relations retrieved successfully',
      data: relations,
    };
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
  ): Promise<HttpResponse<BlogCategoryBlogResponseDto>> {
    const relation = await this.blogCategoryBlogService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog-category-blog relation retrieved successfully',
      data: relation,
    };
  }

  // ==================== ADMIN ROUTES (guard) ====================

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateBlogCategoryBlogRequestDto,
  ): Promise<HttpResponse<BlogCategoryBlogResponseDto>> {
    const relation = await this.blogCategoryBlogService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Blog-category-blog relation created successfully',
      data: relation,
    };
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogCategoryBlogRequestDto,
  ): Promise<HttpResponse<BlogCategoryBlogResponseDto>> {
    const relation = await this.blogCategoryBlogService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog-category-blog relation updated successfully',
      data: relation,
    };
  }

  @Delete('admin/blog/:blogId')
  @UseGuards(JwtAuthGuard)
  async deleteByBlogId(@Param('blogId') blogId: string): Promise<HttpResponse<void>> {
    await this.blogCategoryBlogService.deleteByBlogId(blogId);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Blog-category-blog relations deleted successfully',
    };
  }

  @Delete('admin/category/:blogCategoryId')
  @UseGuards(JwtAuthGuard)
  async deleteByBlogCategoryId(
    @Param('blogCategoryId') blogCategoryId: string,
  ): Promise<HttpResponse<void>> {
    await this.blogCategoryBlogService.deleteByBlogCategoryId(blogCategoryId);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Blog-category-blog relations deleted successfully',
    };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.blogCategoryBlogService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Blog-category-blog relation deleted successfully',
    };
  }
}
