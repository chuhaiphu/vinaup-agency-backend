import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDiaryCategoryRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  endpoint: string;
}
