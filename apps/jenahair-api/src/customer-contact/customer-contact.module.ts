import { Module } from '@nestjs/common';
import { CustomerContactService } from './customer-contact.service';
import { CustomerContactController } from './customer-contact.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';
import { RecaptchaModule } from 'src/recaptcha/recaptcha.module';

@Module({
  imports: [PrismaModule, MailModule, RecaptchaModule],
  controllers: [CustomerContactController],
  providers: [CustomerContactService],
  exports: [CustomerContactService],
})
export class CustomerContactModule {}
