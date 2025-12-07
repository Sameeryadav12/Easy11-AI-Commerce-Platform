import { Router } from 'express';
import { prisma } from '../server';
import { AppError } from '../middleware/error.middleware';
import { authenticateToken, authorize, AuthRequest } from '../middleware/auth.middleware';
import { exportToCSV, exportToJSON, hashEmail, validateExportSize } from '../utils/export';

const router = Router();

/**
 * POST /export/churn-customers
 * Export high-risk customers with churn reasons
 */
router.post(
  '/churn-customers',
  authenticateToken,
  authorize('ADMIN', 'ANALYST'),
  async (req: AuthRequest, res, next) => {
    try {
      const { threshold = 0.65, limit = 1000, format = 'csv' } = req.body;

      // Fetch high-risk customers
      // In production, this would call ML service for churn predictions
      const customers = await prisma.user.findMany({
        where: {
          role: 'CUSTOMER',
        },
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          orders: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true },
          },
        },
      });

      // Transform data for export
      const exportData = customers.map((customer) => ({
        customerId: customer.id,
        name: customer.name,
        email: hashEmail(customer.email), // PII protection
        registeredDate: customer.createdAt.toISOString().split('T')[0],
        lastOrderDate: customer.orders[0]?.createdAt?.toISOString().split('T')[0] || 'Never',
        churnProbability: 0.72, // Mock - from ML service
        churnRisk: 'High',
        topReason1: 'Long time since purchase',
        topReason2: 'Decreasing order frequency',
        topReason3: 'Support tickets',
      }));

      validateExportSize(exportData.length);

      // Audit log
      await prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: 'EXPORT',
          resource: 'CHURN_CUSTOMERS',
          metadata: {
            recordCount: exportData.length,
            threshold,
            format,
          },
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        },
      });

      // Export based on format
      if (format === 'csv') {
        exportToCSV(
          {
            filename: 'churn_high_risk_customers',
            exportedBy: req.user!.email,
            data: exportData,
            format: 'csv',
          },
          res
        );
      } else {
        exportToJSON(
          {
            filename: 'churn_high_risk_customers',
            exportedBy: req.user!.email,
            data: exportData,
            format: 'json',
          },
          res
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /export/forecast-data
 * Export forecast predictions
 */
router.post(
  '/forecast-data',
  authenticateToken,
  authorize('ADMIN', 'ANALYST'),
  async (req: AuthRequest, res, next) => {
    try {
      const { category, horizon = 30, format = 'csv' } = req.body;

      // Mock forecast data
      const exportData = [];
      const startDate = new Date();
      
      for (let i = 0; i < horizon; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        exportData.push({
          date: date.toISOString().split('T')[0],
          category: category || 'All',
          forecastValue: 1000 + i * 50,
          lowerBound: 900 + i * 45,
          upperBound: 1100 + i * 55,
          confidence: 0.95,
        });
      }

      validateExportSize(exportData.length);

      // Audit log
      await prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: 'EXPORT',
          resource: 'FORECAST_DATA',
          metadata: {
            category,
            horizon,
            recordCount: exportData.length,
            format,
          },
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        },
      });

      if (format === 'csv') {
        exportToCSV(
          {
            filename: `forecast_${category || 'all'}_${horizon}days`,
            exportedBy: req.user!.email,
            data: exportData,
            format: 'csv',
          },
          res
        );
      } else {
        exportToJSON(
          {
            filename: `forecast_${category || 'all'}_${horizon}days`,
            exportedBy: req.user!.email,
            data: exportData,
            format: 'json',
          },
          res
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;

