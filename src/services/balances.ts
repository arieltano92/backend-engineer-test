import type { Address, AddressBalance, AddressBalanceMap, Output } from "../types";
import { getBalancesByAddress } from "../repository/balances";
import { POST_OPERATION } from "../utils/constants";
import { NotFoundError } from 'http-errors-enhanced'

export async function getBalances(addresses: Array<Address>) : Promise<AddressBalanceMap>{
    console.log('Getting balances from addresses', addresses);
    const balancesList : Array<AddressBalance> = await getBalancesByAddress(addresses)
    // Transformed into an object with keys as addresses to avoid loops to update the balances
    const balancesObject: AddressBalanceMap = balancesList.reduce((acc, item)=> {
        acc[item.address] = {
            balance : Number(item.balance)
        }
        return acc
    }, {} as AddressBalanceMap)
    // Complete new addresses with balance 0
    addresses.forEach(address => {
        if(!balancesObject[address]) balancesObject[address] = { balance: 0 }  
    })
    return balancesObject
}

export function generateNewBalances(addressBalances: AddressBalanceMap, [input]: Array<Address>, outputs: Array<Output>, operation : string = POST_OPERATION ): AddressBalanceMap{
    outputs.forEach(output => {
        if(operation === POST_OPERATION){
            addressBalances[output.address].balance += output.value
            if(addressBalances[input]) addressBalances[input].balance -= output.value
        }else{
            // Case in wich operaiton is ROLLBACK
            addressBalances[output.address].balance -= output.value
            if(addressBalances[input]) addressBalances[input].balance += output.value
        }
    })
    return addressBalances
}

export async function getSingleBalance(address: Address): Promise<AddressBalanceMap>{
    const [balanceData] = await getBalancesByAddress([address])
    if(!balanceData) throw new NotFoundError('Address not found')
    return {
        [balanceData.address] : {
            balance: Number(balanceData.balance)
        }
    }
}