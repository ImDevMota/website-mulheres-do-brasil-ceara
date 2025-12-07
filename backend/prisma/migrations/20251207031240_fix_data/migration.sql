/*
  Warnings:

  - Changed the type of `data` on the `rodas` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `hora_inicio` on the `rodas` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "rodas" DROP COLUMN "data",
ADD COLUMN     "data" TIMESTAMP(3) NOT NULL,
DROP COLUMN "hora_inicio",
ADD COLUMN     "hora_inicio" TIMESTAMP(3) NOT NULL;
