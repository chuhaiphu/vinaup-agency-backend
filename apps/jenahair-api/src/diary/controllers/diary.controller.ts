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
import { DiaryService } from '../services/diary.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateDiaryRequestDto } from 'src/diary/dtos/create-diary.request.dto';
import { UpdateDiaryRequestDto } from 'src/diary/dtos/update-diary.request.dto';
import { DiaryFilterParamDto } from 'src/diary/dtos/diary-filter.param.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { CurrentUser } from 'src/_core/decorators/current-user.decorator';
import { JwtValidationReturn } from 'src/_common/interfaces/interface';
import { ClientIp } from 'src/_core/decorators/client-ip.decorator';
import { DiaryResponseDto } from 'src/diary/dtos/diary.response.dto';

@Controller('diaries')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  // ==================== PUBLIC ROUTES ====================

  @Get()
  async findAllPublic(
    @Query() filter: DiaryFilterParamDto
  ): Promise<HttpResponse<DiaryResponseDto[]>> {
    const result = await this.diaryService.findAllPublic(filter);
    return {
      statusCode: HttpStatus.OK,
      message: 'Diaries retrieved successfully',
      data: result,
    };
  }

  @Post(':id/view')
  async incrementView(
    @Param('id') id: string,
    @ClientIp() ipAddress: string
  ): Promise<HttpResponse<unknown>> {
    const result = await this.diaryService.incrementView(id, ipAddress);
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
    const result = await this.diaryService.toggleLike(id, ipAddress);
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
    @Body() dto: CreateDiaryRequestDto,
    @CurrentUser() user: JwtValidationReturn
  ): Promise<HttpResponse<DiaryResponseDto>> {
    const diary = await this.diaryService.create(dto, user.userId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Diary created successfully',
      data: diary,
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() filter: DiaryFilterParamDto
  ): Promise<HttpResponse<DiaryResponseDto[]>> {
    const result = await this.diaryService.findAll(filter);
    return {
      statusCode: HttpStatus.OK,
      message: 'Diaries retrieved successfully',
      data: result,
    };
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string): Promise<HttpResponse<DiaryResponseDto>> {
    const diary = await this.diaryService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Diary retrieved successfully',
      data: diary,
    };
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDiaryRequestDto
  ): Promise<HttpResponse<DiaryResponseDto>> {
    const diary = await this.diaryService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Diary updated successfully',
      data: diary,
    };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.diaryService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Diary deleted successfully',
    };
  }

  @Get(':endpoint')
  async findByEndpoint(
    @Param('endpoint') endpoint: string
  ): Promise<HttpResponse<DiaryResponseDto>> {
    const diary = await this.diaryService.findByEndpoint(endpoint);
    return {
      statusCode: HttpStatus.OK,
      message: 'Diary retrieved successfully',
      data: diary,
    };
  }
}
