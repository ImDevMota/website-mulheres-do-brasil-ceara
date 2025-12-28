import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const coordenadasPadrao = {
  Fortaleza: { latitude: -3.7172, longitude: -38.5433 },
  Sobral: { latitude: -3.6861, longitude: -40.35 },
  "Juazeiro do Norte": { latitude: -7.2131, longitude: -39.3151 },
  Acaraú: { latitude: -2.8858, longitude: -40.12 },
  Aracati: { latitude: -4.56167, longitude: -37.7697 },
  Itapipoca: { latitude: -3.4944, longitude: -39.5789 },
  Quixadá: { latitude: -4.9708, longitude: -39.015 },
  Iguatu: { latitude: -6.35917, longitude: -39.29889 },
  Crateús: { latitude: -5.17833, longitude: -40.6775 },
  Tianguá: { latitude: -3.73167, longitude: -40.9917 },
  Tauá: { latitude: -6.00389, longitude: -40.2925 },
  "Limoeiro do Norte": { latitude: -5.14583, longitude: -38.0981 },
  Canindé: { latitude: -4.35917, longitude: -39.3131 },
  Camocim: { latitude: -2.9022, longitude: -40.8411 },
};

async function main() {
  console.log("🌱 Iniciando seed...");

  // 1. Criar ou buscar um multiplicador padrão para associar as rodas
  const multiplicador = await prisma.multiplicador.upsert({
    where: { email: "admin@mulheresdobrasil.com.br" },
    update: {},
    create: {
      nome: "Coordenação Ceará",
      cpf: "00000000000",
      email: "admin@mulheresdobrasil.com.br",
      senha: "hash_de_senha_segura", // Na prática seria um hash real
      estado: "CE",
      municipio: "Fortaleza",
      telefone: "85999999999",
      profissao: "Administrador",
    },
  });

  console.log(
    `👤 Multiplicador garantido: ${multiplicador.nome} (ID: ${multiplicador.id})`
  );

  // 2. Limpar rodas ativas antigas (opcional, mas bom para evitar duplicatas infinitas se rodar várias vezes)
  // await prisma.roda.deleteMany({ where: { status: "ativa", multiplicadorId: multiplicador.id } });

  // 3. Criar rodas para cada município
  const promises = Object.entries(coordenadasPadrao).map(
    async ([cidade, coords], index) => {
      const dataRoda = new Date();
      dataRoda.setDate(dataRoda.getDate() + index + 1); // Uma roda por dia nos próximos dias

      return prisma.roda.create({
        data: {
          multiplicadorId: multiplicador.id,
          tema: `Roda de Conversa em ${cidade}`,
          data: dataRoda,
          hora_inicio: new Date(dataRoda.setHours(14, 0, 0)),
          municipio: cidade,
          local: "Centro da Cidade",
          publico_alvo: "Mulheres da região",
          latitude: coords.latitude,
          longitude: coords.longitude,
          status: "ativa",
          numeroParticipantes: 0,
        },
      });
    }
  );

  await Promise.all(promises);

  console.log(`✅ ${promises.length} rodas criadas com sucesso!`);
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
