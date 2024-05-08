-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_deptId_fkey";

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_deptId_fkey" FOREIGN KEY ("deptId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
