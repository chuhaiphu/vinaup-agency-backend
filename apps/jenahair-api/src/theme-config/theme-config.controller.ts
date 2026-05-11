import { Body, Controller, Get, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { HttpResponse } from 'src/_common/interfaces/interface';
import { GlobalSettingResponseDto } from 'src/theme-config/dtos/global-setting.response.dto';
import { UpdateThemeConfigSocialLinksRequestDto } from 'src/theme-config/dtos/update-theme-config-social-links.request.dto';
import { UpdateThemeConfigMarqueeRequestDto } from 'src/theme-config/dtos/update-theme-config-marquee.request.dto';
import { UpdateThemeConfigCarouselRequestDto } from 'src/theme-config/dtos/update-theme-config-carousel.request.dto';
import { SocialLink } from 'src/theme-config/interfaces/social-link.interface';
import { MarqueeSlide } from 'src/theme-config/interfaces/marquee-config.interface';
import { CarouselSlide } from 'src/theme-config/interfaces/carousel-config.interface';
import { ThemeConfigService } from 'src/theme-config/theme-config.service';

@Controller('theme-config')
export class ThemeConfigController {
  constructor(private readonly themeConfigService: ThemeConfigService) { }

  @Get('social-links')
  async findSocialLinksPublic(): Promise<
    HttpResponse<GlobalSettingResponseDto<SocialLink[]>>
  > {
    const config = await this.themeConfigService.getSocialLinks();
    return {
      statusCode: HttpStatus.OK,
      message: 'Theme social links retrieved successfully',
      data: config,
    };
  }

  @Get('admin/social-links')
  @UseGuards(JwtAuthGuard)
  async findSocialLinksAdmin(): Promise<
    HttpResponse<GlobalSettingResponseDto<SocialLink[]>>
  > {
    const config = await this.themeConfigService.getSocialLinks();
    return {
      statusCode: HttpStatus.OK,
      message: 'Theme social links retrieved successfully',
      data: config,
    };
  }

  @Put('admin/social-links')
  @UseGuards(JwtAuthGuard)
  async updateSocialLinks(
    @Body() dto: UpdateThemeConfigSocialLinksRequestDto
  ): Promise<HttpResponse<GlobalSettingResponseDto<SocialLink[]>>> {
    const config = await this.themeConfigService.upsertSocialLinks(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Theme social links updated successfully',
      data: config,
    };
  }

  @Get('marquee')
  async findBannerSliderPublic(): Promise<
    HttpResponse<GlobalSettingResponseDto<MarqueeSlide[]>>
  > {
    const config = await this.themeConfigService.getMarquee();
    return {
      statusCode: HttpStatus.OK,
      message: 'Marquee config retrieved successfully',
      data: config,
    };
  }

  @Get('admin/marquee')
  @UseGuards(JwtAuthGuard)
  async findBannerSliderAdmin(): Promise<
    HttpResponse<GlobalSettingResponseDto<MarqueeSlide[]>>
  > {
    const config = await this.themeConfigService.getMarquee();
    return {
      statusCode: HttpStatus.OK,
      message: 'Marquee config retrieved successfully',
      data: config,
    };
  }

  @Put('admin/marquee')
  @UseGuards(JwtAuthGuard)
  async updateBannerSlider(
    @Body() dto: UpdateThemeConfigMarqueeRequestDto
  ): Promise<HttpResponse<GlobalSettingResponseDto<MarqueeSlide[]>>> {
    const config = await this.themeConfigService.upsertMarquee(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Marquee config updated successfully',
      data: config,
    };
  }

  @Get('carousel')
  async findCarouselPublic(): Promise<
    HttpResponse<GlobalSettingResponseDto<CarouselSlide[]>>
  > {
    const config = await this.themeConfigService.getCarousel();
    return {
      statusCode: HttpStatus.OK,
      message: 'Carousel config retrieved successfully',
      data: config,
    };
  }

  @Get('admin/carousel')
  @UseGuards(JwtAuthGuard)
  async findCarouselAdmin(): Promise<
    HttpResponse<GlobalSettingResponseDto<CarouselSlide[]>>
  > {
    const config = await this.themeConfigService.getCarousel();
    return {
      statusCode: HttpStatus.OK,
      message: 'Carousel config retrieved successfully',
      data: config,
    };
  }

  @Put('admin/carousel')
  @UseGuards(JwtAuthGuard)
  async updateCarousel(
    @Body() dto: UpdateThemeConfigCarouselRequestDto
  ): Promise<HttpResponse<GlobalSettingResponseDto<CarouselSlide[]>>> {
    const config = await this.themeConfigService.upsertCarousel(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Carousel config updated successfully',
      data: config,
    };
  }
}
