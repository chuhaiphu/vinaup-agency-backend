import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTourCategoryCustomTourRequestRequestDto } from 'src/tour/dtos/create-tour-category-custom-tour-request.request.dto';
import { TourCategoryCustomTourRequestResponseDto } from 'src/tour/dtos/tour-category-custom-tour-request.response.dto';
import { Prisma } from 'src/prisma/generated/client';

@Injectable()
export class TourCategoryCustomTourRequestService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Create a new tour-category-custom-tour-request relation
   * Validates that both tourCategoryId and customTourRequestId are provided
   * Throws ConflictException if relation already exists (unique constraint)
   */
  async create(
    dto: CreateTourCategoryCustomTourRequestRequestDto,
  ): Promise<TourCategoryCustomTourRequestResponseDto> {
    try {
      const relation =
        await this.prismaService.tourCategoryCustomTourRequest.create({
          data: {
            tourCategoryId: dto.tourCategoryId,
            customTourRequestId: dto.customTourRequestId,
          },
          include: {
            tourCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
            customTourRequest: true,
          },
        });

      return relation;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Relation between this tour category and custom tour request already exists',
        );
      }
      throw error;
    }
  }

  /**
   * Find a tour-category-custom-tour-request relation by ID
   * Returns the relation with included tourCategory and customTourRequest data
   * Throws NotFoundException if relation not found
   */
  async findById(
    id: string,
  ): Promise<TourCategoryCustomTourRequestResponseDto> {
    const relation =
      await this.prismaService.tourCategoryCustomTourRequest.findUnique({
        where: { id },
        include: {
          tourCategory: {
            include: {
              parent: true,
              children: true,
            },
          },
          customTourRequest: true,
        },
      });

    if (!relation) {
      throw new NotFoundException(
        'Tour-category-custom-tour-request relation not found',
      );
    }

    return relation;
  }

  /**
   * Find all tour-category-custom-tour-request relations for a specific custom tour request
   * Returns all relations for that request
   */
  async findByCustomTourRequestId(
    customTourRequestId: string,
  ): Promise<TourCategoryCustomTourRequestResponseDto[]> {
    const relations =
      await this.prismaService.tourCategoryCustomTourRequest.findMany({
        where: { customTourRequestId },
        include: {
          tourCategory: {
            include: {
              parent: true,
              children: true,
            },
          },
          customTourRequest: true,
        },
      });

    return relations;
  }

  /**
   * Find all tour-category-custom-tour-request relations for a specific tour category
   * Returns all relations for that category
   */
  async findByTourCategoryId(
    tourCategoryId: string,
  ): Promise<TourCategoryCustomTourRequestResponseDto[]> {
    const relations =
      await this.prismaService.tourCategoryCustomTourRequest.findMany({
        where: { tourCategoryId },
        include: {
          tourCategory: {
            include: {
              parent: true,
              children: true,
            },
          },
          customTourRequest: true,
        },
      });

    return relations;
  }

  /**
   * Find all tour-category-custom-tour-request relations
   */
  async findAll(): Promise<TourCategoryCustomTourRequestResponseDto[]> {
    const relations =
      await this.prismaService.tourCategoryCustomTourRequest.findMany({
        include: {
          tourCategory: {
            include: {
              parent: true,
              children: true,
            },
          },
          customTourRequest: true,
        },
      });

    return relations;
  }

  /**
   * Delete a tour-category-custom-tour-request relation by ID
   * Throws NotFoundException if relation not found
   */
  async delete(id: string): Promise<void> {
    const relation =
      await this.prismaService.tourCategoryCustomTourRequest.findUnique({
        where: { id },
      });

    if (!relation) {
      throw new NotFoundException(
        'Tour-category-custom-tour-request relation not found',
      );
    }

    await this.prismaService.tourCategoryCustomTourRequest.delete({
      where: { id },
    });
  }

  /**
   * Delete all tour-category-custom-tour-request relations for a specific custom tour request
   * Removes all relations associated with the given customTourRequestId
   */
  async deleteByCustomTourRequestId(
    customTourRequestId: string,
  ): Promise<void> {
    await this.prismaService.tourCategoryCustomTourRequest.deleteMany({
      where: { customTourRequestId },
    });
  }

  /**
   * Delete all tour-category-custom-tour-request relations for a specific tour category
   * Removes all relations associated with the given tourCategoryId
   */
  async deleteByTourCategoryId(tourCategoryId: string): Promise<void> {
    await this.prismaService.tourCategoryCustomTourRequest.deleteMany({
      where: { tourCategoryId },
    });
  }
}
