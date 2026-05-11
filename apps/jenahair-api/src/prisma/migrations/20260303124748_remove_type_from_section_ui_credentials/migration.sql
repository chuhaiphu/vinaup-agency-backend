/*
  Warnings:

  - You are about to drop the column `type` on the `SectionUICredentials` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SectionUICredentials" DROP COLUMN IF EXISTS "type";