import { Router } from 'express';
import { prisma } from '../server';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for search
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  message: 'Too many search queries, please try again later'
});

// Search products (Trie-based implementation pending)
router.get('/', searchLimiter, async (req, res, next) => {
  try {
    const query = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!query) {
      return res.json({ products: [], total: 0 });
    }

    // TODO: Implement Trie-based search with C++ module
    // For now, use basic PostgreSQL search
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } }
        ]
      },
      take: limit
    });

    res.json({
      products,
      total: products.length,
      query
    });
  } catch (error) {
    next(error);
  }
});

export default router;

