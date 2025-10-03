import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { RedisIoAdapter } from './redis-io.adapter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS for REST and WS (origin from env, defaults to *)
  const origins = process.env.CORS_ORIGIN?.split(',').map(s => s.trim()) ?? ['*'];
  app.enableCors({
    origin: origins,
    credentials: true,
  });

  // Redis adapter to scale Socket.IO across PM2 cluster
  const redisAdapter = new RedisIoAdapter(app);
  await redisAdapter.connectToRedis();
  app.useWebSocketAdapter(redisAdapter);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`[api] listening on http://localhost:${port}`);
}
bootstrap();
