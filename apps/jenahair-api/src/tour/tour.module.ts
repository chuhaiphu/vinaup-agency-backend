import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';
import { TourController } from './controllers/tour.controller';
import { TourCategoryController } from './controllers/tour-category.controller';
import { TourCategoryTourController } from './controllers/tour-category-tour.controller';
import { BookingController } from './controllers/booking.controller';
import { CustomTourRequestController } from './controllers/custom-tour-request.controller';
import { TourCategoryCustomTourRequestController } from './controllers/tour-category-custom-tour-request.controller';
import { TourService } from './services/tour.service';
import { TourCategoryService } from './services/tour-category.service';
import { TourCategoryTourService } from './services/tour-category-tour.service';
import { BookingService } from './services/booking.service';
import { CustomTourRequestService } from './services/custom-tour-request.service';
import { TourCategoryCustomTourRequestService } from './services/tour-category-custom-tour-request.service';
import { RecaptchaModule } from 'src/recaptcha/recaptcha.module';

@Module({
  imports: [PrismaModule, MailModule, RecaptchaModule],
  controllers: [
    TourController,
    TourCategoryController,
    TourCategoryTourController,
    BookingController,
    CustomTourRequestController,
    TourCategoryCustomTourRequestController,
  ],
  providers: [
    TourService,
    TourCategoryService,
    TourCategoryTourService,
    BookingService,
    CustomTourRequestService,
    TourCategoryCustomTourRequestService,
  ],
  exports: [
    TourService,
    TourCategoryService,
    TourCategoryTourService,
    BookingService,
    CustomTourRequestService,
    TourCategoryCustomTourRequestService,
  ],
})
export class TourModule {}
