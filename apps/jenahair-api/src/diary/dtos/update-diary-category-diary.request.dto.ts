import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDiaryCategoryDiaryRequestDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sortOrder?: number;
}
