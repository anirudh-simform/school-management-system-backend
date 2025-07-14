/*
  Warnings:

  - Added the required column `schoolId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolId` to the `ConversationParticipant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolId` to the `MessageRead` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "schoolId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ConversationParticipant" ADD COLUMN     "schoolId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "schoolId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MessageRead" ADD COLUMN     "schoolId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageRead" ADD CONSTRAINT "MessageRead_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
