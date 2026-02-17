import { Router } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../server';
import { generateTokens } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting
const isDev = (process.env.NODE_ENV || 'development') === 'development';

const authLimiter = rateLimit({
  windowMs: isDev ? 60 * 1000 : 15 * 60 * 1000, // dev: 1 minute, prod: 15 minutes
  max: isDev ? 50 : 5, // dev: allow testing, prod: strict
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts, please try again later'
});

const createAccountLimiter = rateLimit({
  windowMs: isDev ? 10 * 60 * 1000 : 60 * 60 * 1000, // dev: 10 minutes, prod: 1 hour
  max: isDev ? 20 : 3, // dev: allow testing, prod: strict
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many accounts created, please try again later'
});

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  termsAcceptedAt: z.string().datetime().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Register
router.post('/register', createAccountLimiter, async (req, res, next) => {
  try {
    // Validate input
    const { email, password, name, termsAcceptedAt } = registerSchema.parse(req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        ...(termsAcceptedAt && { termsAcceptedAt: new Date(termsAcceptedAt) }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email);

    res.status(201).json({
      user,
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    // Validate input
    const { email, password } = loginSchema.parse(req.body);

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email }
      });
    } catch (dbError: any) {
      // Prisma/DB unavailable (e.g. P1001 connection, P2021 table missing)
      const code = dbError?.code || '';
      const isDbError = typeof code === 'string' && (code.startsWith('P1') || code.startsWith('P2'));
      if (isDbError) {
        return res.status(503).json({
          error: {
            statusCode: 503,
            message: 'Service temporarily unavailable. Use demo login to explore the app.',
            code: 'SERVICE_UNAVAILABLE'
          }
        });
      }
      throw dbError;
    }

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email);

    try {
      await prisma.session.create({
        data: {
          userId: user.id,
          token: refreshToken,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      });
    } catch (sessionErr: any) {
      // Session create failed (e.g. DB) - still allow login, just skip persisting session
      // Log but don't fail the request
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return res.status(400).json({
        error: { statusCode: 400, message: 'Invalid email or password format' }
      });
    }
    next(error);
  }
});

// Get current user
router.get('/me', authenticateToken, async (req: any, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

export default router;

