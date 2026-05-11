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
import { TourCategoryTourService } from '../services/tour-category-tour.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateTourCategoryTourRequestDto } from 'src/tour/dtos/create-tour-category-tour.request.dto';
import { UpdateTourCategoryTourRequestDto } from 'src/tour/dtos/update-tour-category-tour.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { TourCategoryTourResponseDto } from 'src/tour/dtos/tour-category-tour.response.dto';

@Controller('tour-category-tours')
export class TourCategoryTourController {
  constructor(
    private readonly tourCategoryTourService: TourCategoryTourService,
  ) {}

  // ==================== PUBLIC ROUTES (GET, no guard) ====================

  @Get()
  async findAll(): Promise<HttpResponse<TourCategoryTourResponseDto[]>> {
    const relations = await this.tourCategoryTourService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Tour-category-tour relations retrieved successfully',
      data: relations,
    };
  }

  @Get('tour/:tourId')
  async findByTourId(
    @Param('tourId') tourId: string,
  ): Promise<HttpResponse<TourCategoryTourResponseDto[]>> {
    const relations = await this.tourCategoryTourService.findByTourId(tourId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tour-category-tour relations retrieved successfully',
      data: relations,
    };
  }

  @Get('category/:tourCategoryId')
  async findByTourCategoryId(
    @Param('tourCategoryId') tourCategoryId: string,
  ): Promise<HttpResponse<TourCategoryTourResponseDto[]>> {
    const relations =
      await this.tourCategoryTourService.findByTourCategoryId(tourCategoryId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tour-category-tour relations retrieved successfully',
      data: relations,
    };
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
  ): Promise<HttpResponse<TourCategoryTourResponseDto>> {
    const relation = await this.tourCategoryTourService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tour-category-tour relation retrieved successfully',
      data: relation,
    };
  }

  // ==================== ADMIN ROUTES (guard) ====================

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateTourCategoryTourRequestDto,
  ): Promise<HttpResponse<TourCategoryTourResponseDto>> {
    const relation = await this.tourCategoryTourService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Tour-category-tour relation created successfully',
      data: relation,
    };
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTourCategoryTourRequestDto,
  ): Promise<HttpResponse<TourCategoryTourResponseDto>> {
    const relation = await this.tourCategoryTourService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tour-category-tour relation updated successfully',
      data: relation,
    };
  }

  @Delete('admin/tour/:tourId')
  @UseGuards(JwtAuthGuard)
  async deleteByTourId(@Param('tourId') tourId: string): Promise<HttpResponse<void>> {
    await this.tourCategoryTourService.deleteByTourId(tourId);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Tour-category-tour relations deleted successfully',
    };
  }

  @Delete('admin/category/:tourCategoryId')
  @UseGuards(JwtAuthGuard)
  async deleteByTourCategoryId(
    @Param('tourCategoryId') tourCategoryId: string,
  ): Promise<HttpResponse<void>> {
    await this.tourCategoryTourService.deleteByTourCategoryId(tourCategoryId);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Tour-category-tour relations deleted successfully',
    };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.tourCategoryTourService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Tour-category-tour relation deleted successfully',
    };
  }
}
