import type { Config } from "drizzle-kit";

export default {
  strict: true,
  schema: "db/schema.ts",
  driver: "pg",
  out: "db/migrations",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;
