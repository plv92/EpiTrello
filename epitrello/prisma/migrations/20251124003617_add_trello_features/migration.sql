/*
  Warnings:

  - You are about to drop the column `checklistId` on the `ChecklistItem` table. All the data in the column will be lost.
  - You are about to drop the `CardMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Checklist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Label` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cardId` to the `ChecklistItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `ChecklistItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CardMember" DROP CONSTRAINT "CardMember_cardId_fkey";

-- DropForeignKey
ALTER TABLE "Checklist" DROP CONSTRAINT "Checklist_cardId_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistItem" DROP CONSTRAINT "ChecklistItem_checklistId_fkey";

-- DropForeignKey
ALTER TABLE "Label" DROP CONSTRAINT "Label_cardId_fkey";

-- DropIndex
DROP INDEX "ChecklistItem_checklistId_idx";

-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "customImage" TEXT;

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ChecklistItem" DROP COLUMN "checklistId",
ADD COLUMN     "cardId" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "customImage" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "customImage" TEXT;

-- DropTable
DROP TABLE "CardMember";

-- DropTable
DROP TABLE "Checklist";

-- DropTable
DROP TABLE "Label";

-- CreateTable
CREATE TABLE "CardAssignee" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardAssignee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardLabel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardAttachment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CardAssignee_cardId_idx" ON "CardAssignee"("cardId");

-- CreateIndex
CREATE INDEX "CardAssignee_userId_idx" ON "CardAssignee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CardAssignee_cardId_userId_key" ON "CardAssignee"("cardId", "userId");

-- CreateIndex
CREATE INDEX "CardLabel_cardId_idx" ON "CardLabel"("cardId");

-- CreateIndex
CREATE INDEX "CardAttachment_cardId_idx" ON "CardAttachment"("cardId");

-- CreateIndex
CREATE INDEX "ChecklistItem_cardId_idx" ON "ChecklistItem"("cardId");

-- AddForeignKey
ALTER TABLE "CardAssignee" ADD CONSTRAINT "CardAssignee_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardLabel" ADD CONSTRAINT "CardLabel_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistItem" ADD CONSTRAINT "ChecklistItem_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardAttachment" ADD CONSTRAINT "CardAttachment_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
