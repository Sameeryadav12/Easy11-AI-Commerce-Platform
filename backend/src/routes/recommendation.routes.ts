import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { cacheMiddleware } from '../middleware/cache.middleware';

const router = Router();

// Get personalized recommendations (cached for 5 minutes)
router.get('/:userId', authenticateToken, cacheMiddleware(300), async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    // Verify user owns this request
    if (userId !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // TODO: Implement ALS recommendations with FastAPI ML service
    const recommendations: any[] = [];

    res.json({
      recommendations,
      userId,
      limit
    });
  } catch (error) {
    next(error);
  }
});

export default router;

