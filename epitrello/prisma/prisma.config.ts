import { defineConfig } from '@prisma/internals';

export default defineConfig({
  datasource: {
    provider: 'postgresql',
    url: process.env.POSTGRES_PRISMA_URL,
    // directUrl: process.env.POSTGRES_URL_NON_POOLING, // Optionnel, selon besoin
  },
});
