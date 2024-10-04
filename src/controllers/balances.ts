import type { FastifyRequestType, FastifyReplyType } from "fastify/types/type-provider";
import type { GetBalanceAddressParam, AddressBalanceMap } from "../types";
import { getSingleBalance } from "../services/balances";

export async function getBalance(request: FastifyRequestType, _reply: FastifyReplyType) {
    const { address }  = request.params as GetBalanceAddressParam
    const balance : AddressBalanceMap =  await getSingleBalance(address)
    return balance
};