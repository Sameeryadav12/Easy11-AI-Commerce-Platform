import { Router } from 'express';
import { prisma } from '../server';
import { AppError } from '../middleware/error.middleware';
import { authenticateToken, authorize, AuthRequest } from '../middleware/auth.middleware';
import { redis } from '../middleware/cache.middleware';

const router = Router();

// ML Ops routes require ADMIN only
const mlOpsAuth = [authenticateToken, authorize('ADMIN')];

/**
 * POST /mlops/models/promote
 * Promote a candidate model to production
 */
router.post('/models/promote', ...mlOpsAuth, async (req: AuthRequest, res, next) => {
  try {
    const { modelName, version, metrics } = req.body;

    if (!modelName || !version) {
      throw new AppError('Model name and version required', 400);
    }

    // Audit log the promotion
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'PROMOTE_MODEL',
        resource: 'ML_MODEL',
        resourceId: `${modelName}:${version}`,
        metadata: {
          modelName,
          version,
          metrics,
          timestamp: new Date().toISOString(),
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    // Clear recommendation cache to force refresh
    const keysCleared = redis ? await redis.del('cache:/api/v1/recommendations/*') : 0;

    // In production, this would call MLflow API to update model alias
    // const mlflowResponse = await fetch(`${ML_SERVICE}/mlflow/models/promote`, { ... });

    res.json({
      success: true,
      message: `Model ${modelName}:${version} promoted to production`,
      keysCleared,
      effectiveIn: '< 60 seconds',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /mlops/models/rollback
 * Rollback to previous model version
 */
router.post('/models/rollback', ...mlOpsAuth, async (req: AuthRequest, res, next) => {
  try {
    const { modelName, version, reason } = req.body;

    if (!modelName || !version) {
      throw new AppError('Model name and version required', 400);
    }

    if (!reason) {
      throw new AppError('Rollback reason required', 400);
    }

    // Audit log the rollback
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'ROLLBACK_MODEL',
        resource: 'ML_MODEL',
        resourceId: `${modelName}:${version}`,
        metadata: {
          modelName,
          version,
          reason,
          timestamp: new Date().toISOString(),
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    // Clear cache
    if (redis) {
      await redis.del('cache:/api/v1/recommendations/*');
    }

    res.json({
      success: true,
      message: `Rolled back to ${modelName}:${version}`,
      reason,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /mlops/models/status
 * Get current model status and metrics
 */
router.get('/models/status', ...mlOpsAuth, async (req: AuthRequest, res, next) => {
  try {
    // In production, fetch from MLflow
    const models = [
      {
        name: 'als_recommendations',
        productionVersion: 'v2.1.0',
        candidateVersion: 'v2.2.0',
        metrics: {
          production: {
            hitRate10: 0.24,
            precision5: 0.45,
            latencyP95: 135,
            cacheHitRate: 0.72,
          },
          candidate: {
            hitRate10: 0.26,
            precision5: 0.48,
            latencyP95: 128,
            cacheHitRate: 0.75,
          },
        },
        lastTrained: '2024-11-30T03:00:00Z',
      },
      {
        name: 'xgboost_churn',
        productionVersion: 'v1.5.0',
        candidateVersion: null,
        metrics: {
          production: {
            auc: 0.83,
            precision: 0.75,
            recall: 0.72,
            f1Score: 0.735,
          },
        },
        lastTrained: '2024-11-30T03:15:00Z',
      },
      {
        name: 'prophet_forecast',
        productionVersion: 'v2.0.0',
        candidateVersion: null,
        metrics: {
          production: {
            smape: 12.5,
            rmse: 150.3,
            mape: 14.2,
          },
        },
        lastTrained: '2024-11-30T03:30:00Z',
      },
    ];

    res.json({ models });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /mlops/cache/stats
 * Get cache statistics
 */
router.get('/cache/stats', ...mlOpsAuth, async (req: AuthRequest, res, next) => {
  try {
    if (!redis) {
      return res.json({
        totalKeys: 0,
        hits: 0,
        misses: 0,
        hitRate: 0,
        memory: 'N/A',
        message: 'Redis not available'
      });
    }

    const info = await redis.info('stats');
    const dbsize = await redis.dbsize();

    // Parse Redis info
    const stats: any = {};
    info.split('\r\n').forEach((line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        stats[key] = value;
      }
    });

    const hits = parseInt(stats.keyspace_hits || '0');
    const misses = parseInt(stats.keyspace_misses || '0');
    const hitRate = hits + misses > 0 ? hits / (hits + misses) : 0;

    res.json({
      totalKeys: dbsize,
      hits,
      misses,
      hitRate,
      memory: stats.used_memory_human,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

