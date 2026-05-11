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
import { MenuService } from './menu.service';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CreateMenuRequestDto } from 'src/menu/dtos/create-menu.request.dto';
import { UpdateMenuRequestDto } from 'src/menu/dtos/update-menu.request.dto';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { MenuResponseDto } from 'src/menu/dtos/menu.response.dto';

@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // ==================== PUBLIC ROUTES ====================

  @Get()
  async findAllPublic(): Promise<HttpResponse<MenuResponseDto[]>> {
    const menus = await this.menuService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Menus retrieved successfully',
      data: menus,
    };
  }

  @Get('roots')
  async findRootMenus(): Promise<HttpResponse<MenuResponseDto[]>> {
    const menus = await this.menuService.findRootMenus();
    return {
      statusCode: HttpStatus.OK,
      message: 'Menus retrieved successfully',
      data: menus,
    };
  }

  // ==================== ADMIN ROUTES ====================

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateMenuRequestDto): Promise<HttpResponse<MenuResponseDto>> {
    const menu = await this.menuService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Menu created successfully',
      data: menu,
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<HttpResponse<MenuResponseDto[]>> {
    const menus = await this.menuService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Menus retrieved successfully',
      data: menus,
    };
  }

  @Get('admin/available-sort-orders/:parentId')
  @UseGuards(JwtAuthGuard)
  async findAvailableSortOrders(
    @Param('parentId') parentId: string
  ): Promise<HttpResponse<number[]>> {
    const sortOrders = await this.menuService.findAvailableSortOrders(parentId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Available sort orders retrieved successfully',
      data: sortOrders,
    };
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string): Promise<HttpResponse<MenuResponseDto>> {
    const menu = await this.menuService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Menu retrieved successfully',
      data: menu,
    };
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMenuRequestDto
  ): Promise<HttpResponse<MenuResponseDto>> {
    const menu = await this.menuService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Menu updated successfully',
      data: menu,
    };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<HttpResponse<void>> {
    await this.menuService.delete(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Menu deleted successfully',
    };
  }
}
