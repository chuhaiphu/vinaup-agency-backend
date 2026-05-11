import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/services/mail.service';
import { CreateCustomTourRequestRequestDto } from 'src/tour/dtos/create-custom-tour-request.request.dto';
import { CustomTourRequestResponseDto } from 'src/tour/dtos/custom-tour-request.response.dto';
import { RecaptchaService } from 'src/recaptcha/recaptcha.service';

@Injectable()
export class CustomTourRequestService {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailService,
    private recaptchaService: RecaptchaService
  ) {}

  async create(
    dto: CreateCustomTourRequestRequestDto
  ): Promise<CustomTourRequestResponseDto> {
    if (dto.recaptchaToken) {
      const isValid = await this.recaptchaService.verifyToken(
        dto.recaptchaToken,
        'custom_tour_request_submit'
      );
      if (!isValid) {
        throw new BadRequestException('Invalid reCAPTCHA');
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categoryIds, recaptchaToken, ...requestData } = dto;

    const customTourRequest = await this.prismaService.customTourRequest.create({
      data: {
        ...requestData,
        destinations: dto.destinations || [],
        tourCategoryCustomTourRequests: categoryIds?.length
          ? {
              create: categoryIds.map((categoryId) => ({
                tourCategoryId: categoryId,
              })),
            }
          : undefined,
      },
      include: {
        tourCategoryCustomTourRequests: {
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

    // Send notification to admin (non-blocking)
    void this.mailService.sendCustomTourRequestNotification({
      customerName: customTourRequest.customerName,
      customerEmail: customTourRequest.customerEmail,
      customerPhone: customTourRequest.customerPhone,
      customerNotes: customTourRequest.customerNotes,
      startDate: customTourRequest.startDate,
      endDate: customTourRequest.endDate,
      adultCount: customTourRequest.adultCount,
      childCount: customTourRequest.childCount,
      destinations: customTourRequest.destinations,
    });

    return customTourRequest;
  }

  async findAll(): Promise<CustomTourRequestResponseDto[]> {
    const requests = await this.prismaService.customTourRequest.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        tourCategoryCustomTourRequests: {
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

    return requests;
  }

  async findById(id: string): Promise<CustomTourRequestResponseDto> {
    const request = await this.prismaService.customTourRequest.findUnique({
      where: { id },
      include: {
        tourCategoryCustomTourRequests: {
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

    if (!request) {
      throw new NotFoundException('Custom tour request not found');
    }

    return request;
  }

  async delete(id: string) {
    const request = await this.prismaService.customTourRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Custom tour request not found');
    }

    await this.prismaService.customTourRequest.delete({
      where: { id },
    });
  }
}
