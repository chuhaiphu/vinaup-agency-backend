import { IsOptional, IsString } from 'class-validator';

export class UpdateMediaRequestDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  folder?: string;
}
