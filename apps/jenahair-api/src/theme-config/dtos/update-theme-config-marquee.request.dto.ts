import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { MarqueeSlideItemDto } from 'src/theme-config/dtos/marquee-slide-item.dto';

export class UpdateThemeConfigMarqueeRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarqueeSlideItemDto)
  value: MarqueeSlideItemDto[];
}
