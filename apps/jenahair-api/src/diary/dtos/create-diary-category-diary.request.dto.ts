import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDiaryCategoryDiaryRequestDto {
  @IsString()
  @IsNotEmpty()
  diaryCategoryId!: string;

  @IsString()
  @IsNotEmpty()
  diaryId!: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sortOrder?: number;
}
