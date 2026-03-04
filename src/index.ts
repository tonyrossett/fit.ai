import { z } from 'zod';
import 'dotenv/config';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import Fastify from 'fastify'; 
import { 
  jsonSchemaTransform,
  serializerCompiler, 
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

const app = Fastify({
  logger: true,
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Bootcamp Treinos API',
      description: 'API para o bootcamp de treinos do FSC',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:8081',
        description: 'Local server',
      },
    ],
  },
  transform: jsonSchemaTransform,

 
});

await app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
});
// Declare a route


app.withTypeProvider<ZodTypeProvider>().route({
  method: 'GET',
  url: '/',
  // Define your schema
  schema: {
   description: 'Hello World',
   tags: ['Hello World'],
    response: {
      200: z.object({
        message: z.string(),
        
      }),
    },
  },
  handler: () => {
    return {
      message: 'Hello World',
    };
  },
  
});

// Run the server!
try {
  await app.listen({ port: Number(process.env.PORT) || 8081 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

