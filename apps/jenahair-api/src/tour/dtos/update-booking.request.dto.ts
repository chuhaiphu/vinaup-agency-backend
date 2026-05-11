import { IsOptional, IsString } from 'class-validator';

export class UpdateBookingRequestDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  customerNotes?: string;
}
