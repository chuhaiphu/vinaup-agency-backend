import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { AuthConfig } from './_core/configs/auth.config';
import { ConfigService } from '@nestjs/config';
import { AppExceptionFilter } from './_core/filters/app-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AuthExceptionFilter } from './_core/filters/auth-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AuthConfig>('auth');

  app.enableCors({
    origin: appConfig?.cors.origin,
    credentials: true,
  });
  
  app.use(cookieParser());

  const authFilter = app.get(AuthExceptionFilter);
  const appFilter = app.get(AppExceptionFilter);
  app.useGlobalFilters(appFilter, authFilter);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(process.env.PORT ?? 8000);
}
void bootstrap();
