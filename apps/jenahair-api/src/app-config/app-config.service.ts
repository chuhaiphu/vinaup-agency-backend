import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAppConfigRequestDto } from 'src/app-config/dtos/update-app-config.request.dto';
import { AppConfigResponseDto } from 'src/app-config/dtos/app-config.response.dto';

@Injectable()
export class AppConfigService {
  constructor(private prismaService: PrismaService) {}

  async get(): Promise<AppConfigResponseDto> {
    let config = await this.prismaService.appConfig.findFirst();

    if (!config) {
      config = await this.prismaService.appConfig.create({
        data: {},
      });
    }

    return config;
  }

  async update(dto: UpdateAppConfigRequestDto): Promise<AppConfigResponseDto> {
    let config = await this.prismaService.appConfig.findFirst();

    if (!config) {
      config = await this.prismaService.appConfig.create({
        data: dto,
      });
    } else {
      config = await this.prismaService.appConfig.update({
        where: { id: config.id },
        data: dto,
      });
    }

    return config;
  }

  async getPublic(): Promise<AppConfigResponseDto> {
    const config = await this.get();

    return {
      id: config.id,
      maintenanceMode: config.maintenanceMode,
      faviconUrl: config.faviconUrl,
      logoUrl: config.logoUrl,
      emailContact: config.emailContact,
      phoneContact: config.phoneContact,
      addressContact: config.addressContact,
      websiteTitle: config.websiteTitle,
      websiteDescription: config.websiteDescription,
    };
  }
}
