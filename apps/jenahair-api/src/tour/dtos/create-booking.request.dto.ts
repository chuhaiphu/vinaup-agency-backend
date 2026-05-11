import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingRequestDto {
  @IsString()
  @IsNotEmpty()
  tourId: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  adultCount?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  childCount?: number;

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
