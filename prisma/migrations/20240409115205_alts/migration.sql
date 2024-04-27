/*
  Warnings:

  - Added the required column `AttendanceCodeId` to the `attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attendance" ADD COLUMN     "AttendanceCodeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_AttendanceCodeId_fkey" FOREIGN KEY ("AttendanceCodeId") REFERENCES "attendanceCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
