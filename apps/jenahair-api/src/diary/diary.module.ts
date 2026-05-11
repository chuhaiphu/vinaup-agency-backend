import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DiaryController } from './controllers/diary.controller';
import { DiaryCategoryController } from './controllers/diary-category.controller';
import { DiaryCategoryDiaryController } from './controllers/diary-category-diary.controller';
import { DiaryService } from './services/diary.service';
import { DiaryCategoryService } from './services/diary-category.service';
import { DiaryCategoryDiaryService } from './services/diary-category-diary.service';

@Module({
  imports: [PrismaModule],
  controllers: [DiaryController, DiaryCategoryController, DiaryCategoryDiaryController],
  providers: [DiaryService, DiaryCategoryService, DiaryCategoryDiaryService],
  exports: [DiaryService, DiaryCategoryService, DiaryCategoryDiaryService],
})
export class DiaryModule {}
