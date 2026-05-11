import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAppConfigRequestDto {
  @IsBoolean()
  @IsOptional()
  maintenanceMode?: boolean;

  @IsString()
  @IsOptional()
  faviconUrl?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  emailContact?: string;

  @IsString()
  @IsOptional()
  phoneContact?: string;

  @IsString()
  @IsOptional()
  addressContact?: string;
  
  @IsString()
  @IsOptional()
  websiteTitle?: string;

  @IsString()
  @IsOptional()
  websiteDescription?: string;
}
