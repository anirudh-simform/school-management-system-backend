/*
  Warnings:

  - You are about to drop the column `insturctorId` on the `InstructorProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[instructorId]` on the table `InstructorProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `instructorId` to the `InstructorProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InstructorProfile" DROP CONSTRAINT "InstructorProfile_insturctorId_fkey";

-- DropIndex
DROP INDEX "InstructorProfile_insturctorId_key";

-- AlterTable
ALTER TABLE "InstructorProfile" DROP COLUMN "insturctorId",
ADD COLUMN     "instructorId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "InstructorProfile_instructorId_key" ON "InstructorProfile"("instructorId");

-- AddForeignKey
ALTER TABLE "InstructorProfile" ADD CONSTRAINT "InstructorProfile_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
