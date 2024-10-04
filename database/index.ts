import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

  
export async function createTables() : Promise<void> {

    await pool.query(`
        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY,
          inputs JSONB NOT NULL,
          outputs JSONB NOT NULL,
          height integer NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
    `);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS balances (
          address TEXT PRIMARY KEY,
          balance numeric NOT NULL
        );
    `);
}
