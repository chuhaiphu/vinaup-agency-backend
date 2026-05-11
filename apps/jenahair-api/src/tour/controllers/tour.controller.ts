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
import { TourService } from '../services/tour.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateTourRequestDto } from 'src/tour/dtos/create-tour.request.dto';
import { UpdateTourRequestDto } from 'src/tour/dtos/update-tour.request.dto';
import { TourFilterParamDto } from 'src/tour/dtos/tour-filter.param.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { CurrentUser } from 'src/_core/decorators/current-user.decorator';
import { JwtValidationReturn } from 'src/_common/interfaces/interface';
import { ClientIp } from 'src/_core/decorators/client-ip.decorator';
import { TourResponseDto } from 'src/tour/dtos/tour.response.dto';

@Controller('tours')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  // ==================== PUBLIC ROUTES ====================

  @Get()
  async findAllPublic(
    @Query() filter: TourFilterParamDto
  ): Promise<HttpResponse<TourResponseDto[]>> {
    const result = await this.tourService.findAllPublic(filter);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tours retrieved successfully',
      data: result,
    };
  }

  @Post(':id/view')
  async incrementView(
    @Param('id') id: string,
    @ClientIp() ipAddress: string
  ): Promise<HttpResponse<unknown>> {
    const result = await this.tourService.incrementView(id, ipAddress);
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
    const result = await this.tourService.toggleLike(id, ipAddress);
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
    @Body() dto: CreateTourRequestDto,
    @CurrentUser() user: JwtValidationReturn
  ): Promise<HttpResponse<TourResponseDto>> {
    const tour = await this.tourService.create(dto, user.userId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Tour created successfully',
      data: tour,
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() filter: TourFilterParamDto
  ): Promise<HttpResponse<TourResponseDto[]>> {
    const result = await this.tourService.findAll(filter);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tours retrieved successfully',
      data: result,
    };
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string): Promise<HttpResponse<TourResponseDto>> {
    const tour = await this.tourService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tour retrieved successfully',
      data: tour,
    };
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTourRequestDto
  ): Promise<HttpResponse<TourResponseDto>> {
    const tour = await this.tourService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tour updated successfully',
      data: tour,
    };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.tourService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Tour deleted successfully',
    };
  }

  @Get(':endpoint')
  async findByEndpoint(
    @Param('endpoint') endpoint: string
  ): Promise<HttpResponse<TourResponseDto>> {
    const tour = await this.tourService.findByEndpoint(endpoint);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tour retrieved successfully',
      data: tour,
    };
  }
}
