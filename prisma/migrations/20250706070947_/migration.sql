/*
  Warnings:

  - Added the required column `schoolId` to the `GradeLevel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GradeLevel" ADD COLUMN     "schoolId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "GradeLevel" ADD CONSTRAINT "GradeLevel_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
