import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: "123456",
    },
  });
}

main()
  .then(() => console.log("✅ Banco populado com sucesso"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
