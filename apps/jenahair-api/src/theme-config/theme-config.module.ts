import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ThemeConfigController } from 'src/theme-config/theme-config.controller';
import { ThemeConfigService } from 'src/theme-config/theme-config.service';

@Module({
  imports: [PrismaModule],
  controllers: [ThemeConfigController],
  providers: [ThemeConfigService],
  exports: [ThemeConfigService],
})
export class ThemeConfigModule {}
