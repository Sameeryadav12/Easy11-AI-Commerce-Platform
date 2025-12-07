import { Router } from 'express';
import { prisma } from '../server';
import { authenticateToken, authorize, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Get revenue analytics (Admin only)
router.get('/revenue', authenticateToken, authorize('ADMIN', 'MANAGER', 'ANALYST'), async (req: AuthRequest, res, next) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

    // Calculate revenue metrics
    const orders = await prisma.order.findMany({
      where: {
        status: { in: ['DELIVERED', 'SHIPPED', 'PROCESSING'] },
        createdAt: { gte: startDate, lte: endDate }
      }
    });

    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = orders.length;
    const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0;

    const customers = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate }
      },
      select: {
        userId: true
      },
      distinct: ['userId']
    });

    const uniqueCustomers = customers.length;

    res.json({
      revenue,
      orders: orderCount,
      customers: uniqueCustomers,
      averageOrderValue: avgOrderValue,
      period: {
        start: startDate,
        end: endDate
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get churn predictions (Admin only)
router.get('/churn', authenticateToken, authorize('ADMIN', 'MANAGER', 'ANALYST'), async (req, res, next) => {
  try {
    // TODO: Implement XGBoost churn predictions via FastAPI ML service
    res.json({
      atRisk: [],
      lowRisk: [],
      message: 'Churn predictions pending ML service integration'
    });
  } catch (error) {
    next(error);
  }
});

// Get demand forecast (Admin only)
router.get('/forecast', authenticateToken, authorize('ADMIN', 'MANAGER', 'ANALYST'), async (req, res, next) => {
  try {
    const horizon = parseInt(req.query.horizon as string) || 30;

    // TODO: Implement Prophet/XGBoost forecasting via FastAPI ML service
    res.json({
      forecast: [],
      horizon,
      message: 'Forecast pending ML service integration'
    });
  } catch (error) {
    next(error);
  }
});

export default router;

