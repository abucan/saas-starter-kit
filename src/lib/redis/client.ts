import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

const redis =
  globalForRedis.redis ??
  new Redis({
    host: process.env.REDISHOST || 'localhost',
    port: parseInt(process.env.REDISPORT || '6379'),
    password: process.env.REDISPASSWORD,
    db: 0,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    enableOfflineQueue: false,
    maxRetriesPerRequest: 3,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Redis connected successfully');
});

const shutdown = async () => {
  await redis.quit();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export { redis };
