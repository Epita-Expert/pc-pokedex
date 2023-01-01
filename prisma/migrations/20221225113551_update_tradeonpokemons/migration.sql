/*
  Warnings:

  - Added the required column `sent` to the `TradesOnPokemons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TradesOnPokemons" ADD COLUMN     "sent" BOOLEAN NOT NULL;
