import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateDynamicSectionUIRequestDto {
  @IsNumber()
  @IsNotEmpty()
  position: number;

  @IsString()
  @IsOptional()
  sectionUICredentialsId?: string;

  @IsObject()
  @IsOptional()
  properties?: object;
}
