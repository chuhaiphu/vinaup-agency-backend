import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBlogCategoryBlogRequestDto {
  @IsString()
  @IsNotEmpty()
  blogCategoryId: string;

  @IsString()
  @IsNotEmpty()
  blogId: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sortOrder?: number;
}
