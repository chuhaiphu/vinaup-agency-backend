import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './_core/configs/auth.config';
import recaptchaConfig from './_core/configs/recaptcha.config';
import { AuthModule } from './auth/auth.module';
import { AuthExceptionFilter } from './_core/filters/auth-exception.filter';
import { AppExceptionFilter } from './_core/filters/app-exception.filter';
import { UserModule } from './user/user.module';
import { TourModule } from './tour/tour.module';
import { BlogModule } from './blog/blog.module';
import { DiaryModule } from './diary/diary.module';
import { PageModule } from './page/page.module';
import { MenuModule } from './menu/menu.module';
import { CustomerContactModule } from './customer-contact/customer-contact.module';
import { MediaModule } from './media/media.module';
import { UploadModule } from './upload/upload.module';
import { AppConfigModule } from './app-config/app-config.module';
import { ActionLogModule } from './action-log/action-log.module';
import { MailModule } from './mail/mail.module';
import { SectionUIModule } from './section-ui/section-ui.module';
import { ThemeConfigModule } from './theme-config/theme-config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, recaptchaConfig],
    }),
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
    AuthModule,
    UserModule,
    TourModule,
    BlogModule,
    DiaryModule,
    PageModule,
    MenuModule,
    CustomerContactModule,
    MediaModule,
    UploadModule,
    AppConfigModule,
    ActionLogModule,
    MailModule,
    SectionUIModule,
    ThemeConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthExceptionFilter, AppExceptionFilter],
})
export class AppModule {}
