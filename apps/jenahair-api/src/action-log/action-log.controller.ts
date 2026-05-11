import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ActionLogService } from './action-log.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { ActionLogResponseDto } from 'src/action-log/dtos/action-log.response.dto';

@Controller('action-logs')
export class ActionLogController {
  constructor(private readonly actionLogService: ActionLogService) {}

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('entityType') entityType?: string,
    @Query('userId') userId?: string
  ): Promise<HttpResponse<ActionLogResponseDto[]>> {
    const result = await this.actionLogService.findAll(entityType, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Action logs retrieved successfully',
      data: result,
    };
  }

  @Get('admin/:entityType/:entityId')
  @UseGuards(JwtAuthGuard)
  async findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string
  ): Promise<HttpResponse<ActionLogResponseDto[]>> {
    const logs = await this.actionLogService.findByEntity(entityType, entityId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Action logs retrieved successfully',
      data: logs,
    };
  }
}
