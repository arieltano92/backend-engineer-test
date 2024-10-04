import { pool } from "../../database";
import type { Address, AddressBalanceMap, AddressWithBalanceRows } from "../types";

export async function getBalancesByAddress(addresses : Array<Address>): Promise<AddressWithBalanceRows> {
    const query: string = `
          SELECT address, balance FROM balances WHERE address = ANY($1::text[]);
    `
    const { rows } = await pool.query(query,[addresses])
    return rows
}

//Update all the balances related at the same time,with the pool received from params to be atomic with the creation of the transaxtion
export async function updateBalances(balances: AddressBalanceMap, connectionPool = pool): Promise<void>{
    console.log("Upating balances")
    const values : (string | number)[][] = Object.entries(balances).map(([address, { balance }]) => [address, balance]);
    let queryValuesArray: Array<string> = []
    let argumentPosition: number = 1
    values.forEach(()=>{
        queryValuesArray.push(`($${argumentPosition}, $${argumentPosition+1})`)
        argumentPosition += 2
    })
    const query: string = `
      INSERT INTO balances (address, balance) VALUES ${queryValuesArray.join(',')} ON CONFLICT (address) DO UPDATE set balance = EXCLUDED.balance;
    `;
    const result = await connectionPool.query(query, values.flat());
    console.log('Balances updated successfully:', result.rowCount);
}