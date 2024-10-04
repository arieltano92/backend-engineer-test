import type { Transaction, Address, AddressBalanceMap, TransactionEntity, Input } from "../types"
import { getAddressFromInput } from "../repository/transactions"
import { getBalances, generateNewBalances } from "./balances"
import { postTransactionWithBalances, deleteTransactionWithBalances, getTransactionsAfterHeight, getLast, getInputData } from "../repository/transactions"
import { POST_OPERATION } from "../utils/constants"

// processTransaction is used for post and rollback transactions depends on operation value
export async function processTransaction({trx , height}:{ trx: Transaction; height: number }, operation : string = POST_OPERATION){
    console.log(`Processing trx id ${trx.id}`)
    const transaction : TransactionEntity = {...trx, height}
    const inputAddresses : Array<Address> = await Promise.all(trx.inputs.map(input => getAddressFromInput(input)))
    const outputAddresses: Array<Address> = trx.outputs.map(output => output.address)
    const balances: AddressBalanceMap = await getBalances([...inputAddresses, ...outputAddresses])
    const generatedNewBalances : AddressBalanceMap = generateNewBalances(balances,inputAddresses,trx.outputs, operation)
    await applyOperation(transaction,operation,generatedNewBalances)
}

// Operation applied can be POST or ROLLBACK
async function applyOperation(trx: TransactionEntity, operation: string , generatedNewBalances: AddressBalanceMap): Promise<void>{
    return operation === POST_OPERATION ? 
        postTransactionWithBalances(trx, generatedNewBalances) : 
        deleteTransactionWithBalances(trx, generatedNewBalances)
}

export async function getTransactionsForRollback(height: number){
    return getTransactionsAfterHeight(height)
}

export async function getLastTransaction(){
    return getLast()
}

export async function getInputByTrxAndIndex(input: Input){
    return getInputData(input)
}