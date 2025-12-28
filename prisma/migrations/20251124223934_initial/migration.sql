/*
  Warnings:

  - You are about to drop the `Multiplicador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Roda` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Roda" DROP CONSTRAINT "Roda_multiplicadorId_fkey";

-- DropTable
DROP TABLE "Multiplicador";

-- DropTable
DROP TABLE "Roda";

-- CreateTable
CREATE TABLE "multiplicadores" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "profissao" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "multiplicadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rodas" (
    "id" SERIAL NOT NULL,
    "multiplicadorId" INTEGER NOT NULL,
    "tema" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "hora_inicio" TIMESTAMP(3) NOT NULL,
    "municipio" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "publico_alvo" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "numeroParticipantes" INTEGER,
    "fotoFrequenciaUrl" TEXT,
    "fotoRodaUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ativa',
    "resumo" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rodas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "multiplicadores_cpf_key" ON "multiplicadores"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "multiplicadores_email_key" ON "multiplicadores"("email");

-- AddForeignKey
ALTER TABLE "rodas" ADD CONSTRAINT "rodas_multiplicadorId_fkey" FOREIGN KEY ("multiplicadorId") REFERENCES "multiplicadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
