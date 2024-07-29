import { Redis } from 'ioredis';

import { env } from '@/env';
import { logger } from '@/server/logger';

let cached = global.redis;

if (!cached) {
  global.redis = cached;
}

export const redis = (() => {
  if (cached) return cached;
  const instance = new Redis(env.REDIS_URL);

  // instance.on('connect', () => {
  //   logger.info('Redis database connected');
  // });

  instance.on('error', error => {
    logger.error(`There was an error with the redis client ${error}`);
  });

  cached = instance;
  return cached;
})();

if (process.env.NODE_ENV !== 'production') global.redis = redis;
