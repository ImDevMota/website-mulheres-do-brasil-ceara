-- CreateTable
CREATE TABLE "Multiplicador" (
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

    CONSTRAINT "Multiplicador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roda" (
    "id" SERIAL NOT NULL,
    "multiplicadorId" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "municipio" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "publicoAlvo" TEXT NOT NULL,
    "numeroParticipantes" INTEGER NOT NULL,
    "fotoFrequenciaUrl" TEXT,
    "fotoRodaUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ativa',
    "resumo" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Roda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Multiplicador_cpf_key" ON "Multiplicador"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Multiplicador_email_key" ON "Multiplicador"("email");

-- AddForeignKey
ALTER TABLE "Roda" ADD CONSTRAINT "Roda_multiplicadorId_fkey" FOREIGN KEY ("multiplicadorId") REFERENCES "Multiplicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
