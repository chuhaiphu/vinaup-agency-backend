import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { UpdateAppConfigRequestDto } from 'src/app-config/dtos/update-app-config.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { AppConfigResponseDto } from 'src/app-config/dtos/app-config.response.dto';

@Controller('app-config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  // ==================== PUBLIC ROUTES ====================

  @Get()
  async findPublic(): Promise<HttpResponse<AppConfigResponseDto>> {
    const config = await this.appConfigService.getPublic();
    return {
      statusCode: HttpStatus.OK,
      message: 'App config retrieved successfully',
      data: config,
    };
  }

  // ==================== ADMIN ROUTES ====================

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  async findAdmin(): Promise<HttpResponse<AppConfigResponseDto>> {
    const config = await this.appConfigService.get();
    return {
      statusCode: HttpStatus.OK,
      message: 'App config retrieved successfully',
      data: config,
    };
  }

  @Put('admin')
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() dto: UpdateAppConfigRequestDto
  ): Promise<HttpResponse<AppConfigResponseDto>> {
    const config = await this.appConfigService.update(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'App config updated successfully',
      data: config,
    };
  }
}
