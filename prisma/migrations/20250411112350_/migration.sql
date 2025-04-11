/*
  Warnings:

  - You are about to drop the column `userId` on the `RefreshToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userEmail]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userEmail` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropIndex
DROP INDEX "RefreshToken_userId_key";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userEmail_key" ON "RefreshToken"("userEmail");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
