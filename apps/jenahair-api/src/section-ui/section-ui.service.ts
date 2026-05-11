import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/prisma/generated/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSectionUICredentialsRequestDto } from 'src/section-ui/dtos/create-section-ui-credentials.request.dto';
import { UpdateSectionUICredentialsRequestDto } from 'src/section-ui/dtos/update-section-ui-credentials.request.dto';
import { SectionUICredentialsResponseDto } from 'src/section-ui/dtos/section-ui-credentials.response.dto';
import { CreateDynamicSectionUIRequestDto } from 'src/section-ui/dtos/create-dynamic-section-ui.request.dto';
import { UpdateDynamicSectionUIRequestDto } from 'src/section-ui/dtos/update-dynamic-section-ui.request.dto';
import { DynamicSectionUIResponseDto } from 'src/section-ui/dtos/dynamic-section-ui.response.dto';

@Injectable()
export class SectionUIService {
  constructor(private prismaService: PrismaService) {}

  // ==================== Helper Methods ====================

  private transformSectionResponse(section: {
    id: string;
    position: number;
    sectionUICredentialsId: string | null;
    properties: Prisma.JsonValue;
    createdAt: Date;
    updatedAt: Date;
    sectionUICredentials: {
      id: string;
      code: string;
      componentKey: string;
      propertyFormat: Prisma.JsonValue;
      createdAt: Date;
      updatedAt: Date;
    } | null;
  }): DynamicSectionUIResponseDto {
    return {
      ...section,
      properties: section.properties as Record<string, unknown> | null,
      sectionUICredentials: section.sectionUICredentials
        ? {
            ...section.sectionUICredentials,
            propertyFormat: section.sectionUICredentials.propertyFormat as Record<
              string,
              unknown
            >,
          }
        : null,
    };
  }

  // ==================== SectionUICredentials Methods ====================

  async createSectionUICredentials(
    dto: CreateSectionUICredentialsRequestDto
  ): Promise<SectionUICredentialsResponseDto> {
    // Check for duplicate code
    const existing = await this.prismaService.sectionUICredentials.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException(
        'Section UI Credential with this code already exists'
      );
    }

    const credential = await this.prismaService.sectionUICredentials.create({
      data: dto,
    });

    return {
      ...credential,
      propertyFormat: credential.propertyFormat as Record<string, unknown>,
    };
  }

  async findAllSectionUICredentials(): Promise<SectionUICredentialsResponseDto[]> {
    const credentials = await this.prismaService.sectionUICredentials.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return credentials.map((credential) => ({
      ...credential,
      propertyFormat: credential.propertyFormat as Record<string, unknown>,
    }));
  }

  async findSectionUICredentialsById(
    id: string
  ): Promise<SectionUICredentialsResponseDto> {
    const credential = await this.prismaService.sectionUICredentials.findUnique({
      where: { id },
    });

    if (!credential) {
      throw new NotFoundException('Section UI Credential not found');
    }

    return {
      ...credential,
      propertyFormat: credential.propertyFormat as Record<string, unknown>,
    };
  }

  async findSectionUICredentialsByCode(
    code: string
  ): Promise<SectionUICredentialsResponseDto> {
    const credential = await this.prismaService.sectionUICredentials.findUnique({
      where: { code },
    });

    if (!credential) {
      throw new NotFoundException('Section UI Credential not found');
    }

    return {
      ...credential,
      propertyFormat: credential.propertyFormat as Record<string, unknown>,
    };
  }

  async updateSectionUICredentials(
    id: string,
    dto: UpdateSectionUICredentialsRequestDto
  ): Promise<SectionUICredentialsResponseDto> {
    // Check if credential exists
    const credential = await this.prismaService.sectionUICredentials.findUnique({
      where: { id },
    });

    if (!credential) {
      throw new NotFoundException('Section UI Credential not found');
    }

    // Check for duplicate code if code is being updated
    if (dto.code && dto.code !== credential.code) {
      const existing = await this.prismaService.sectionUICredentials.findUnique({
        where: { code: dto.code },
      });

      if (existing) {
        throw new ConflictException(
          'Section UI Credential with this code already exists'
        );
      }
    }

    const updatedCredential = await this.prismaService.sectionUICredentials.update({
      where: { id },
      data: dto,
    });

    return {
      ...updatedCredential,
      propertyFormat: updatedCredential.propertyFormat as Record<string, unknown>,
    };
  }

  async deleteSectionUICredentials(id: string): Promise<void> {
    const credential = await this.prismaService.sectionUICredentials.findUnique({
      where: { id },
    });

    if (!credential) {
      throw new NotFoundException('Section UI Credential not found');
    }

    await this.prismaService.sectionUICredentials.delete({
      where: { id },
    });
  }

  // ==================== DynamicSectionUI Methods ====================

  async createSectionUI(
    dto: CreateDynamicSectionUIRequestDto
  ): Promise<DynamicSectionUIResponseDto> {
    // Check for duplicate position
    const existing = await this.prismaService.dynamicSectionUI.findUnique({
      where: { position: dto.position },
    });

    if (existing) {
      throw new ConflictException(
        'Dynamic Section UI with this position already exists'
      );
    }

    // If sectionUICredentialsId is provided, verify it exists
    if (dto.sectionUICredentialsId) {
      const credential = await this.prismaService.sectionUICredentials.findUnique({
        where: { id: dto.sectionUICredentialsId },
      });

      if (!credential) {
        throw new NotFoundException('Section UI Credential not found');
      }
    }

    const section = await this.prismaService.dynamicSectionUI.create({
      data: dto,
      include: {
        sectionUICredentials: true,
      },
    });

    return this.transformSectionResponse(section);
  }

  async findAllSectionUIs(): Promise<DynamicSectionUIResponseDto[]> {
    const sections = await this.prismaService.dynamicSectionUI.findMany({
      orderBy: { position: 'asc' },
      include: {
        sectionUICredentials: true,
      },
    });

    return sections.map((section) => this.transformSectionResponse(section));
  }

  async findSectionUIById(id: string): Promise<DynamicSectionUIResponseDto> {
    const section = await this.prismaService.dynamicSectionUI.findUnique({
      where: { id },
      include: {
        sectionUICredentials: true,
      },
    });

    if (!section) {
      throw new NotFoundException('Dynamic Section UI not found');
    }

    return this.transformSectionResponse(section);
  }

  async findSectionUIByPosition(
    position: number
  ): Promise<DynamicSectionUIResponseDto> {
    const section = await this.prismaService.dynamicSectionUI.findUnique({
      where: { position },
      include: {
        sectionUICredentials: true,
      },
    });

    if (!section) {
      throw new NotFoundException('Dynamic Section UI not found');
    }

    return this.transformSectionResponse(section);
  }

  async getUsedSectionUIPositions(): Promise<number[]> {
    const result = await this.prismaService.dynamicSectionUI.findMany({
      select: { position: true },
      orderBy: { position: 'asc' },
    });

    return result.map((item) => item.position);
  }

  async updateSectionUI(
    id: string,
    dto: UpdateDynamicSectionUIRequestDto
  ): Promise<DynamicSectionUIResponseDto> {
    // Check if section exists
    const section = await this.prismaService.dynamicSectionUI.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException('Dynamic Section UI not found');
    }

    // Check for duplicate position if position is being updated
    if (dto.position !== undefined && dto.position !== section.position) {
      const existing = await this.prismaService.dynamicSectionUI.findUnique({
        where: { position: dto.position },
      });

      if (existing) {
        throw new ConflictException(
          'Dynamic Section UI with this position already exists'
        );
      }
    }

    // If sectionUICredentialsId is being updated, verify it exists
    if (dto.sectionUICredentialsId) {
      const credential = await this.prismaService.sectionUICredentials.findUnique({
        where: { id: dto.sectionUICredentialsId },
      });

      if (!credential) {
        throw new NotFoundException('Section UI Credential not found');
      }
    }

    const updatedSection = await this.prismaService.dynamicSectionUI.update({
      where: { id },
      data: dto,
      include: {
        sectionUICredentials: true,
      },
    });

    return this.transformSectionResponse(updatedSection);
  }

  async deleteSectionUI(id: string): Promise<void> {
    const section = await this.prismaService.dynamicSectionUI.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException('Dynamic Section UI not found');
    }

    await this.prismaService.dynamicSectionUI.delete({
      where: { id },
    });
  }
}
