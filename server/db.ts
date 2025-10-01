import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import ws from "ws";
import * as schema from "@shared/schema";
import * as sqliteSchema from "@shared/schema-sqlite";

// Check if we're in development mode and should use SQLite
const isDevelopment = process.env.NODE_ENV === 'development';
const useSQLite = isDevelopment && (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('sqlite'));

let db: any;
let pool: any = null;

if (useSQLite) {
  // Use SQLite for development
  const sqlite = new Database('./dev.db');
  db = drizzleSQLite(sqlite, { schema: sqliteSchema });
} else {
  // Use Neon for production
  neonConfig.webSocketConstructor = ws;

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }

  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { db, pool };
