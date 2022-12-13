/*
  Warnings:

  - Changed the type of `sex` on the `Pokemons` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Pokemons" DROP COLUMN "sex",
ADD COLUMN     "sex" "Sex" NOT NULL;
