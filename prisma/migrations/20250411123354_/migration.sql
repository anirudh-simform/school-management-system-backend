/*
  Warnings:

  - A unique constraint covering the columns `[userEmail]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userEmail_key" ON "RefreshToken"("userEmail");
