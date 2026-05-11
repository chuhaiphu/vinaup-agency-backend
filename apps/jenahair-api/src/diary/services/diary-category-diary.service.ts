import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiaryCategoryDiaryRequestDto } from 'src/diary/dtos/create-diary-category-diary.request.dto';
import { UpdateDiaryCategoryDiaryRequestDto } from 'src/diary/dtos/update-diary-category-diary.request.dto';
import { DiaryCategoryDiaryResponseDto } from 'src/diary/dtos/diary-category-diary.response.dto';
import { Prisma } from 'src/prisma/generated/client';

@Injectable()
export class DiaryCategoryDiaryService {
  constructor(private prismaService: PrismaService) {}

  async create(
    dto: CreateDiaryCategoryDiaryRequestDto,
  ): Promise<DiaryCategoryDiaryResponseDto> {
    try {
      const relation = await this.prismaService.diaryCategoryDiary.create({
        data: {
          diaryCategoryId: dto.diaryCategoryId,
          diaryId: dto.diaryId,
          sortOrder: dto.sortOrder ?? 0,
        },
        include: {
          diaryCategory: {
            include: {
              parent: true,
              children: true,
            },
          },
          diary: {
            include: {
              createdBy: true,
              diaryCategoryDiaries: true,
            },
          },
        },
      });

      return relation;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Relation between this diary category and diary already exists',
        );
      }
      throw error;
    }
  }

  async findById(id: string): Promise<DiaryCategoryDiaryResponseDto> {
    const relation = await this.prismaService.diaryCategoryDiary.findUnique({
      where: { id },
      include: {
        diaryCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        diary: {
          include: {
            createdBy: true,
            diaryCategoryDiaries: true,
          },
        },
      },
    });

    if (!relation) {
      throw new NotFoundException('Diary-category-diary relation not found');
    }

    return relation;
  }

  async findByDiaryId(diaryId: string): Promise<DiaryCategoryDiaryResponseDto[]> {
    const relations = await this.prismaService.diaryCategoryDiary.findMany({
      where: { diaryId },
      orderBy: [{ sortOrder: 'asc' }],
      include: {
        diaryCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        diary: {
          include: {
            createdBy: true,
            diaryCategoryDiaries: true,
          },
        },
      },
    });

    return relations;
  }

  async findByDiaryCategoryId(
    diaryCategoryId: string,
  ): Promise<DiaryCategoryDiaryResponseDto[]> {
    const relations = await this.prismaService.diaryCategoryDiary.findMany({
      where: { diaryCategoryId },
      orderBy: [{ sortOrder: 'asc' }],
      include: {
        diaryCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        diary: {
          include: {
            createdBy: true,
            diaryCategoryDiaries: true,
          },
        },
      },
    });

    return relations;
  }

  async findAll(): Promise<DiaryCategoryDiaryResponseDto[]> {
    const relations = await this.prismaService.diaryCategoryDiary.findMany({
      orderBy: [{ sortOrder: 'asc' }],
      include: {
        diaryCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        diary: {
          include: {
            createdBy: true,
            diaryCategoryDiaries: true,
          },
        },
      },
    });

    return relations;
  }

  async update(
    id: string,
    dto: UpdateDiaryCategoryDiaryRequestDto,
  ): Promise<DiaryCategoryDiaryResponseDto> {
    const relation = await this.prismaService.diaryCategoryDiary.findUnique({
      where: { id },
    });

    if (!relation) {
      throw new NotFoundException('Diary-category-diary relation not found');
    }

    const updatedRelation = await this.prismaService.diaryCategoryDiary.update({
      where: { id },
      data: {
        sortOrder: dto.sortOrder,
      },
      include: {
        diaryCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        diary: {
          include: {
            createdBy: true,
            diaryCategoryDiaries: true,
          },
        },
      },
    });

    return updatedRelation;
  }

  async delete(id: string): Promise<void> {
    const relation = await this.prismaService.diaryCategoryDiary.findUnique({
      where: { id },
    });

    if (!relation) {
      throw new NotFoundException('Diary-category-diary relation not found');
    }

    await this.prismaService.diaryCategoryDiary.delete({
      where: { id },
    });
  }

  async deleteByDiaryId(diaryId: string): Promise<void> {
    await this.prismaService.diaryCategoryDiary.deleteMany({
      where: { diaryId },
    });
  }

  async deleteByDiaryCategoryId(diaryCategoryId: string): Promise<void> {
    await this.prismaService.diaryCategoryDiary.deleteMany({
      where: { diaryCategoryId },
    });
  }
}
