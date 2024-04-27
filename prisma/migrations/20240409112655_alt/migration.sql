/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `attendanceCode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attendanceCode" DROP COLUMN "expiresAt",
ALTER COLUMN "code" SET DATA TYPE TEXT;
