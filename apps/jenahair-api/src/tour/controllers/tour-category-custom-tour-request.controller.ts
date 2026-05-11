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
import { TourCategoryCustomTourRequestService } from '../services/tour-category-custom-tour-request.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateTourCategoryCustomTourRequestRequestDto } from 'src/tour/dtos/create-tour-category-custom-tour-request.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { TourCategoryCustomTourRequestResponseDto } from 'src/tour/dtos/tour-category-custom-tour-request.response.dto';

@Controller('tour-category-custom-tour-requests')
export class TourCategoryCustomTourRequestController {
  constructor(
    private readonly tourCategoryCustomTourRequestService: TourCategoryCustomTourRequestService,
  ) {}

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateTourCategoryCustomTourRequestRequestDto,
  ): Promise<HttpResponse<TourCategoryCustomTourRequestResponseDto>> {
    const relation =
      await this.tourCategoryCustomTourRequestService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message:
        'Tour-category-custom-tour-request relation created successfully',
      data: relation,
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<
    HttpResponse<TourCategoryCustomTourRequestResponseDto[]>
  > {
    const relations =
      await this.tourCategoryCustomTourRequestService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message:
        'Tour-category-custom-tour-request relations retrieved successfully',
      data: relations,
    };
  }

  @Get('admin/request/:customTourRequestId')
  @UseGuards(JwtAuthGuard)
  async findByCustomTourRequestId(
    @Param('customTourRequestId') customTourRequestId: string,
  ): Promise<HttpResponse<TourCategoryCustomTourRequestResponseDto[]>> {
    const relations =
      await this.tourCategoryCustomTourRequestService.findByCustomTourRequestId(
        customTourRequestId,
      );
    return {
      statusCode: HttpStatus.OK,
      message:
        'Tour-category-custom-tour-request relations retrieved successfully',
      data: relations,
    };
  }

  @Get('admin/category/:tourCategoryId')
  @UseGuards(JwtAuthGuard)
  async findByTourCategoryId(
    @Param('tourCategoryId') tourCategoryId: string,
  ): Promise<HttpResponse<TourCategoryCustomTourRequestResponseDto[]>> {
    const relations =
      await this.tourCategoryCustomTourRequestService.findByTourCategoryId(
        tourCategoryId,
      );
    return {
      statusCode: HttpStatus.OK,
      message:
        'Tour-category-custom-tour-request relations retrieved successfully',
      data: relations,
    };
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  async findById(
    @Param('id') id: string,
  ): Promise<HttpResponse<TourCategoryCustomTourRequestResponseDto>> {
    const relation =
      await this.tourCategoryCustomTourRequestService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message:
        'Tour-category-custom-tour-request relation retrieved successfully',
      data: relation,
    };
  }

  @Delete('admin/request/:customTourRequestId')
  @UseGuards(JwtAuthGuard)
  async deleteByCustomTourRequestId(
    @Param('customTourRequestId') customTourRequestId: string,
  ): Promise<HttpResponse<void>> {
    await this.tourCategoryCustomTourRequestService.deleteByCustomTourRequestId(
      customTourRequestId,
    );
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message:
        'Tour-category-custom-tour-request relations deleted successfully',
    };
  }

  @Delete('admin/category/:tourCategoryId')
  @UseGuards(JwtAuthGuard)
  async deleteByTourCategoryId(
    @Param('tourCategoryId') tourCategoryId: string,
  ): Promise<HttpResponse<void>> {
    await this.tourCategoryCustomTourRequestService.deleteByTourCategoryId(
      tourCategoryId,
    );
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message:
        'Tour-category-custom-tour-request relations deleted successfully',
    };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.tourCategoryCustomTourRequestService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message:
        'Tour-category-custom-tour-request relation deleted successfully',
    };
  }
}
