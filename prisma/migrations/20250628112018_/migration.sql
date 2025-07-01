/*
  Warnings:

  - You are about to drop the column `studentBatchId` on the `StudentGroup` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentGroup" DROP CONSTRAINT "StudentGroup_studentBatchId_fkey";

-- AlterTable
ALTER TABLE "StudentGroup" DROP COLUMN "studentBatchId";
