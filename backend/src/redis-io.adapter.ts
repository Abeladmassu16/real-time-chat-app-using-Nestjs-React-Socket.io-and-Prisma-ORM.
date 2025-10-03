import { IoAdapter } from '@nestjs/platform-socket.io';
import type { INestApplicationContext } from '@nestjs/common';
import { createAdapter } from '@socket.io/redis-adapter';
import type { ServerOptions } from 'socket.io';
import { createClient, type RedisClientType } from 'redis';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter> | null = null;
  private pubClient!: RedisClientType;
  private subClient!: RedisClientType;

  constructor(app: INestApplicationContext) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const host = process.env.REDIS_HOST ?? 'localhost';
    const port = process.env.REDIS_PORT ?? '6379';
    const url = `redis://${host}:${port}`;

    this.pubClient = createClient({ url });
    this.subClient = this.pubClient.duplicate();

    this.pubClient.on('error', (err) => console.error('[redis] pub error', err));
    this.subClient.on('error', (err) => console.error('[redis] sub error', err));

    await Promise.all([this.pubClient.connect(), this.subClient.connect()]);
    this.adapterConstructor = createAdapter(this.pubClient, this.subClient);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: process.env.CORS_ORIGIN?.split(',').map(s => s.trim()) ?? ['*'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    if (this.adapterConstructor) {
      // @ts-ignore - adapter() exists at runtime
      server.adapter(this.adapterConstructor);
    }
    return server;
  }
}
