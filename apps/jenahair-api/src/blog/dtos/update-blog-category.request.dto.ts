import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateBlogCategoryRequestDto } from './create-blog-category.request.dto';

export class UpdateBlogCategoryRequestDto implements Partial<CreateBlogCategoryRequestDto> {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  endpoint?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sortOrder?: number;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsString()
  @IsOptional()
  videoThumbnailUrl?: string;

  @IsString()
  @IsOptional()
  videoPosition?: string;

  @IsString()
  @IsOptional()
  mainImageUrl?: string;
}
