import { TourCategory, Tour } from 'src/prisma/generated/client';

export class TourCategoryTourResponseDto {
  id: string;
  tourCategoryId: string;
  tourId: string;
  sortOrder: number;
  tourCategory?: TourCategory;
  tour?: Tour;
}
