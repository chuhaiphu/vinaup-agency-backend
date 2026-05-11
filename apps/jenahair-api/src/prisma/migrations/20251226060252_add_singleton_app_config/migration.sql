/*
  Warnings:

  - You are about to drop the column `key` on the `AppConfig` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `AppConfig` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "AppConfig_key_key";

-- AlterTable
ALTER TABLE "AppConfig" DROP COLUMN "key",
DROP COLUMN "value",
ADD COLUMN     "addressContact" TEXT,
ADD COLUMN     "emailContact" TEXT,
ADD COLUMN     "faviconUrl" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneContact" TEXT,
ADD COLUMN     "websiteDescription" TEXT,
ADD COLUMN     "websiteTitle" TEXT,
ADD COLUMN     "workingHours" TEXT;
