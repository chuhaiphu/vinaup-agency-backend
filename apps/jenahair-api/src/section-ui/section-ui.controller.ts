import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SectionUIService } from './section-ui.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { CreateSectionUICredentialsRequestDto } from 'src/section-ui/dtos/create-section-ui-credentials.request.dto';
import { UpdateSectionUICredentialsRequestDto } from 'src/section-ui/dtos/update-section-ui-credentials.request.dto';
import { SectionUICredentialsResponseDto } from 'src/section-ui/dtos/section-ui-credentials.response.dto';
import { CreateDynamicSectionUIRequestDto } from 'src/section-ui/dtos/create-dynamic-section-ui.request.dto';
import { UpdateDynamicSectionUIRequestDto } from 'src/section-ui/dtos/update-dynamic-section-ui.request.dto';
import { DynamicSectionUIResponseDto } from 'src/section-ui/dtos/dynamic-section-ui.response.dto';

@Controller('section-ui')
export class SectionUIController {
  constructor(private readonly sectionUIService: SectionUIService) {}

  // ==================== PUBLIC ROUTES – Sections (GET, no guard) ====================

  @Get('sections')
  async findAllSections(): Promise<HttpResponse<DynamicSectionUIResponseDto[]>> {
    const sections = await this.sectionUIService.findAllSectionUIs();
    return {
      statusCode: HttpStatus.OK,
      message: 'Dynamic Section UIs retrieved successfully',
      data: sections,
    };
  }

  @Get('sections/positions/used')
  async getUsedPositions(): Promise<HttpResponse<number[]>> {
    const positions = await this.sectionUIService.getUsedSectionUIPositions();
    return {
      statusCode: HttpStatus.OK,
      message: 'Used positions retrieved successfully',
      data: positions,
    };
  }

  @Get('sections/position/:position')
  async findSectionByPosition(
    @Param('position') position: string
  ): Promise<HttpResponse<DynamicSectionUIResponseDto>> {
    const section = await this.sectionUIService.findSectionUIByPosition(
      parseInt(position, 10)
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Dynamic Section UI retrieved successfully',
      data: section,
    };
  }

  @Get('sections/:id')
  async findSectionById(
    @Param('id') id: string
  ): Promise<HttpResponse<DynamicSectionUIResponseDto>> {
    const section = await this.sectionUIService.findSectionUIById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Dynamic Section UI retrieved successfully',
      data: section,
    };
  }

  // ==================== ADMIN ROUTES – Credentials (guard) ====================

  @Post('admin/credentials')
  @UseGuards(JwtAuthGuard)
  async createCredential(
    @Body() dto: CreateSectionUICredentialsRequestDto
  ): Promise<HttpResponse<SectionUICredentialsResponseDto>> {
    const credential = await this.sectionUIService.createSectionUICredentials(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Section UI Credential created successfully',
      data: credential,
    };
  }

  @Get('admin/credentials')
  @UseGuards(JwtAuthGuard)
  async findAllCredentials(): Promise<
    HttpResponse<SectionUICredentialsResponseDto[]>
  > {
    const credentials = await this.sectionUIService.findAllSectionUICredentials();
    return {
      statusCode: HttpStatus.OK,
      message: 'Section UI Credentials retrieved successfully',
      data: credentials,
    };
  }

  @Get('admin/credentials/code/:code')
  @UseGuards(JwtAuthGuard)
  async findCredentialByCode(
    @Param('code') code: string
  ): Promise<HttpResponse<SectionUICredentialsResponseDto>> {
    const credential =
      await this.sectionUIService.findSectionUICredentialsByCode(code);
    return {
      statusCode: HttpStatus.OK,
      message: 'Section UI Credential retrieved successfully',
      data: credential,
    };
  }

  @Get('admin/credentials/:id')
  @UseGuards(JwtAuthGuard)
  async findCredentialById(
    @Param('id') id: string
  ): Promise<HttpResponse<SectionUICredentialsResponseDto>> {
    const credential = await this.sectionUIService.findSectionUICredentialsById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Section UI Credential retrieved successfully',
      data: credential,
    };
  }

  @Put('admin/credentials/:id')
  @UseGuards(JwtAuthGuard)
  async updateCredential(
    @Param('id') id: string,
    @Body() dto: UpdateSectionUICredentialsRequestDto
  ): Promise<HttpResponse<SectionUICredentialsResponseDto>> {
    const credential = await this.sectionUIService.updateSectionUICredentials(
      id,
      dto
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Section UI Credential updated successfully',
      data: credential,
    };
  }

  @Delete('admin/credentials/:id')
  @UseGuards(JwtAuthGuard)
  async deleteCredential(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.sectionUIService.deleteSectionUICredentials(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Section UI Credential deleted successfully',
    };
  }

  // ==================== ADMIN ROUTES – Sections mutate (guard) ====================

  @Post('admin/sections')
  @UseGuards(JwtAuthGuard)
  async createSection(
    @Body() dto: CreateDynamicSectionUIRequestDto
  ): Promise<HttpResponse<DynamicSectionUIResponseDto>> {
    const section = await this.sectionUIService.createSectionUI(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Dynamic Section UI created successfully',
      data: section,
    };
  }

  @Put('admin/sections/:id')
  @UseGuards(JwtAuthGuard)
  async updateSection(
    @Param('id') id: string,
    @Body() dto: UpdateDynamicSectionUIRequestDto
  ): Promise<HttpResponse<DynamicSectionUIResponseDto>> {
    const section = await this.sectionUIService.updateSectionUI(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Dynamic Section UI updated successfully',
      data: section,
    };
  }

  @Delete('admin/sections/:id')
  @UseGuards(JwtAuthGuard)
  async deleteSection(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.sectionUIService.deleteSectionUI(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Dynamic Section UI deleted successfully',
    };
  }
}
