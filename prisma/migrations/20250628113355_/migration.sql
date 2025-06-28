/*
  Warnings:

  - You are about to drop the column `isGraded` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `studentProfileId` on the `StudentGroup` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentGroup" DROP CONSTRAINT "StudentGroup_studentProfileId_fkey";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "isGraded",
ADD COLUMN     "maxMarks" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "AssignmentGrade" ADD COLUMN     "marksObtained" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "StudentGroup" DROP COLUMN "studentProfileId";

-- CreateTable
CREATE TABLE "_StudentGroupToStudentProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_StudentGroupToStudentProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_StudentGroupToStudentProfile_B_index" ON "_StudentGroupToStudentProfile"("B");

-- AddForeignKey
ALTER TABLE "_StudentGroupToStudentProfile" ADD CONSTRAINT "_StudentGroupToStudentProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "StudentGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentGroupToStudentProfile" ADD CONSTRAINT "_StudentGroupToStudentProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
