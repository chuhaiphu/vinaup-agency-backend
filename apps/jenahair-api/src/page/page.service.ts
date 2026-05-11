import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePageRequestDto } from 'src/page/dtos/create-page.request.dto';
import { UpdatePageRequestDto } from 'src/page/dtos/update-page.request.dto';
import { PageResponseDto } from 'src/page/dtos/page.response.dto';

@Injectable()
export class PageService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreatePageRequestDto, userId?: string): Promise<PageResponseDto> {
    const existing = await this.prismaService.page.findUnique({
      where: { endpoint: dto.endpoint },
    });

    if (existing) {
      throw new ConflictException('Page with this endpoint already exists');
    }

    const { userId: dtoUserId, ...pageData } = dto;

    const page = await this.prismaService.page.create({
      data: {
        ...pageData,
        createdByUserId: dtoUserId || userId || undefined,
      },
    });

    return page;
  }

  async findAll(): Promise<PageResponseDto[]> {
    const pages = await this.prismaService.page.findMany({
      orderBy: [{ updatedAt: 'desc' }],
    });

    return pages;
  }

  async findAllPublicPages(): Promise<PageResponseDto[]> {
    const pages = await this.prismaService.page.findMany({
      where: {
        visibility: 'public',
      },
      orderBy: [{ updatedAt: 'desc' }],
    });

    return pages;
  }

  async findPagesByUserId(userId: string): Promise<PageResponseDto[]> {
    const pages = await this.prismaService.page.findMany({
      where: {
        createdByUserId: userId,
      },
      orderBy: [{ updatedAt: 'desc' }],
    });

    return pages;
  }

  async findById(id: string): Promise<PageResponseDto> {
    const page = await this.prismaService.page.findUnique({
      where: { id },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async findByEndpoint(endpoint: string) {
    const page = await this.prismaService.page.findUnique({
      where: { endpoint },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async update(id: string, dto: UpdatePageRequestDto): Promise<PageResponseDto> {
    const page = await this.prismaService.page.findUnique({
      where: { id },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    if (dto.endpoint && dto.endpoint !== page.endpoint) {
      const existing = await this.prismaService.page.findUnique({
        where: { endpoint: dto.endpoint },
      });
      if (existing) {
        throw new ConflictException('Page with this endpoint already exists');
      }
    }

    const updatedPage = await this.prismaService.page.update({
      where: { id },
      data: dto,
    });

    return updatedPage;
  }

  async delete(id: string) {
    const page = await this.prismaService.page.findUnique({
      where: { id },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    await this.prismaService.page.delete({
      where: { id },
    });
  }
}
