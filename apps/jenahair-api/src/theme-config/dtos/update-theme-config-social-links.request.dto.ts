import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { SocialLinkItemDto } from 'src/theme-config/dtos/social-link-item.dto';

export class UpdateThemeConfigSocialLinksRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkItemDto)
  value: SocialLinkItemDto[];
}
