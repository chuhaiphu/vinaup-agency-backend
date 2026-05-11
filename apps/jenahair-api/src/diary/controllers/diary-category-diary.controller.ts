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
import { DiaryCategoryDiaryService } from '../services/diary-category-diary.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateDiaryCategoryDiaryRequestDto } from 'src/diary/dtos/create-diary-category-diary.request.dto';
import { UpdateDiaryCategoryDiaryRequestDto } from 'src/diary/dtos/update-diary-category-diary.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { DiaryCategoryDiaryResponseDto } from 'src/diary/dtos/diary-category-diary.response.dto';

@Controller('diary-category-diaries')
export class DiaryCategoryDiaryController {
  constructor(
    private readonly diaryCategoryDiaryService: DiaryCategoryDiaryService,
  ) {}

  // ==================== PUBLIC ROUTES (GET, no guard) ====================

  @Get()
  async findAll(): Promise<HttpResponse<DiaryCategoryDiaryResponseDto[]>> {
    const relations = await this.diaryCategoryDiaryService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Diary-category-diary relations retrieved successfully',
      data: relations,
    };
  }

  @Get('diary/:diaryId')
  async findByDiaryId(
    @Param('diaryId') diaryId: string,
  ): Promise<HttpResponse<DiaryCategoryDiaryResponseDto[]>> {
    const relations = await this.diaryCategoryDiaryService.findByDiaryId(diaryId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Diary-category-diary relations retrieved successfully',
      data: relations,
    };
  }

  @Get('category/:diaryCategoryId')
  async findByDiaryCategoryId(
    @Param('diaryCategoryId') diaryCategoryId: string,
  ): Promise<HttpResponse<DiaryCategoryDiaryResponseDto[]>> {
    const relations =
      await this.diaryCategoryDiaryService.findByDiaryCategoryId(diaryCategoryId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Diary-category-diary relations retrieved successfully',
      data: relations,
    };
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
  ): Promise<HttpResponse<DiaryCategoryDiaryResponseDto>> {
    const relation = await this.diaryCategoryDiaryService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Diary-category-diary relation retrieved successfully',
      data: relation,
    };
  }

  // ==================== ADMIN ROUTES (guard) ====================

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateDiaryCategoryDiaryRequestDto,
  ): Promise<HttpResponse<DiaryCategoryDiaryResponseDto>> {
    const relation = await this.diaryCategoryDiaryService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Diary-category-diary relation created successfully',
      data: relation,
    };
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDiaryCategoryDiaryRequestDto,
  ): Promise<HttpResponse<DiaryCategoryDiaryResponseDto>> {
    const relation = await this.diaryCategoryDiaryService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Diary-category-diary relation updated successfully',
      data: relation,
    };
  }

  @Delete('admin/diary/:diaryId')
  @UseGuards(JwtAuthGuard)
  async deleteByDiaryId(@Param('diaryId') diaryId: string): Promise<HttpResponse<void>> {
    await this.diaryCategoryDiaryService.deleteByDiaryId(diaryId);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Diary-category-diary relations deleted successfully',
    };
  }

  @Delete('admin/category/:diaryCategoryId')
  @UseGuards(JwtAuthGuard)
  async deleteByDiaryCategoryId(
    @Param('diaryCategoryId') diaryCategoryId: string,
  ): Promise<HttpResponse<void>> {
    await this.diaryCategoryDiaryService.deleteByDiaryCategoryId(diaryCategoryId);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Diary-category-diary relations deleted successfully',
    };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.diaryCategoryDiaryService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Diary-category-diary relation deleted successfully',
    };
  }
}
