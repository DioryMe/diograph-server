import { Redis } from 'ioredis';

export const redisClientFactory = (): Redis => {
  const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  });

  redisClient.on('error', (e) => {
    throw new Error(`Redis client failed to connect: ${e}`);
  });

  return redisClient;
};
