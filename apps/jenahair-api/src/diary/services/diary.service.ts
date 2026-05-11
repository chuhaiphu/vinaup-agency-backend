import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiaryRequestDto } from 'src/diary/dtos/create-diary.request.dto';
import { UpdateDiaryRequestDto } from 'src/diary/dtos/update-diary.request.dto';
import { DiaryFilterParamDto } from 'src/diary/dtos/diary-filter.param.dto';
import { Prisma } from 'src/prisma/generated/client';
import { DiaryResponseDto } from 'src/diary/dtos/diary.response.dto';

@Injectable()
export class DiaryService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateDiaryRequestDto, userId?: string): Promise<DiaryResponseDto> {
    const existing = await this.prismaService.diary.findUnique({
      where: { endpoint: dto.endpoint },
    });

    if (existing) {
      throw new ConflictException('Diary with this endpoint already exists');
    }

    const { categoryIds, userId: dtoUserId, ...diaryData } = dto;

    const diary = await this.prismaService.diary.create({
      data: {
        ...diaryData,
        createdByUserId: dtoUserId || userId || undefined,
        diaryCategoryDiaries: categoryIds?.length
          ? {
              create: categoryIds.map((categoryId, index) => ({
                diaryCategoryId: categoryId,
                sortOrder: index,
              })),
            }
          : undefined,
      },
      include: {
        diaryCategoryDiaries: {
          include: {
            diaryCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    return diary ;
  }

  async findAll(filter: DiaryFilterParamDto): Promise<DiaryResponseDto[]> {
    const where: Prisma.DiaryWhereInput = {};

    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter.visibility) {
      where.visibility = filter.visibility;
    }

    if (filter.categoryId) {
      where.diaryCategoryDiaries = {
        some: { diaryCategoryId: filter.categoryId },
      };
    }

    const diaries = await this.prismaService.diary.findMany({
      where,
      orderBy: [
        { updatedAt: 'desc' },
        { sortOrder: 'asc' },
      ],
      include: {
        createdBy: true,
        diaryCategoryDiaries: {
          include: {
            diaryCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    return diaries;
  }

  async findAllPublic(filter: DiaryFilterParamDto): Promise<DiaryResponseDto[]> {
    const where: Prisma.DiaryWhereInput = {
      visibility: 'public',
    };

    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter.categoryId) {
      where.diaryCategoryDiaries = {
        some: { diaryCategoryId: filter.categoryId },
      };
    }

    const diaries = await this.prismaService.diary.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { updatedAt: 'desc' },
      ],
      include: {
        createdBy: true,
        diaryCategoryDiaries: {
          include: {
            diaryCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    return diaries;
  }

  async findAllPublicDiariesPinnedToHome(): Promise<DiaryResponseDto[]> {
    const diaries = await this.prismaService.diary.findMany({
      where: {
        visibility: 'public',
        sortOrder: {
          not: -1,
        },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { updatedAt: 'desc' },
      ],
      include: {
        createdBy: true,
        diaryCategoryDiaries: {
          include: {
            diaryCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    return diaries;
  }

  async findDiariesByUserId(userId: string): Promise<DiaryResponseDto[]> {
    const diaries = await this.prismaService.diary.findMany({
      where: {
        createdByUserId: userId,
      },
      orderBy: [
        { updatedAt: 'desc' },
      ],
      include: {
        createdBy: true,
        diaryCategoryDiaries: {
          include: {
            diaryCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    return diaries;
  }

  async hasViewedToday(diaryId: string, ipAddress: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const view = await this.prismaService.diaryView.findFirst({
      where: {
        diaryId,
        ipAddress,
        viewedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    return !!view;
  }

  async hasLiked(diaryId: string, ipAddress: string): Promise<boolean> {
    const like = await this.prismaService.diaryLike.findUnique({
      where: {
        diaryId_ipAddress: {
          diaryId,
          ipAddress,
        },
      },
    });

    return !!like;
  }

  async findById(id: string): Promise<DiaryResponseDto> {
    const diary = await this.prismaService.diary.findUnique({
      where: { id },
      include: {
        createdBy: true,
        diaryCategoryDiaries: {
          include: {
            diaryCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    if (!diary) {
      throw new NotFoundException('Diary not found');
    }

    return diary ;
  }

  async findByEndpoint(endpoint: string): Promise<DiaryResponseDto> {
    const diary = await this.prismaService.diary.findUnique({
      where: { endpoint, visibility: 'public' },
      include: {
        createdBy: true,
        diaryCategoryDiaries: {
          include: {
            diaryCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    if (!diary) {
      throw new NotFoundException('Diary not found');
    }

    return diary ;
  }

  async update(id: string, dto: UpdateDiaryRequestDto): Promise<DiaryResponseDto> {
    const diary = await this.prismaService.diary.findUnique({
      where: { id },
    });

    if (!diary) {
      throw new NotFoundException('Diary not found');
    }

    if (dto.endpoint && dto.endpoint !== diary.endpoint) {
      const existing = await this.prismaService.diary.findUnique({
        where: { endpoint: dto.endpoint },
      });
      if (existing) {
        throw new ConflictException('Diary with this endpoint already exists');
      }
    }

    const { categoryIds, ...diaryData } = dto;

    if (categoryIds !== undefined) {
      await this.prismaService.diaryCategoryDiary.deleteMany({
        where: { diaryId: id },
      });

      if (categoryIds.length > 0) {
        await this.prismaService.diaryCategoryDiary.createMany({
          data: categoryIds.map((categoryId, index) => ({
            diaryId: id,
            diaryCategoryId: categoryId,
            sortOrder: index,
          })),
        });
      }
    }

    const updatedDiary = await this.prismaService.diary.update({
      where: { id },
      data: diaryData,
      include: {
        createdBy: true,
        diaryCategoryDiaries: {
          include: {
            diaryCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    return updatedDiary ;
  }

  async delete(id: string) {
    const diary = await this.prismaService.diary.findUnique({
      where: { id },
    });

    if (!diary) {
      throw new NotFoundException('Diary not found');
    }

    await this.prismaService.diary.delete({
      where: { id },
    });
  }

  async incrementView(id: string, ipAddress: string) {
    const diary = await this.prismaService.diary.findUnique({
      where: { id },
    });

    if (!diary) {
      throw new NotFoundException('Diary not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingView = await this.prismaService.diaryView.findFirst({
      where: {
        diaryId: id,
        ipAddress,
        viewedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (!existingView) {
      await this.prismaService.$transaction(async (tx) => {
        await tx.diaryView.create({
          data: {
            diaryId: id,
            ipAddress,
          },
        });
        await tx.diary.update({
          where: { id },
          data: { views: { increment: 1 } },
        });
      });
    }

    return { success: true };
  }

  async toggleLike(id: string, ipAddress: string) {
    const diary = await this.prismaService.diary.findUnique({
      where: { id },
    });

    if (!diary) {
      throw new NotFoundException('Diary not found');
    }

    const existingLike = await this.prismaService.diaryLike.findUnique({
      where: {
        diaryId_ipAddress: {
          diaryId: id,
          ipAddress,
        },
      },
    });

    if (existingLike) {
      await this.prismaService.$transaction(async (tx) => {
        await tx.diaryLike.delete({
          where: {
            diaryId_ipAddress: {
              diaryId: id,
              ipAddress,
            },
          },
        });
        await tx.diary.update({
          where: { id },
          data: { likes: { decrement: 1 } },
        });
      });
      return { liked: false };
    } else {
      await this.prismaService.$transaction(async (tx) => {
        await tx.diaryLike.create({
          data: { diaryId: id, ipAddress },
        });
        await tx.diary.update({
          where: { id },
          data: { likes: { increment: 1 } },
        });
      });
      return { liked: true };
    }
  }
}
