export type Address = string
export type Height = number

export interface Output {
    address: Address;
    value: number;
}

export interface Input {
    txId: string;
    index: number;
}

export interface Transaction {
    id: string;
    inputs: Array<Input>;
    outputs: Array<Output>;
}

export interface Block {
    id: string;
    height: Height;
    transactions: Array<Transaction>;
}

export interface AddressBalance {
    address: Address;
    balance: number;
}

interface BalanceObject {
    balance: number;
}
  
export interface AddressBalanceMap {
    [address: Address]: BalanceObject;
};

export interface TransactionEntity {
    id: string;
    inputs: Array<Input>;
    outputs: Array<Output>;
    height: number;
}

export interface GetBalanceAddressParam {
    address: Address;
}

export interface HeightQueryParam {
    height: Height;
}

export interface AddressWithBalance {
    address: Address;
    value: number;
}

export type AddressWithBalanceRows = Array<AddressWithBalance>