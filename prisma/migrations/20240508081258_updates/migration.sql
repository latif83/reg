-- DropForeignKey
ALTER TABLE "Memo" DROP CONSTRAINT "Memo_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "Memo" DROP CONSTRAINT "Memo_senderId_fkey";

-- AddForeignKey
ALTER TABLE "Memo" ADD CONSTRAINT "Memo_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memo" ADD CONSTRAINT "Memo_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
