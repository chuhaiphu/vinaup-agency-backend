import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMenuRequestDto } from 'src/menu/dtos/create-menu.request.dto';
import { UpdateMenuRequestDto } from 'src/menu/dtos/update-menu.request.dto';
import { MenuResponseDto } from 'src/menu/dtos/menu.response.dto';
import { UPDATE_SORT_ORDER_OFFSET } from 'src/_common/constants/sort-order.constant';

@Injectable()
export class MenuService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateMenuRequestDto): Promise<MenuResponseDto> {
    // Get root menu as default parent
    const rootMenu = await this.prismaService.menu.findFirst({
      where: { isRoot: true },
    });

    if (!rootMenu) {
      throw new NotFoundException('Root menu not found');
    }

    // Get next available sortOrder under root
    const maxSortOrder = await this.getGreatestSortOrderValue(rootMenu.id);
    const sortOrder = maxSortOrder + 1;

    // Create menu
    const menu = await this.prismaService.menu.create({
      data: {
        title: dto.title,
        customUrl: dto.customUrl,
        parentId: rootMenu.id,
        sortOrder,
        isRoot: false,
      },
      include: {
        parent: true,
        children: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return menu;
  }

  async findAll(): Promise<MenuResponseDto[]> {
    const menus = await this.prismaService.menu.findMany({
      orderBy: [
        { updatedAt: 'desc' },
      ],
      include: {
        parent: true,
        children: true,
      },
    });

    return menus;
  }

  async findRootMenus(): Promise<MenuResponseDto[]> {
    const menus = await this.prismaService.menu.findMany({
      where: { isRoot: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          orderBy: { sortOrder: 'asc' },
          include: {
            children: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });

    return menus;
  }

  async findById(id: string) {
    const menu = await this.prismaService.menu.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    return menu;
  }

  async update(id: string, dto: UpdateMenuRequestDto): Promise<MenuResponseDto> {
    const menu = await this.prismaService.menu.findUnique({
      where: { id },
      include: {
        parent: true,
      },
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    const oldParentId = menu.parent?.id;
    const newParentId = dto.parentId ?? oldParentId;
    const oldSortOrder = menu.sortOrder;
    const newSortOrder = dto.sortOrder ?? undefined;

    return this.prismaService.$transaction(async (tx) => {
      // ===== CASE 1: update sort order on the same parent =====
      if (
        newSortOrder !== undefined &&
        oldParentId === newParentId &&
        newSortOrder !== oldSortOrder
      ) {
        // 1. Move item out of the sort system
        await tx.menu.update({
          where: { id },
          data: { sortOrder: UPDATE_SORT_ORDER_OFFSET * -1 },
        });

        // move up (or drag up)
        if (newSortOrder < oldSortOrder) {
          // bump items between old and new sort order to temp value
          await tx.menu.updateMany({
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

          await tx.menu.updateMany({
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
          await tx.menu.updateMany({
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

          await tx.menu.updateMany({
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

        await tx.menu.update({
          where: { id },
          data: {
            sortOrder: newSortOrder,
          },
        });
      }

      // ===== CASE 2: update sort order on a different parent =====
      if (oldParentId !== newParentId) {
        // 1. remove from old parent
        await tx.menu.update({
          where: { id },
          data: {
            parentId: null,
            sortOrder: UPDATE_SORT_ORDER_OFFSET * -1,
          },
        });

        // 2. compact old parent siblings sort order
        // bump items greater than old sort order to temp value
        await tx.menu.updateMany({
          where: {
            parentId: oldParentId,
            sortOrder: { gt: oldSortOrder },
          },
          data: {
            sortOrder: { increment: UPDATE_SORT_ORDER_OFFSET },
          },
        });
        await tx.menu.updateMany({
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
        await tx.menu.updateMany({
          where: {
            parentId: newParentId,
            sortOrder: { gte: targetSortOrder },
          },
          data: {
            sortOrder: { increment: UPDATE_SORT_ORDER_OFFSET },
          },
        });
        await tx.menu.updateMany({
          where: {
            parentId: newParentId,
            sortOrder: { gte: targetSortOrder + UPDATE_SORT_ORDER_OFFSET },
          },
          data: {
            sortOrder: { decrement: UPDATE_SORT_ORDER_OFFSET - 1 },
          },
        });

        // 5. assign to new parent
        await tx.menu.update({
          where: { id },
          data: {
            parentId: newParentId,
            sortOrder: targetSortOrder,
          },
        });
      }

      // ===== CASE 3: update other fields (title, description, etc) =====
      if (dto.title || dto.description !== undefined || dto.customUrl !== undefined) {
        await tx.menu.update({
          where: { id },
          data: {
            title: dto.title,
            description: dto.description,
            customUrl: dto.customUrl,
          },
        });
      }

      const updatedMenu = await tx.menu.findUnique({
        where: { id },
        include: {
          parent: true,
          children: true,
        },
      });

      if (!updatedMenu) {
        throw new NotFoundException('Failed to update menu');
      }

      return updatedMenu;
    });
  }

  async delete(id: string) {
    const menu = await this.prismaService.menu.findUnique({
      where: { id },
      include: {
        parent: true,
      },
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    await this.prismaService.$transaction(async (tx) => {
      await tx.menu.delete({
        where: { id },
      });

      // compact siblings sort order
      // bump items greater than current sort order to temp value
      await tx.menu.updateMany({
        where: {
          parentId: menu.parent?.id,
          sortOrder: {
            gt: menu.sortOrder,
          },
        },
        data: {
          sortOrder: { increment: UPDATE_SORT_ORDER_OFFSET },
        },
      });
      await tx.menu.updateMany({
        where: {
          parentId: menu.parent?.id,
          sortOrder: {
            gt: menu.sortOrder + UPDATE_SORT_ORDER_OFFSET,
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
    const result = await this.prismaService.menu.aggregate({
      where: { parentId },
      _max: {
        sortOrder: true,
      },
    });
    return result._max.sortOrder ?? -1;
  }
}
