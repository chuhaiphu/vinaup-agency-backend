import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SmtpController } from './controllers/smtp.controller';
import { MailService } from './services/mail.service';
import { SmtpService } from './services/smtp.service';

@Module({
  imports: [PrismaModule],
  controllers: [SmtpController],
  providers: [MailService, SmtpService],
  exports: [MailService, SmtpService],
})
export class MailModule {}
