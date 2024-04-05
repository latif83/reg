/*
  Warnings:

  - A unique constraint covering the columns `[staffid]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "employees_staffid_key" ON "employees"("staffid");
