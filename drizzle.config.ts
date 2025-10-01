import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

// Check if we're using SQLite for development
const isSQLite = process.env.DATABASE_URL?.includes('sqlite');

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: isSQLite ? "sqlite" : "postgresql",
  dbCredentials: isSQLite ? {
    url: "./dev.db",
  } : {
    url: process.env.DATABASE_URL,
  },
});
