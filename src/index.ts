import Fastify from 'fastify';
import blocksRoutes from './routes/blocks';
import balancesRoutes from './routes/balances';
import { createTables } from '../database';
import fastifyHttpErrorsEnhanced from 'fastify-http-errors-enhanced'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'


const fastify = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();
await fastify.register(fastifyHttpErrorsEnhanced)


fastify.get('/', async (_request, _reply) => {
  return { status: 'OK' };
});

fastify.register(blocksRoutes)
fastify.register(balancesRoutes)

async function bootstrap() {
  console.log('Bootstrapping...');
  await createTables();
}

try {
  await bootstrap();
  await fastify.listen({
    port: 3000,
    host: '0.0.0.0'
  })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
};

export default fastify;