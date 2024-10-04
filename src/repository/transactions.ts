import { pool } from "../../database";
import type { Input, Address, TransactionEntity, AddressBalanceMap, Height, AddressWithBalance } from "../types"
import { updateBalances } from "./balances";

export async function getAddressFromInput({txId, index}: Input): Promise<Address>{
    const { rows } = await pool.query(`
          SELECT outputs[$1] ->> 'address' as address FROM transactions WHERE id = $2;
    `,[index, txId]);
    const [result] = rows
    const {address} =  result
    return address
}

// Update balances atomically after save the transaction using same pool connect
export async function postTransactionWithBalances(trx: TransactionEntity, balances: AddressBalanceMap): Promise<void>{
    let client;
    try {
        client = await pool.connect()
        await client.query('BEGIN')
        const insertTransaction: string = 'INSERT INTO transactions(id,inputs,outputs,height) VALUES($1,$2,$3,$4) RETURNING id'
        await client.query(insertTransaction,[trx.id,JSON.stringify(trx.inputs),JSON.stringify(trx.outputs),trx.height])
        await updateBalances(balances, pool)
        await client.query('COMMIT')
    } catch (e) {
        await client?.query('ROLLBACK')
        throw e
    } finally {
        client?.release()
    }
}

export async function getTransactionsAfterHeight(height: Height): Promise<Array<TransactionEntity>> {
    const query: string = `
          SELECT * FROM transactions WHERE height > $1 ORDER BY created_at DESC;
    `
    const { rows } = await pool.query(query,[height])
    return rows
}

export async function deleteTransactionWithBalances(trx: TransactionEntity, balances: AddressBalanceMap): Promise<void>{
    let client;
    try {
        client = await pool.connect()
        await client.query('BEGIN')
        const deleteTransaction: string = 'DELETE from transactions where id = $1'
        await client.query(deleteTransaction,[trx.id])
        await updateBalances(balances, pool)
        await client.query('COMMIT')
    } catch (e) {
        await client?.query('ROLLBACK')
        throw e
    } finally {
        client?.release()
    }
}

export async function getLast(): Promise<Array<TransactionEntity>> {
    const query: string = `
          SELECT * FROM transactions ORDER BY height DESC, created_at DESC LIMIT 1;
    `
    const { rows } = await pool.query(query)
    return rows
}

export async function getInputData({txId, index}: Input): Promise<AddressWithBalance>{
    const { rows } = await pool.query(`
          SELECT outputs[$1] ->> 'address' as address, outputs[$1] ->> 'value' as value FROM transactions WHERE id = $2;
    `,[index, txId]);
    const [result] = rows
    return result;
}