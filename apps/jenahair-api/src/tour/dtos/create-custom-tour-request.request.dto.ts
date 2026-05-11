import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCustomTourRequestRequestDto {
  @IsDateString({ strict: true })
  startDate: Date;

  @IsDateString({ strict: true })
  endDate: Date;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  adultCount?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  childCount?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  destinations?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];

  @IsString()
  @IsOptional()
  hotelType?: string;

  @IsString()
  @IsOptional()
  roomType?: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsString()
  @IsOptional()
  customerNotes?: string;

  @IsString()
  @IsOptional()
  recaptchaToken?: string;
}
