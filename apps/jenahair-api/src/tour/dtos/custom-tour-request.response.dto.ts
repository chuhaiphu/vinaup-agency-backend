import { TourCategoryCustomTourRequest } from 'src/prisma/generated/client';

export class CustomTourRequestResponseDto {
  id: string;
  startDate: Date;
  endDate: Date;
  adultCount: number;
  childCount: number;
  destinations: string[];
  hotelType: string | null;
  roomType: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  tourCategoryCustomTourRequests?: TourCategoryCustomTourRequest[];
}
