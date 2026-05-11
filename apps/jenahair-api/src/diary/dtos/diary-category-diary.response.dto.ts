import { DiaryCategory, Diary } from 'src/prisma/generated/client';

export class DiaryCategoryDiaryResponseDto {
  id: string;
  diaryCategoryId: string;
  diaryId: string;
  sortOrder: number;
  diaryCategory?: DiaryCategory;
  diary?: Diary;
}
