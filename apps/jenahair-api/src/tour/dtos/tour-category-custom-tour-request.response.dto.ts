import { TourCategory, CustomTourRequest } from 'src/prisma/generated/client';

export class TourCategoryCustomTourRequestResponseDto {
  id: string;
  tourCategoryId: string;
  customTourRequestId: string;
  tourCategory?: TourCategory;
  customTourRequest?: CustomTourRequest;
}
