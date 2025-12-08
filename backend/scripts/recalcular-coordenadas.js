/**
 * Script para recalcular coordenadas de todas as rodas
 * Execute com: node scripts/recalcular-coordenadas.js
 */

import { PrismaClient } from "@prisma/client";
import { buscarCoordenadas } from "../src/services/geocoding.js";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function recalcularCoordenadas() {
  console.log("🔄 Iniciando recálculo de coordenadas...\n");

  const rodas = await prisma.roda.findMany({
    select: {
      id: true,
      local: true,
      municipio: true,
      latitude: true,
      longitude: true,
    },
  });

  console.log(`📍 Total de rodas encontradas: ${rodas.length}\n`);

  let atualizadas = 0;
  let erros = 0;

  for (const roda of rodas) {
    console.log(`\n--- Roda ID: ${roda.id} ---`);
    console.log(`   Endereço: ${roda.local}`);
    console.log(`   Município: ${roda.municipio}`);
    console.log(
      `   Coords atuais: ${roda.latitude || "N/A"}, ${roda.longitude || "N/A"}`
    );

    try {
      const geoData = await buscarCoordenadas(roda.local, roda.municipio);

      if (geoData) {
        await prisma.roda.update({
          where: { id: roda.id },
          data: {
            latitude: geoData.latitude,
            longitude: geoData.longitude,
          },
        });

        console.log(`   ✅ Novas coords: ${geoData.latitude}, ${geoData.longitude}`);
        console.log(`   📍 Local: ${geoData.display_name}`);
        atualizadas++;
      } else {
        console.log(`   ⚠️ Geocodificação não encontrou resultado`);
        erros++;
      }
    } catch (error) {
      console.error(`   ❌ Erro: ${error.message}`);
      erros++;
    }

    // Aguarda 200ms entre requisições para não sobrecarregar a API
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log("\n========================================");
  console.log(`✅ Rodas atualizadas: ${atualizadas}`);
  console.log(`⚠️ Rodas sem coordenadas: ${erros}`);
  console.log("========================================\n");

  await prisma.$disconnect();
}

recalcularCoordenadas().catch((error) => {
  console.error("Erro fatal:", error);
  process.exit(1);
});
