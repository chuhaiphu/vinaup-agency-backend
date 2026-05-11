import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePageRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  type?: string;

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

  @IsString()
  @IsOptional()
  visibility?: string;

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
}
