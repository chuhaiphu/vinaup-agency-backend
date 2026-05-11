import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserRequestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;
}
