import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/prisma/generated/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GlobalSettingResponseDto } from 'src/theme-config/dtos/global-setting.response.dto';
import { UpdateThemeConfigSocialLinksRequestDto } from 'src/theme-config/dtos/update-theme-config-social-links.request.dto';
import { UpdateThemeConfigMarqueeRequestDto } from 'src/theme-config/dtos/update-theme-config-marquee.request.dto';
import { UpdateThemeConfigCarouselRequestDto } from 'src/theme-config/dtos/update-theme-config-carousel.request.dto';
import { SocialLink } from 'src/theme-config/interfaces/social-link.interface';
import { MarqueeSlide } from 'src/theme-config/interfaces/marquee-config.interface';
import { CarouselSlide } from 'src/theme-config/interfaces/carousel-config.interface';

const SOCIAL_LINKS_KEY = 'SOCIAL_LINKS';
const BANNER_SLIDER_KEY = 'BANNER_SLIDER';
const CAROUSEL_SLIDER_KEY = 'CAROUSEL_SLIDER';

@Injectable()
export class ThemeConfigService {
  constructor(private prismaService: PrismaService) { }

  private toGlobalSettingResponse<T>(config: {
    id: string;
    key: string;
    value: Prisma.JsonValue;
    updatedAt: Date;
  }): GlobalSettingResponseDto<T> {
    return {
      id: config.id,
      key: config.key,
      value: config.value as unknown as T,
      updatedAt: config.updatedAt,
    };
  }

  async getSocialLinks(): Promise<GlobalSettingResponseDto<SocialLink[]>> {
    const config = await this.prismaService.themeConfig.findUnique({
      where: { key: SOCIAL_LINKS_KEY },
    });

    if (!config) {
      return {
        id: '',
        key: SOCIAL_LINKS_KEY,
        value: [],
        updatedAt: new Date(),
      };
    }

    return {
      ...this.toGlobalSettingResponse<SocialLink[]>(config),
      value: Array.isArray(config.value)
        ? (config.value as unknown as SocialLink[])
        : [],
    };
  }

  async upsertConfig<T>(
    key: string,
    value: T
  ): Promise<GlobalSettingResponseDto<T>> {
    const config = await this.prismaService.themeConfig.upsert({
      where: { key },
      create: {
        key,
        value: value as Prisma.InputJsonValue,
      },
      update: {
        value: value as Prisma.InputJsonValue,
      },
    });

    return this.toGlobalSettingResponse<T>(config);
  }

  async upsertSocialLinks(
    dto: UpdateThemeConfigSocialLinksRequestDto
  ): Promise<GlobalSettingResponseDto<SocialLink[]>> {
    return this.upsertConfig<SocialLink[]>(SOCIAL_LINKS_KEY, dto.value);
  }

  async getMarquee(): Promise<GlobalSettingResponseDto<MarqueeSlide[]>> {
    const config = await this.prismaService.themeConfig.findUnique({
      where: { key: BANNER_SLIDER_KEY },
    });

    if (!config) {
      return {
        id: '',
        key: BANNER_SLIDER_KEY,
        value: [],
        updatedAt: new Date(),
      };
    }

    return {
      ...this.toGlobalSettingResponse<MarqueeSlide[]>(config),
      value: Array.isArray(config.value)
        ? (config.value as unknown as MarqueeSlide[])
        : [],
    };
  }

  async upsertMarquee(
    dto: UpdateThemeConfigMarqueeRequestDto
  ): Promise<GlobalSettingResponseDto<MarqueeSlide[]>> {
    return this.upsertConfig<MarqueeSlide[]>(BANNER_SLIDER_KEY, dto.value);
  }

  async getCarousel(): Promise<GlobalSettingResponseDto<CarouselSlide[]>> {
    const config = await this.prismaService.themeConfig.findUnique({
      where: { key: CAROUSEL_SLIDER_KEY },
    });

    if (!config) {
      return {
        id: '',
        key: CAROUSEL_SLIDER_KEY,
        value: [],
        updatedAt: new Date(),
      };
    }

    return {
      ...this.toGlobalSettingResponse<CarouselSlide[]>(config),
      value: Array.isArray(config.value)
        ? (config.value as unknown as CarouselSlide[])
        : [],
    };
  }

  async upsertCarousel(
    dto: UpdateThemeConfigCarouselRequestDto
  ): Promise<GlobalSettingResponseDto<CarouselSlide[]>> {
    const normalizedSlides: CarouselSlide[] = dto.value.map((slide) => ({
      id: slide.id,
      imageUrl: slide.imageUrl,
      href: slide.href,
      title: slide.title,
      subTitle: slide.subTitle,
    }));

    return this.upsertConfig<CarouselSlide[]>(
      CAROUSEL_SLIDER_KEY,
      normalizedSlides
    );
  }
}
