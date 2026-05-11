import { TourCategory } from 'src/prisma/generated/client';

export class TourCategoryResponseDto {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
  videoUrl: string | null;
  videoThumbnailUrl: string | null;
  videoPosition: string | null;
  mainImageUrl: string | null;
  endpoint: string;
  createdAt: Date;
  updatedAt: Date;
  parent?: TourCategory | null;
  children?: TourCategory[];
}
