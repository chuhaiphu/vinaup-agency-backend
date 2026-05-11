import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTourCategoryTourRequestDto } from 'src/tour/dtos/create-tour-category-tour.request.dto';
import { UpdateTourCategoryTourRequestDto } from 'src/tour/dtos/update-tour-category-tour.request.dto';
import { TourCategoryTourResponseDto } from 'src/tour/dtos/tour-category-tour.response.dto';
import { Prisma } from 'src/prisma/generated/client';

@Injectable()
export class TourCategoryTourService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Create a new tour-category-tour relation
   * Validates that both tourCategoryId and tourId are provided
   * Throws ConflictException if relation already exists (unique constraint)
   */
  async create(
    dto: CreateTourCategoryTourRequestDto,
  ): Promise<TourCategoryTourResponseDto> {
    try {
      const relation = await this.prismaService.tourCategoryTour.create({
        data: {
          tourCategoryId: dto.tourCategoryId,
          tourId: dto.tourId,
          sortOrder: dto.sortOrder ?? 0,
        },
        include: {
          tourCategory: {
            include: {
              parent: true,
              children: true,
            },
          },
          tour: {
            include: {
              createdBy: true,
              tourCategoryTours: true,
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
          'Relation between this tour category and tour already exists',
        );
      }
      throw error;
    }
  }

  /**
   * Find a tour-category-tour relation by ID
   * Returns the relation with included tourCategory and tour data
   * Throws NotFoundException if relation not found
   */
  async findById(id: string): Promise<TourCategoryTourResponseDto> {
    const relation = await this.prismaService.tourCategoryTour.findUnique({
      where: { id },
      include: {
        tourCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        tour: {
          include: {
            createdBy: true,
            tourCategoryTours: true,
          },
        },
      },
    });

    if (!relation) {
      throw new NotFoundException('Tour-category-tour relation not found');
    }

    return relation;
  }

  /**
   * Find all tour-category-tour relations for a specific tour
   * Returns relations ordered by sortOrder in ascending order
   */
  async findByTourId(tourId: string): Promise<TourCategoryTourResponseDto[]> {
    const relations = await this.prismaService.tourCategoryTour.findMany({
      where: { tourId },
      orderBy: [{ sortOrder: 'asc' }],
      include: {
        tourCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        tour: {
          include: {
            createdBy: true,
            tourCategoryTours: true,
          },
        },
      },
    });

    return relations;
  }

  /**
   * Find all tour-category-tour relations for a specific tour category
   * Returns relations ordered by sortOrder in ascending order
   */
  async findByTourCategoryId(
    tourCategoryId: string,
  ): Promise<TourCategoryTourResponseDto[]> {
    const relations = await this.prismaService.tourCategoryTour.findMany({
      where: { tourCategoryId },
      orderBy: [{ sortOrder: 'asc' }],
      include: {
        tourCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        tour: {
          include: {
            createdBy: true,
            tourCategoryTours: true,
          },
        },
      },
    });

    return relations;
  }

  /**
   * Find all tour-category-tour relations
   */
  async findAll(): Promise<TourCategoryTourResponseDto[]> {
    const relations = await this.prismaService.tourCategoryTour.findMany({
      orderBy: [{ sortOrder: 'asc' }],
      include: {
        tourCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        tour: {
          include: {
            createdBy: true,
            tourCategoryTours: true,
          },
        },
      },
    });

    return relations;
  }

  /**
   * Update a tour-category-tour relation
   * Currently only allows modification of sortOrder field
   * Throws NotFoundException if relation not found
   */
  async update(
    id: string,
    dto: UpdateTourCategoryTourRequestDto,
  ): Promise<TourCategoryTourResponseDto> {
    const relation = await this.prismaService.tourCategoryTour.findUnique({
      where: { id },
    });

    if (!relation) {
      throw new NotFoundException('Tour-category-tour relation not found');
    }

    const updatedRelation = await this.prismaService.tourCategoryTour.update({
      where: { id },
      data: {
        sortOrder: dto.sortOrder,
      },
      include: {
        tourCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        tour: {
          include: {
            createdBy: true,
            tourCategoryTours: true,
          },
        },
      },
    });

    return updatedRelation;
  }

  /**
   * Delete a tour-category-tour relation by ID
   * Throws NotFoundException if relation not found
   */
  async delete(id: string): Promise<void> {
    const relation = await this.prismaService.tourCategoryTour.findUnique({
      where: { id },
    });

    if (!relation) {
      throw new NotFoundException('Tour-category-tour relation not found');
    }

    await this.prismaService.tourCategoryTour.delete({
      where: { id },
    });
  }

  /**
   * Delete all tour-category-tour relations for a specific tour
   * Removes all relations associated with the given tourId
   */
  async deleteByTourId(tourId: string): Promise<void> {
    await this.prismaService.tourCategoryTour.deleteMany({
      where: { tourId },
    });
  }

  /**
   * Delete all tour-category-tour relations for a specific tour category
   * Removes all relations associated with the given tourCategoryId
   */
  async deleteByTourCategoryId(tourCategoryId: string): Promise<void> {
    await this.prismaService.tourCategoryTour.deleteMany({
      where: { tourCategoryId },
    });
  }
}
