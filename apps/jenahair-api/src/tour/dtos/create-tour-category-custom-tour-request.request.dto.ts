import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTourCategoryCustomTourRequestRequestDto {
  @IsString()
  @IsNotEmpty()
  tourCategoryId: string;

  @IsString()
  @IsNotEmpty()
  customTourRequestId: string;
}
