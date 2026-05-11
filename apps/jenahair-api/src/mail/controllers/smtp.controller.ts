import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SmtpService } from '../services/smtp.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { UpdateSmtpRequestDto } from 'src/mail/dtos/update-smtp.request.dto';
import { TestSmtpRequestDto } from 'src/mail/dtos/test-smtp.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { SmtpResponseDto } from 'src/mail/dtos/smtp.response.dto';

@Controller('smtp-config')
export class SmtpController {
  constructor(private readonly smtpService: SmtpService) { }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  async findAdmin(): Promise<HttpResponse<SmtpResponseDto | null>> {
    const config = await this.smtpService.get();
    return {
      statusCode: HttpStatus.OK,
      message: 'SMTP config retrieved successfully',
      data: config,
    };
  }

  @Put('admin')
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() dto: UpdateSmtpRequestDto
  ): Promise<HttpResponse<SmtpResponseDto>> {
    const config = await this.smtpService.update(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'SMTP config updated successfully',
      data: config,
    };
  }

  @Post('admin/test')
  @UseGuards(JwtAuthGuard)
  async testEmail(
    @Body() dto: TestSmtpRequestDto
  ): Promise<HttpResponse<{ success: boolean }>> {
    const success = await this.smtpService.testEmail(dto.email);
    return {
      statusCode: HttpStatus.OK,
      message: success ? 'Test email sent successfully' : 'Failed to send test email',
      data: { success },
    };
  }
}
