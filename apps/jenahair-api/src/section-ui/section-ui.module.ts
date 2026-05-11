import { Module } from '@nestjs/common';
import { SectionUIService } from './section-ui.service';
import { SectionUIController } from './section-ui.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SectionUIController],
  providers: [SectionUIService],
  exports: [SectionUIService],
})
export class SectionUIModule {}
