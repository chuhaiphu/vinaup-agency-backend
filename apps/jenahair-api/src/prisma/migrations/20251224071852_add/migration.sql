/*
  Warnings:

  - You are about to drop the column `types` on the `CustomTourRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CustomTourRequest" DROP COLUMN "types";

-- CreateTable
CREATE TABLE "TourCategoryCustomTourRequest" (
    "id" TEXT NOT NULL,
    "customTourRequestId" TEXT NOT NULL,
    "tourCategoryId" TEXT NOT NULL,

    CONSTRAINT "TourCategoryCustomTourRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TourCategoryCustomTourRequest_customTourRequestId_tourCateg_key" ON "TourCategoryCustomTourRequest"("customTourRequestId", "tourCategoryId");

-- AddForeignKey
ALTER TABLE "TourCategoryCustomTourRequest" ADD CONSTRAINT "TourCategoryCustomTourRequest_customTourRequestId_fkey" FOREIGN KEY ("customTourRequestId") REFERENCES "CustomTourRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourCategoryCustomTourRequest" ADD CONSTRAINT "TourCategoryCustomTourRequest_tourCategoryId_fkey" FOREIGN KEY ("tourCategoryId") REFERENCES "TourCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
