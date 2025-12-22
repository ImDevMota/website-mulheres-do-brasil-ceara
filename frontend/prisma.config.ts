import { defineConfig } from "@prisma/config";

const config = {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};

export default defineConfig(config as any);
