import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTourCategoryRequestDto } from './create-tour-category.request.dto';

export class UpdateTourCategoryRequestDto implements Partial<CreateTourCategoryRequestDto> {
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
