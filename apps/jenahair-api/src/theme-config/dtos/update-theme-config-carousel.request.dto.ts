import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CarouselSlideItemDto } from 'src/theme-config/dtos/carousel-slide-item.dto';

export class UpdateThemeConfigCarouselRequestDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CarouselSlideItemDto)
    value: CarouselSlideItemDto[];
}
