import { Router } from 'express';
import { prisma } from '../server';
import { AppError } from '../middleware/error.middleware';
import { authenticateToken, authorize, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// All admin routes require ADMIN, ANALYST, or MANAGER roles
const adminAuth = [authenticateToken, authorize('ADMIN', 'ANALYST', 'MANAGER')];

/**
 * GET /admin/metrics
 * Get aggregated metrics with date range filtering
 */
router.get('/metrics', ...adminAuth, async (req: AuthRequest, res, next) => {
  try {
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: last 30 days

    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : new Date();

    // Get orders in date range
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          in: ['DELIVERED', 'SHIPPED', 'PROCESSING'],
        },
      },
      include: {
        items: true,
      },
    });

    // Calculate metrics
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = orders.length;
    const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0;

    // Get unique customers
    const uniqueCustomers = new Set(orders.map((order) => order.userId)).size;

    // Get total items sold
    const itemsSold = orders.reduce(
      (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    );

    // Calculate previous period for comparison
    const periodDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const prevStartDate = new Date(startDate.getTime() - periodDays * 24 * 60 * 60 * 1000);
    const prevEndDate = new Date(startDate);

    const prevOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: prevStartDate,
          lt: prevEndDate,
        },
        status: {
          in: ['DELIVERED', 'SHIPPED', 'PROCESSING'],
        },
      },
    });

    const prevRevenue = prevOrders.reduce((sum, order) => sum + order.total, 0);
    const revenueChange = prevRevenue > 0 ? (revenue - prevRevenue) / prevRevenue : 0;

    // Get customer count (total active)
    const totalCustomers = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
      },
    });

    // Get products count
    const totalProducts = await prisma.product.count();

    // Calculate conversion rate (orders / unique visitors - simplified)
    const conversionRate = uniqueCustomers > 0 ? orderCount / uniqueCustomers : 0;

    res.json({
      period: {
        start: startDate,
        end: endDate,
        days: periodDays,
      },
      metrics: {
        revenue: {
          value: revenue,
          change: revenueChange,
          previousValue: prevRevenue,
        },
        orders: {
          value: orderCount,
          change: prevOrders.length > 0 ? (orderCount - prevOrders.length) / prevOrders.length : 0,
          previousValue: prevOrders.length,
        },
        averageOrderValue: {
          value: avgOrderValue,
          change: 0, // Calculated in future iteration
        },
        customers: {
          unique: uniqueCustomers,
          total: totalCustomers,
        },
        itemsSold: {
          value: itemsSold,
        },
        products: {
          total: totalProducts,
        },
        conversionRate: {
          value: conversionRate,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /admin/revenue-trend
 * Get daily/monthly revenue trends
 */
router.get('/revenue-trend', ...adminAuth, async (req: AuthRequest, res, next) => {
  try {
    const groupBy = (req.query.groupBy as string) || 'day'; // day, week, month
    const days = parseInt(req.query.days as string) || 30;

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: {
          in: ['DELIVERED', 'SHIPPED', 'PROCESSING'],
        },
      },
      select: {
        createdAt: true,
        total: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group by date
    const grouped = new Map<string, { revenue: number; orders: number }>();

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      let key: string;

      if (groupBy === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else if (groupBy === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = date.toISOString().split('T')[0];
      }

      if (!grouped.has(key)) {
        grouped.set(key, { revenue: 0, orders: 0 });
      }

      const current = grouped.get(key)!;
      current.revenue += order.total;
      current.orders += 1;
    });

    const trend = Array.from(grouped.entries()).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders,
      avgOrderValue: data.orders > 0 ? data.revenue / data.orders : 0,
    }));

    res.json({
      groupBy,
      days,
      trend,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /admin/top-products
 * Get top-selling products
 */
router.get('/top-products', ...adminAuth, async (req: AuthRequest, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const days = parseInt(req.query.days as string) || 30;

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get order items from recent orders
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: {
            gte: startDate,
          },
          status: {
            in: ['DELIVERED', 'SHIPPED', 'PROCESSING'],
          },
        },
      },
      include: {
        product: true,
      },
    });

    // Aggregate by product
    const productSales = new Map<string, { quantity: number; revenue: number; product: any }>();

    orderItems.forEach((item) => {
      if (!productSales.has(item.productId)) {
        productSales.set(item.productId, {
          quantity: 0,
          revenue: 0,
          product: item.product,
        });
      }

      const current = productSales.get(item.productId)!;
      current.quantity += item.quantity;
      current.revenue += item.price * item.quantity;
    });

    // Sort by revenue and take top N
    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit)
      .map((item) => ({
        product: item.product,
        quantitySold: item.quantity,
        revenue: item.revenue,
      }));

    res.json({
      topProducts,
      period: {
        days,
        startDate,
        endDate: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

