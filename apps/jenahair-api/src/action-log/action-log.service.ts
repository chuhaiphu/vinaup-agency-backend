import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/prisma/generated/client';
import { ActionLogResponseDto } from 'src/action-log/dtos/action-log.response.dto';

export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE';

export interface CreateActionLogDto {
  userId?: string;
  action: ActionType;
  entityType: string;
  entityId: string;
  ipAddress?: string;
}

@Injectable()
export class ActionLogService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateActionLogDto) {
    return this.prismaService.actionLog.create({
      data: dto,
    });
  }

  async findAll(
    entityType?: string,
    userId?: string
  ): Promise<ActionLogResponseDto[]> {
    const where: Prisma.ActionLogWhereInput = {};

    if (entityType) {
      where.entityType = entityType;
    }

    if (userId) {
      where.userId = userId;
    }

    const logs = await this.prismaService.actionLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return logs;
  }

  async findByEntity(entityType: string, entityId: string): Promise<ActionLogResponseDto[]> {
    return this.prismaService.actionLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
