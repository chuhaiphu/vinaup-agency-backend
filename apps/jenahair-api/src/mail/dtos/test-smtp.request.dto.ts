import { IsEmail, IsNotEmpty } from 'class-validator';

export class TestSmtpRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
