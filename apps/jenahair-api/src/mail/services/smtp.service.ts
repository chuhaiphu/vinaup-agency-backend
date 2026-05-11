import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/services/mail.service';
import { UpdateSmtpRequestDto } from 'src/mail/dtos/update-smtp.request.dto';
import { SmtpResponseDto } from 'src/mail/dtos/smtp.response.dto';

@Injectable()
export class SmtpService {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailService
  ) { }

  async get(): Promise<SmtpResponseDto | null> {
    const config = await this.prismaService.smtpConfig.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (!config) {
      return null;
    }

    // Mask password for security
    return {
      ...config,
      password: '********',
    };
  }

  async update(dto: UpdateSmtpRequestDto): Promise<SmtpResponseDto> {
    let config = await this.prismaService.smtpConfig.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (!config) {
      config = await this.prismaService.smtpConfig.create({
        data: {
          ...dto,
          password: dto.password ?? '',
        },
      });
    } else {
      config = await this.prismaService.smtpConfig.update({
        where: { id: config.id },
        data: dto,
      });
    }

    return {
      ...config,
      password: '********',
    };
  }

  async testEmail(email: string): Promise<boolean> {
    const config = await this.prismaService.smtpConfig.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (!config) {
      throw new NotFoundException('SMTP config not found');
    }

    return this.mailService.sendMail({
      to: email,
      subject: 'SMTP Test Email',
      html: '<h2>SMTP Configuration Test</h2><p>If you receive this email, your SMTP configuration is working correctly.</p>',
    });
  }
}
