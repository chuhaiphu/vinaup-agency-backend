import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTourCategoryTourRequestDto {
  @IsString()
  @IsNotEmpty()
  tourCategoryId: string;

  @IsString()
  @IsNotEmpty()
  tourId: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sortOrder?: number;
}
