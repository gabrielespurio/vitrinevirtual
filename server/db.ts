import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Conexão exclusiva com banco Neon - URL específica do usuário
let rawNeonUrl = process.env.NEON_DATABASE_URL || 'postgresql://neondb_owner:npg_IVmG9fiMSWn7@ep-mute-tree-acxx8sln-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Remove o prefixo 'psql' se existir
if (rawNeonUrl.startsWith("psql '") && rawNeonUrl.endsWith("'")) {
  rawNeonUrl = rawNeonUrl.slice(6, -1);
}

const NEON_DATABASE_URL = rawNeonUrl;

if (!NEON_DATABASE_URL) {
  throw new Error(
    "NEON_DATABASE_URL must be set. Connection to Neon database failed.",
  );
}

console.log('🔗 Conectando exclusivamente ao banco Neon:', NEON_DATABASE_URL.replace(/:[^:@]+@/, ':***@'));
export const pool = new Pool({ connectionString: NEON_DATABASE_URL });
export const db = drizzle({ client: pool, schema });