import { IsNotEmpty, IsString } from 'class-validator';

export class LocalSignInRequestDto {
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
