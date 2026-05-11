import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMediaRequestDto } from 'src/media/dtos/create-media.request.dto';
import { UpdateMediaRequestDto } from 'src/media/dtos/update-media.request.dto';
import { MediaResponseDto } from 'src/media/dtos/media.response.dto';

@Injectable()
export class MediaService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateMediaRequestDto): Promise<MediaResponseDto> {
    const existing = await this.prismaService.media.findUnique({
      where: { url: dto.url },
    });

    if (existing) {
      throw new ConflictException('Media with this URL already exists');
    }

    const media = await this.prismaService.media.create({
      data: dto,
    });

    return media;
  }

  async findAll(folder?: string): Promise<MediaResponseDto[]> {
    const where = folder ? { folder } : {};

    const media = await this.prismaService.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return media;
  }

  async findById(id: string): Promise<MediaResponseDto> {
    const media = await this.prismaService.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return media;
  }

  async update(id: string, dto: UpdateMediaRequestDto): Promise<MediaResponseDto> {
    const media = await this.prismaService.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    const updatedMedia = await this.prismaService.media.update({
      where: { id },
      data: dto,
    });

    return updatedMedia;
  }

  async delete(id: string) {
    const media = await this.prismaService.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    await this.prismaService.media.delete({
      where: { id },
    });
  }

  async getFolders() {
    const folders = await this.prismaService.media.findMany({
      select: { folder: true },
      distinct: ['folder'],
    });

    return folders.map((f) => f.folder);
  }
}
