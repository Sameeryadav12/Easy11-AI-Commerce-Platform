import { Router } from 'express';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { prisma } from '../server';
import { authenticateToken, type AuthRequest } from '../middleware/auth.middleware';

const router = Router();

const createTicketSchema = z.object({
  category: z.enum(['orders', 'returns', 'payments', 'account', 'technical', 'other']),
  subject: z.string().min(3).max(120),
  message: z.string().min(10).max(5000),
  orderNumber: z.string().max(64).optional().nullable(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional().default('normal'),
});

function getTicketLogPath() {
  const projectRoot = path.resolve(__dirname, '..', '..', '..');
  return path.join(projectRoot, '.cursor', 'support_tickets.log');
}

function ensureCursorDirExists() {
  const ticketLogPath = getTicketLogPath();
  const dir = path.dirname(ticketLogPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/** Optional dev log (DB is source of truth). */
function logToFileIfDev(record: object) {
  if (process.env.NODE_ENV === 'development') {
    try {
      ensureCursorDirExists();
      fs.appendFileSync(getTicketLogPath(), `${JSON.stringify(record)}\n`, { encoding: 'utf8' });
    } catch {
      // ignore
    }
  }
}

// List tickets for the authenticated user
router.get('/tickets', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const tickets = await prisma.supportTicket.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({
      tickets: tickets.map((t) => ({
        id: t.ticketId,
        ticketId: t.ticketId,
        category: t.category,
        subject: t.subject,
        message: t.message,
        orderNumber: t.orderNumber,
        priority: t.priority,
        status: t.status,
        createdAt: t.createdAt,
      })),
    });
  } catch (err) {
    return next(err);
  }
});

// Create ticket (stored in DB; optional file log in dev)
router.post('/tickets', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const payload = createTicketSchema.parse(req.body);
    const ticketId = `SUP-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: user.id,
        ticketId,
        category: payload.category,
        subject: payload.subject,
        message: payload.message,
        orderNumber: payload.orderNumber ?? null,
        priority: payload.priority,
        status: 'Open',
      },
    });

    logToFileIfDev({
      ticketId,
      createdAt: ticket.createdAt.toISOString(),
      user: { id: user.id, email: user.email, role: user.role },
      ...payload,
    });

    return res.status(201).json({ ticketId });
  } catch (err) {
    return next(err);
  }
});

export default router;
