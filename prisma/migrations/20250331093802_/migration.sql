/*
  Warnings:

  - Added the required column `address` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Instructor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Instructor" ADD COLUMN     "address" TEXT NOT NULL;
