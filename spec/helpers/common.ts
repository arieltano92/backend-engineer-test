import { pool } from "../../database"

export async function clearDB(): Promise<void> {
    await pool.query('DELETE FROM balances')
    await pool.query('DELETE FROM transactions')
}