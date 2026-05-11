import { IsString } from 'class-validator';

export class MarqueeSlideItemDto {
  @IsString()
  id!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  imageUrl!: string;
}
