-- DropForeignKey
ALTER TABLE "BlogCategoryBlog" DROP CONSTRAINT "BlogCategoryBlog_blogCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "BlogCategoryBlog" DROP CONSTRAINT "BlogCategoryBlog_blogId_fkey";

-- DropForeignKey
ALTER TABLE "TourCategoryTour" DROP CONSTRAINT "TourCategoryTour_tourCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "TourCategoryTour" DROP CONSTRAINT "TourCategoryTour_tourId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "CustomTourRequest" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "TourCategoryTour" ADD CONSTRAINT "TourCategoryTour_tourCategoryId_fkey" FOREIGN KEY ("tourCategoryId") REFERENCES "TourCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourCategoryTour" ADD CONSTRAINT "TourCategoryTour_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCategoryBlog" ADD CONSTRAINT "BlogCategoryBlog_blogCategoryId_fkey" FOREIGN KEY ("blogCategoryId") REFERENCES "BlogCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCategoryBlog" ADD CONSTRAINT "BlogCategoryBlog_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
