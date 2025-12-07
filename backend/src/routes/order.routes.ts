import { Router } from 'express';
import { prisma } from '../server';
import { AppError } from '../middleware/error.middleware';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

const router = Router();

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive()
  })),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string()
  })
});

// Get user orders
router.get('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where: any = { userId: req.user!.id };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      orders,
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

// Get order by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.json({ order });
  } catch (error) {
    next(error);
  }
});

// Create order
router.post('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { items, shippingAddress } = createOrderSchema.parse(req.body);
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
        total,
        shippingAddress: shippingAddress as any,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
});

export default router;

