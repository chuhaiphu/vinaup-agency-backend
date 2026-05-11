import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTourRequestDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsArray()
  @IsString({ each: true })
  destinations: string[];

  @IsString()
  @IsNotEmpty()
  endpoint: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsDateString({ strict: true })
  startDate?: Date;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  durationDays?: number;

  @IsString()
  @IsOptional()
  visibility?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sortOrder?: number;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  discountPrice?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  childPrice?: number;

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

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  additionalImageUrls?: string[];

  @IsString()
  @IsOptional()
  additionalImagesPosition?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];
}
