import type { Block, Height, Transaction } from "../types"
import { processTransaction, getTransactionsForRollback, getLastTransaction, getInputByTrxAndIndex } from "./transactions";
import { ROLLBACK_OPERATION } from "../utils/constants";
import { BadRequestError } from 'http-errors-enhanced'

export async function processBlock (block: Block): Promise<void>{
    console.log("Processing block", block)
    for (const trx of block.transactions) {
        await processTransaction({trx, height: block.height})
    }
}

export async function rollbackToHeightBlock (height: Height): Promise<void>{
    console.log("Rollbacking to height", height)
    const trxsToRollback = await getTransactionsForRollback(height)
    for (const trx of trxsToRollback) {
        await processTransaction({trx, height}, ROLLBACK_OPERATION)
    }
}

export async function validateBlock (block: Block) : Promise<boolean>{
    return await validateHeight(block.height) &&
    validateBlockId(block) &&
    block.height !== 1 && await validateInOut(block.transactions)
}

async function validateHeight(height: Height): Promise<boolean> {
    const [lastTrx] = await getLastTransaction()
    if(!lastTrx && height !== 1 ) throw new BadRequestError('First block height should be 1!')
    if(lastTrx && height !== (lastTrx.height + 1)) throw new BadRequestError('Height value is not correlative with the last one!')
    return true
}

function validateBlockId({id, height, transactions}: Block): boolean {
    const dataToHash : string =height +  transactions.reduce((acc: string, trx: Transaction) => {
        acc += trx.id
        return acc
    },'')
    const hasher = new Bun.CryptoHasher("sha256")
    hasher.update(dataToHash);
    const hash = hasher.digest("hex");
    if(id !== hash) throw new BadRequestError('Block id is invalid!')
    return true
}

async function validateInOut(transactions: Array<Transaction>): Promise<boolean>{
    console.log('Validating inputs and outputs')
    let inputsValue : number = 0
    let outputsValue : number = 0
    await Promise.all(transactions.map(async (transaction: Transaction)=> {
        const inputDataList =  await Promise.all(transaction.inputs.map((input)=> getInputByTrxAndIndex(input)))
        outputsValue = transaction.outputs.reduce((acc: number, output)=> {
            acc += Number(output.value)
            return acc
        }, 0)
        inputsValue = inputDataList.reduce((acc: number, input)=> {
            if(!input) throw new BadRequestError('Input doesnt exist!')
            acc += Number(input.value)
            return acc
        }, 0)       
    }))
    if(inputsValue !== outputsValue) throw new BadRequestError('Input value is not equal output value!')
    return true
}