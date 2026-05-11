import { Tour } from 'src/prisma/generated/client';

export class BookingResponseDto {
  id: string;
  tourId: string;
  status: string;
  adultCount: number;
  childCount: number;
  adultPrice: number;
  childPrice: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  tour: Tour;
}
