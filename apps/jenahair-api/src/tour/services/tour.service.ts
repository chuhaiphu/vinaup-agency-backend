import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTourRequestDto } from 'src/tour/dtos/create-tour.request.dto';
import { UpdateTourRequestDto } from 'src/tour/dtos/update-tour.request.dto';
import { TourFilterParamDto } from 'src/tour/dtos/tour-filter.param.dto';
import { Prisma } from 'src/prisma/generated/client';
import { TourResponseDto } from 'src/tour/dtos/tour.response.dto';

@Injectable()
export class TourService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateTourRequestDto, userId?: string): Promise<TourResponseDto> {
    const existing = await this.prismaService.tour.findUnique({
      where: { endpoint: dto.endpoint },
    });

    if (existing) {
      throw new ConflictException('Tour with this endpoint already exists');
    }

    const { categoryIds, userId: dtoUserId, ...tourData } = dto;

    const tour = await this.prismaService.tour.create({
      data: {
        ...tourData,
        createdByUserId: dtoUserId || userId || undefined,
        tourCategoryTours: categoryIds?.length
          ? {
              create: categoryIds.map((categoryId, index) => ({
                tourCategoryId: categoryId,
                sortOrder: index,
              })),
            }
          : undefined,
      },
      include: {
        tourCategoryTours: {
          include: {
            tourCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    return tour;
  }

  async findAll(filter: TourFilterParamDto): Promise<TourResponseDto[]> {
    const where: Prisma.TourWhereInput = {};

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
      where.tourCategoryTours = {
        some: { tourCategoryId: filter.categoryId },
      };
    }

    const tours = await this.prismaService.tour.findMany({
      where,
      orderBy: [
        { updatedAt: 'desc' },
        { sortOrder: 'asc' },
      ],
      include: {
        createdBy: true,
        tourCategoryTours: {
          include: {
            tourCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    return tours  ;
  }

  async findAllPublic(filter: TourFilterParamDto): Promise<TourResponseDto[]> {
    const where: Prisma.TourWhereInput = {
      visibility: 'public',
    };

    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter.categoryId) {
      where.tourCategoryTours = {
        some: { tourCategoryId: filter.categoryId },
      };
    }

    const tours = await this.prismaService.tour.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { updatedAt: 'desc' },
      ],
      include: {
        createdBy: true,
        tourCategoryTours: {
          include: {
            tourCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    return tours  ;
  }

  async findAllPublicToursPinnedToHome(): Promise<TourResponseDto[]> {
    const tours = await this.prismaService.tour.findMany({
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
        tourCategoryTours: {
          include: {
            tourCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    return tours  ;
  }

  async findToursByUserId(userId: string): Promise<TourResponseDto[]> {
    const tours = await this.prismaService.tour.findMany({
      where: {
        createdByUserId: userId,
      },
      orderBy: [
        { updatedAt: 'desc' },
      ],
      include: {
        createdBy: true,
        tourCategoryTours: {
          include: {
            tourCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    return tours  ;
  }

  async hasViewedToday(tourId: string, ipAddress: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const view = await this.prismaService.tourView.findFirst({
      where: {
        tourId,
        ipAddress,
        viewedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    return !!view;
  }

  async hasLiked(tourId: string, ipAddress: string): Promise<boolean> {
    const like = await this.prismaService.tourLike.findUnique({
      where: {
        tourId_ipAddress: {
          tourId,
          ipAddress,
        },
      },
    });

    return !!like;
  }

  async findById(id: string): Promise<TourResponseDto> {
    const tour = await this.prismaService.tour.findUnique({
      where: { id },
      include: {
        createdBy: true,
        tourCategoryTours: {
          include: {
            tourCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    return tour  ;
  }

  async findByEndpoint(endpoint: string): Promise<TourResponseDto> {
    const tour = await this.prismaService.tour.findUnique({
      where: { endpoint, visibility: 'public' },
      include: {
        createdBy: true,
        tourCategoryTours: {
          include: {
            tourCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    return tour  ;
  }

  async update(id: string, dto: UpdateTourRequestDto): Promise<TourResponseDto> {
    const tour = await this.prismaService.tour.findUnique({
      where: { id },
    });

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    if (dto.endpoint && dto.endpoint !== tour.endpoint) {
      const existing = await this.prismaService.tour.findUnique({
        where: { endpoint: dto.endpoint },
      });
      if (existing) {
        throw new ConflictException('Tour with this endpoint already exists');
      }
    }

    const { categoryIds, ...tourData } = dto;

    // Update categories if provided
    if (categoryIds !== undefined) {
      await this.prismaService.tourCategoryTour.deleteMany({
        where: { tourId: id },
      });

      if (categoryIds.length > 0) {
        await this.prismaService.tourCategoryTour.createMany({
          data: categoryIds.map((categoryId, index) => ({
            tourId: id,
            tourCategoryId: categoryId,
            sortOrder: index,
          })),
        });
      }
    }

    const updatedTour = await this.prismaService.tour.update({
      where: { id },
      data: tourData,
      include: {
        tourCategoryTours: {
          include: {
            tourCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    return updatedTour  ;
  }

  async delete(id: string) {
    const tour = await this.prismaService.tour.findUnique({
      where: { id },
    });

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    await this.prismaService.tour.delete({
      where: { id },
    });
  }

  async incrementView(id: string, ipAddress: string) {
    const tour = await this.prismaService.tour.findUnique({
      where: { id },
    });

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    // Check if already viewed today from this IP
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingView = await this.prismaService.tourView.findFirst({
      where: {
        tourId: id,
        ipAddress,
        viewedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (!existingView) {
      await this.prismaService.$transaction([
        this.prismaService.tourView.create({
          data: {
            tourId: id,
            ipAddress,
          },
        }),
        this.prismaService.tour.update({
          where: { id },
          data: { views: { increment: 1 } },
        }),
      ]);
    }

    return { success: true };
  }

  async toggleLike(id: string, ipAddress: string) {
    const tour = await this.prismaService.tour.findUnique({
      where: { id },
    });

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    const existingLike = await this.prismaService.tourLike.findUnique({
      where: {
        tourId_ipAddress: {
          tourId: id,
          ipAddress,
        },
      },
    });

    if (existingLike) {
      await this.prismaService.$transaction([
        this.prismaService.tourLike.delete({
          where: {
            tourId_ipAddress: {
              tourId: id,
              ipAddress,
            },
          },
        }),
        this.prismaService.tour.update({
          where: { id },
          data: { likes: { decrement: 1 } },
        }),
      ]);
      return { liked: false };
    } else {
      await this.prismaService.$transaction([
        this.prismaService.tourLike.create({
          data: { tourId: id, ipAddress },
        }),
        this.prismaService.tour.update({
          where: { id },
          data: { likes: { increment: 1 } },
        }),
      ]);
      return { liked: true };
    }
  }
}
