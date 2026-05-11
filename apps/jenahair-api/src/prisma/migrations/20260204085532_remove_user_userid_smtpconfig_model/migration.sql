/*
  Warnings:

  - You are about to drop the column `userId` on the `SmtpConfig` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SmtpConfig" DROP CONSTRAINT "SmtpConfig_userId_fkey";

-- AlterTable
ALTER TABLE "SmtpConfig" DROP COLUMN "userId";

