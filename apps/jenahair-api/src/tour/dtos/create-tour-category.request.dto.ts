import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTourCategoryRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  endpoint: string;
}
