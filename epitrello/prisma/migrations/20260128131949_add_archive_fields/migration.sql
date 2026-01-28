-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "List" ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;
