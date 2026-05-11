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
import { MediaService } from './media.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateMediaRequestDto } from 'src/media/dtos/create-media.request.dto';
import { UpdateMediaRequestDto } from 'src/media/dtos/update-media.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { MediaResponseDto } from 'src/media/dtos/media.response.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateMediaRequestDto
  ): Promise<HttpResponse<MediaResponseDto>> {
    const media = await this.mediaService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Media created successfully',
      data: media,
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  async findAll(@Query('folder') folder?: string): Promise<HttpResponse<MediaResponseDto[]>> {
    const media = await this.mediaService.findAll(folder);
    return {
      statusCode: HttpStatus.OK,
      message: 'Media retrieved successfully',
      data: media,
    };
  }

  @Get('admin/folders')
  @UseGuards(JwtAuthGuard)
  async findFolders(): Promise<HttpResponse<unknown>> {
    const folders = await this.mediaService.getFolders();
    return {
      statusCode: HttpStatus.OK,
      message: 'Folders retrieved successfully',
      data: folders,
    };
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string): Promise<HttpResponse<MediaResponseDto>> {
    const media = await this.mediaService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Media retrieved successfully',
      data: media,
    };
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMediaRequestDto
  ): Promise<HttpResponse<MediaResponseDto>> {
    const media = await this.mediaService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Media updated successfully',
      data: media,
    };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.mediaService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Media deleted successfully',
    };
  }
}
