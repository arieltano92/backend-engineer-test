import type { FastifyInstance } from 'fastify';
import { postBlock, rollbackBlockByHeight } from '../controllers/blocks';
import { PostBlockDto, RollbackBlockDto } from '../dtos/blocks';

export default async function blocksRoutes(fastify: FastifyInstance) {
  fastify.post<{Body: typeof PostBlockDto}> ('/blocks',{schema: {body:PostBlockDto}}, postBlock);
  fastify.post<{Querystring: typeof RollbackBlockDto}>('/rollback', {schema: {querystring: RollbackBlockDto}}, rollbackBlockByHeight);
}