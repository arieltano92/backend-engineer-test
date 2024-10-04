import type { FastifyInstance } from 'fastify';
import { getBalance } from '../controllers/balances';
import { GetBalanceDto } from '../dtos/balances'; 

export default async function blocksRoutes(fastify: FastifyInstance) {
  fastify.get<{Params: typeof GetBalanceDto}>('/balance/:address', {schema: {params: GetBalanceDto}} ,getBalance);
}