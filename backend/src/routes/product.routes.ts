import { Router } from 'express';
import { prisma } from '../server';
import { AppError } from '../middleware/error.middleware';
import { authenticateToken, authorize } from '../middleware/auth.middleware';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  price: z.number().positive(),
  category: z.string(),
  image: z.string().url().optional(),
  stock: z.number().int().nonnegative(),
  tags: z.array(z.string()).max(10).optional()
});

// Get all products
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const category = req.query.category as string;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;

    const where: any = {};
    if (category) where.category = category;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get product by ID
router.get('/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
});

// Create product (Admin only)
router.post('/', authenticateToken, authorize('ADMIN', 'MANAGER'), async (req, res, next) => {
  try {
    const data = createProductSchema.parse(req.body);
    
    const product = await prisma.product.create({
      data
    });

    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
});

export default router;

