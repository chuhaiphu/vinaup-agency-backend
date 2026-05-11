import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiaryCategoryRequestDto } from 'src/diary/dtos/create-diary-category.request.dto';
import { UpdateDiaryCategoryRequestDto } from 'src/diary/dtos/update-diary-category.request.dto';
import { DiaryCategoryResponseDto } from 'src/diary/dtos/diary-category.response.dto';
import { UPDATE_SORT_ORDER_OFFSET } from 'src/_common/constants/sort-order.constant';

@Injectable()
export class DiaryCategoryService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateDiaryCategoryRequestDto): Promise<DiaryCategoryResponseDto> {
    // Check if endpoint already exists
    const existing = await this.prismaService.diaryCategory.findUnique({
      where: { endpoint: dto.endpoint },
    });

    if (existing) {
      throw new ConflictException('Category with this endpoint already exists');
    }

    // Get root category as default parent
    const rootCategory = await this.prismaService.diaryCategory.findUnique({
      where: { endpoint: '__root__' },
    });

    if (!rootCategory) {
      throw new NotFoundException('Root category not found');
    }

    // Get next available sortOrder under root
    const maxSortOrder = await this.getGreatestSortOrderValue(rootCategory.id);
    const sortOrder = maxSortOrder + 1;

    // Create category
    const category = await this.prismaService.diaryCategory.create({
      data: {
        title: dto.title,
        endpoint: dto.endpoint,
        parentId: rootCategory.id,
        sortOrder,
        videoPosition: 'bottom', // default value
      },
      include: {
        parent: true,
        children: true,
      },
    });

    return category;
  }

  async findAll(): Promise<DiaryCategoryResponseDto[]> {
    const categories = await this.prismaService.diaryCategory.findMany({
      orderBy: [
        { updatedAt: 'desc' },
      ],
      include: {
        parent: true,
        children: true,
      },
    });

    return categories;
  }

  async findById(id: string): Promise<DiaryCategoryResponseDto> {
    const category = await this.prismaService.diaryCategory.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          orderBy: { sortOrder: 'asc' },
        },
        diaryCategoryDiaries: {
          include: {
            diary: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findByEndpoint(endpoint: string): Promise<DiaryCategoryResponseDto> {
    const category = await this.prismaService.diaryCategory.findUnique({
      where: { endpoint },
      include: {
        children: {
          orderBy: { sortOrder: 'asc' },
        },
        diaryCategoryDiaries: {
          where: {
            diary: {
              visibility: 'public',
            },
          },
          include: {
            diary: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, dto: UpdateDiaryCategoryRequestDto): Promise<DiaryCategoryResponseDto> {
    const category = await this.prismaService.diaryCategory.findUnique({
      where: { id },
      include: {
        parent: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (dto.endpoint && dto.endpoint !== category.endpoint) {
      const existing = await this.prismaService.diaryCategory.findUnique({
        where: { endpoint: dto.endpoint },
      });
      if (existing) {
        throw new ConflictException('Category with this endpoint already exists');
      }
    }

    const oldParentId = category.parent?.id;
    const newParentId = dto.parentId ?? oldParentId;
    const oldSortOrder = category.sortOrder;
    const newSortOrder = dto.sortOrder ?? undefined;

    return this.prismaService.$transaction(async (tx) => {
      // ===== CASE 1: update sort order on the same parent =====
      if (
        newSortOrder !== undefined &&
        oldParentId === newParentId &&
        newSortOrder !== oldSortOrder
      ) {
        // 1. Move item out of the sort system
        await tx.diaryCategory.update({
          where: { id },
          data: { sortOrder: UPDATE_SORT_ORDER_OFFSET * -1 },
        });

        // move up (or drag up)
        if (newSortOrder < oldSortOrder) {
          // bump items between old and new sort order to temp value
          await tx.diaryCategory.updateMany({
            where: {
              parentId: oldParentId,
              sortOrder: {
                gte: newSortOrder,
                lt: oldSortOrder,
              },
            },
            data: {
              sortOrder: { increment: UPDATE_SORT_ORDER_OFFSET },
            },
          });

          await tx.diaryCategory.updateMany({
            where: {
              parentId: oldParentId,
              sortOrder: {
                gte: newSortOrder + UPDATE_SORT_ORDER_OFFSET,
                lt: oldSortOrder + UPDATE_SORT_ORDER_OFFSET,
              },
            },
            data: {
              sortOrder: { decrement: UPDATE_SORT_ORDER_OFFSET - 1 },
            },
          });

        }
        // move down (or drag down)
        else {
          // bump items between old and new sort order to temp value
          await tx.diaryCategory.updateMany({
            where: {
              parentId: oldParentId,
              sortOrder: {
                gt: oldSortOrder,
                lte: newSortOrder,
              },
            },
            data: {
              sortOrder: { increment: UPDATE_SORT_ORDER_OFFSET },
            },
          });

          await tx.diaryCategory.updateMany({
            where: {
              parentId: oldParentId,
              sortOrder: {
                gt: oldSortOrder + UPDATE_SORT_ORDER_OFFSET,
                lte: newSortOrder + UPDATE_SORT_ORDER_OFFSET,
              },
            },
            data: {
              sortOrder: { decrement: UPDATE_SORT_ORDER_OFFSET + 1 },
            },
          });
        }

        await tx.diaryCategory.update({
          where: { id },
          data: {
            sortOrder: newSortOrder,
          },
        });
      }

      // ===== CASE 2: update sort order on a different parent =====
      if (oldParentId !== newParentId) {
        // 1. remove from old parent
        await tx.diaryCategory.update({
          where: { id },
          data: {
            parentId: null,
            sortOrder: UPDATE_SORT_ORDER_OFFSET * -1,
          },
        });

        // 2. compact old parent siblings sort order
        // bump items greater than old sort order to temp value
        await tx.diaryCategory.updateMany({
          where: {
            parentId: oldParentId,
            sortOrder: { gt: oldSortOrder },
          },
          data: {
            sortOrder: { increment: UPDATE_SORT_ORDER_OFFSET },
          },
        });
        await tx.diaryCategory.updateMany({
          where: {
            parentId: oldParentId,
            sortOrder: { gt: oldSortOrder + UPDATE_SORT_ORDER_OFFSET },
          },
          data: {
            sortOrder: { decrement: UPDATE_SORT_ORDER_OFFSET + 1 },
          },
        });

        // 3. determine new sort order if not provided
        let targetSortOrder = newSortOrder;
        if (targetSortOrder === undefined) {
          targetSortOrder = (await this.getGreatestSortOrderValue(newParentId ?? null)) + 1;
        }

        // 4. shift new parent
        // bump items greater than or equal to target sort order to temp value
        await tx.diaryCategory.updateMany({
          where: {
            parentId: newParentId,
            sortOrder: { gte: targetSortOrder },
          },
          data: {
            sortOrder: { increment: UPDATE_SORT_ORDER_OFFSET },
          },
        });
        await tx.diaryCategory.updateMany({
          where: {
            parentId: newParentId,
            sortOrder: { gte: targetSortOrder + UPDATE_SORT_ORDER_OFFSET },
          },
          data: {
            sortOrder: { decrement: UPDATE_SORT_ORDER_OFFSET - 1 },
          },
        });

        // 5. assign to new parent
        await tx.diaryCategory.update({
          where: { id },
          data: {
            parentId: newParentId,
            sortOrder: targetSortOrder,
          },
        });
      }

      // ===== CASE 3: update other fields (title, endpoint, etc) =====
      await tx.diaryCategory.update({
        where: { id },
        data: {
          title: dto.title,
          endpoint: dto.endpoint,
          description: dto.description,
          videoUrl: dto.videoUrl,
          videoThumbnailUrl: dto.videoThumbnailUrl,
          videoPosition: dto.videoPosition,
          mainImageUrl: dto.mainImageUrl,
        },
      });

      const updatedCategory = await tx.diaryCategory.findUnique({
        where: { id },
        include: {
          parent: true,
          children: true,
        },
      });

      if (!updatedCategory) {
        throw new NotFoundException('Failed to update diary category');
      }

      return updatedCategory;
    });
  }

  async delete(id: string) {
    const category = await this.prismaService.diaryCategory.findUnique({
      where: { id },
      include: {
        parent: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.prismaService.$transaction(async (tx) => {
      await tx.diaryCategory.delete({
        where: { id },
      });

      // compact siblings sort order
      // bump items greater than current sort order to temp value
      await tx.diaryCategory.updateMany({
        where: {
          parentId: category.parent?.id,
          sortOrder: {
            gt: category.sortOrder,
          },
        },
        data: {
          sortOrder: { increment: UPDATE_SORT_ORDER_OFFSET },
        },
      });
      await tx.diaryCategory.updateMany({
        where: {
          parentId: category.parent?.id,
          sortOrder: {
            gt: category.sortOrder + UPDATE_SORT_ORDER_OFFSET,
          },
        },
        data: {
          sortOrder: {
            decrement: UPDATE_SORT_ORDER_OFFSET + 1,
          },
        },
      });
    });
  }

  async findAvailableSortOrders(parentId: string): Promise<number[]> {
    // Get the maximum sortOrder for the given parent
    const maxSortOrder = await this.getGreatestSortOrderValue(parentId);
    // Generate array from 0 to maxSortOrder + 1
    // This allows inserting at any position or appending to the end
    const availableSortOrders = Array.from(
      { length: maxSortOrder + 2 },
      (_, index) => index
    );

    return availableSortOrders;
  }

  async getGreatestSortOrderValue(parentId: string | null): Promise<number> {
    const result = await this.prismaService.diaryCategory.aggregate({
      where: { parentId },
      _max: {
        sortOrder: true,
      },
    });
    return result._max.sortOrder ?? -1;
  }
}
