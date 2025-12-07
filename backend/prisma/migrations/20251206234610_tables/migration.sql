-- CreateTable
CREATE TABLE "faixas_etarias" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(100),
    "ordem" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "faixas_etarias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rodas_faixas_etarias" (
    "id" SERIAL NOT NULL,
    "roda_id" INTEGER NOT NULL,
    "faixa_etaria_id" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rodas_faixas_etarias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rodas_faixas_etarias_roda_id_faixa_etaria_id_key" ON "rodas_faixas_etarias"("roda_id", "faixa_etaria_id");

-- AddForeignKey
ALTER TABLE "rodas_faixas_etarias" ADD CONSTRAINT "rodas_faixas_etarias_roda_id_fkey" FOREIGN KEY ("roda_id") REFERENCES "rodas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rodas_faixas_etarias" ADD CONSTRAINT "rodas_faixas_etarias_faixa_etaria_id_fkey" FOREIGN KEY ("faixa_etaria_id") REFERENCES "faixas_etarias"("id") ON DELETE CASCADE ON UPDATE CASCADE;
