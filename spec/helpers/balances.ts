import type { AddressWithBalance } from "../../src/types"
import { pool } from "../../database"

export async function createBalance({address, value}: AddressWithBalance): Promise<void> {
    await pool.query('INSERT into balances VALUES($1,$2)', [address, value])
}