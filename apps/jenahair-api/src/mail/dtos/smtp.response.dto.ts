export class SmtpResponseDto {
  id: string;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  receiveEmail: string | null;
  updatedAt: Date;
}
