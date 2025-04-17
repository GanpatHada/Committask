/*
  Warnings:

  - Made the column `dueDate` on table `Todo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "dueDate" SET NOT NULL;
