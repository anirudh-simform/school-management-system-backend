-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_schoolId_fkey";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "schoolId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
