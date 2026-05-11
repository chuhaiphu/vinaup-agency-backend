import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMenuRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  customUrl?: string;
}
