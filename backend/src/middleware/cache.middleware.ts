import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { logger } from '../utils/logger';

// Create Redis client with connection error handling
let redis: Redis | null = null;

try {
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    retryStrategy: (times) => {
      // Don't retry, just log and continue without cache
      if (times > 1) {
        logger.warn('Redis connection failed, continuing without cache');
        return null; // Stop retrying
      }
      return Math.min(times * 50, 2000);
    },
    maxRetriesPerRequest: 1,
    lazyConnect: true,
  });

  redis.on('error', (err) => {
    logger.warn('Redis connection error (continuing without cache):', err.message);
    redis = null; // Disable cache on error
  });

  redis.on('connect', () => {
    logger.info('✅ Connected to Redis');
  });

  // Try to connect, but don't fail if it doesn't work
  redis.connect().catch(() => {
    logger.warn('Redis not available, continuing without cache');
    redis = null;
  });
} catch (error) {
  logger.warn('Redis initialization failed, continuing without cache:', error);
  redis = null;
}

/**
 * Cache middleware for GET requests
 * Caches responses in Redis with configurable TTL
 */
export const cacheMiddleware = (ttlSeconds: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // If Redis is not available, skip caching
    if (!redis) {
      return next();
    }

    const cacheKey = `cache:${req.originalUrl}`;

    try {
      // Check cache
      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
        logger.info('Cache hit', { key: cacheKey });
        
        // Add cache header
        res.setHeader('X-Cache', 'HIT');
        
        return res.json(JSON.parse(cachedData));
      }

      logger.info('Cache miss', { key: cacheKey });
      res.setHeader('X-Cache', 'MISS');

      // Capture original res.json
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = function (body: any) {
        // Cache the response if Redis is available
        if (redis) {
          redis.setex(cacheKey, ttlSeconds, JSON.stringify(body)).catch((err) => {
            logger.error('Failed to cache response', { error: err.message });
          });
        }

        // Call original json method
        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error', { error });
      // Continue without cache on error
      next();
    }
  };
};

/**
 * Clear cache by pattern
 */
export const clearCache = async (pattern: string): Promise<number> => {
  if (!redis) {
    return 0;
  }
  
  try {
    const keys = await redis.keys(pattern);
    
    if (keys.length === 0) {
      return 0;
    }

    const result = await redis.del(...keys);
    logger.info('Cache cleared', { pattern, count: result });
    
    return result;
  } catch (error) {
    logger.error('Failed to clear cache', { error });
    return 0;
  }
};

/**
 * Cache statistics
 */
export const getCacheStats = async () => {
  if (!redis) {
    return null;
  }
  
  try {
    const info = await redis.info('stats');
    const lines = info.split('\r\n');
    
    const stats: any = {};
    lines.forEach((line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        stats[key] = value;
      }
    });

    return {
      totalKeys: await redis.dbsize(),
      hitRate: stats.keyspace_hits && stats.keyspace_misses
        ? parseFloat(stats.keyspace_hits) / (parseFloat(stats.keyspace_hits) + parseFloat(stats.keyspace_misses))
        : 0,
      memory: stats.used_memory_human,
    };
  } catch (error) {
    logger.error('Failed to get cache stats', { error });
    return null;
  }
};

export { redis };

