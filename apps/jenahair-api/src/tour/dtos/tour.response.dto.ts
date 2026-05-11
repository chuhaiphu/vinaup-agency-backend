import { TourCategoryTour, User } from 'src/prisma/generated/client';

export class TourResponseDto {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  country: string;
  destinations: string[];
  endpoint: string;
  startDate: Date;
  durationDays: number;
  visibility: string;
  sortOrder: number;
  type: string;
  price: number;
  discountPrice: number;
  childPrice: number;
  videoUrl: string | null;
  videoThumbnailUrl: string | null;
  videoPosition: string | null;
  mainImageUrl: string | null;
  additionalImageUrls: string[];
  additionalImagesPosition: string | null;
  likes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: User | null;
  tourCategoryTours?: TourCategoryTour[];
}
