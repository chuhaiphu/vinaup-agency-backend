import { IsBoolean, IsString, IsUrl } from 'class-validator';

export class SocialLinkItemDto {
  @IsString()
  id: string;

  @IsString()
  platform: string;

  @IsString()
  @IsUrl()
  url: string;

  @IsBoolean()
  isActive: boolean;
}
