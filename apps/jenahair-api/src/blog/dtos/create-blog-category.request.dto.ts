import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogCategoryRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  endpoint: string;
}
