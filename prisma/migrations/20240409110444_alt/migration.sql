/*
  Warnings:

  - Changed the type of `code` on the `attendanceCode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "attendanceCode_code_key";

-- AlterTable
ALTER TABLE "attendanceCode" DROP COLUMN "code",
ADD COLUMN     "code" INTEGER NOT NULL;
