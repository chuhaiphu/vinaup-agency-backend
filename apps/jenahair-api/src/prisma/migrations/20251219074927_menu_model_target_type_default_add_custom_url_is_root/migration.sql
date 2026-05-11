/*
  Warnings:

  - Made the column `targetType` on table `Menu` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "customUrl" TEXT,
ADD COLUMN     "isRoot" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "targetType" SET NOT NULL,
ALTER COLUMN "targetType" SET DEFAULT 'custom-url';
