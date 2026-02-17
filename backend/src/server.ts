import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import { logger } from './utils/logger';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';

// Routes
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import searchRoutes from './routes/search.routes';
import recommendationRoutes from './routes/recommendation.routes';
import analyticsRoutes from './routes/analytics.routes';
import adminRoutes from './routes/admin.routes';
import mlopsRoutes from './routes/mlops.routes';
import exportRoutes from './routes/export.routes';
import telemetryRoutes from './routes/telemetry.routes';
import debugRoutes from './routes/debug.routes';
import supportRoutes from './routes/support.routes';
import rewardsRoutes from './routes/rewards.routes';

// Load environment variables
dotenv.config();

// Initialize Express
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Initialize Prisma
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error']
});

// Allowed CORS origins (comma-separated in FRONTEND_URL, or single value)
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
if (!allowedOrigins.length) allowedOrigins.push('http://localhost:3000');

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Health check
app.get('/health', async (req: Request, res: Response) => {
  const health: any = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'easy11-backend',
    version: '1.0.0',
    checks: {}
  };

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = 'connected';
  } catch (error: any) {
    health.status = 'degraded';
    health.checks.database = `error: ${error.message}`;
    logger.warn('Database health check failed:', error.message);
  }

  // Check Redis (optional)
  try {
    const { redis } = await import('./middleware/cache.middleware');
    if (redis) {
      await redis.ping();
      health.checks.redis = 'connected';
    } else {
      health.checks.redis = 'not configured';
    }
  } catch (error: any) {
    health.checks.redis = 'not available';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/mlops', mlopsRoutes);
app.use('/api/v1/export', exportRoutes);
app.use('/api/v1/telemetry', telemetryRoutes);
app.use('/api/v1/__debug', debugRoutes);
app.use('/api/v1/support', supportRoutes);
app.use('/api/v1/rewards', rewardsRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Easy11 Commerce Intelligence Platform API',
    version: '1.0.0',
    endpoints: {
      docs: '/docs',
      health: '/health',
      api: '/api/v1'
    }
  });
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 API: http://localhost:${PORT}/api/v1`);
});

export default app;

