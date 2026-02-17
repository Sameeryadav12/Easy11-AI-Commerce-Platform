import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../server';
import { authenticateToken, type AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const router = Router();

const ROLLING_MONTHS = 12;
/** Silver 0–2,499 | Gold 2,500–9,999 | Platinum 10,000–24,999 | Diamond 25,000+ */
const TIER_THRESHOLDS = { Silver: 0, Gold: 2500, Platinum: 10000, Diamond: 25000 } as const;
type TierKey = keyof typeof TIER_THRESHOLDS;

function getTierFromPoints(points: number): TierKey {
  if (points >= TIER_THRESHOLDS.Diamond) return 'Diamond';
  if (points >= TIER_THRESHOLDS.Platinum) return 'Platinum';
  if (points >= TIER_THRESHOLDS.Gold) return 'Gold';
  return 'Silver';
}

function getRollingCutoff(): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - ROLLING_MONTHS);
  return d;
}

/** Compute available + pending earned in last 12 months for tier. */
async function getRollingEarnedPoints(userId: string): Promise<number> {
  const cutoff = getRollingCutoff();
  const entries = await prisma.pointsLedgerEntry.findMany({
    where: {
      userId,
      type: 'earned',
      createdAt: { gte: cutoff },
    },
  });
  return entries.reduce((sum, e) => sum + (e.points > 0 ? e.points : 0), 0);
}

/** Recompute tier from ledger and update user. */
async function updateUserTier(userId: string): Promise<TierKey> {
  const rolling = await getRollingEarnedPoints(userId);
  const tier = getTierFromPoints(rolling);
  await prisma.user.update({
    where: { id: userId },
    data: { loyaltyTier: tier },
  });
  return tier;
}

// --- Add Earned (pending) when order is paid
const addEarnedSchema = z.object({
  orderId: z.string(),
  points: z.number().int().min(1),
});
router.post('/ledger/earned', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { orderId, points } = addEarnedSchema.parse(req.body);
  const entry = await prisma.pointsLedgerEntry.create({
    data: {
      userId,
      orderId,
      type: 'earned',
      status: 'pending',
      points,
    },
  });
  await updateUserTier(userId);
  res.status(201).json(entry);
});

// --- Convert pending → available (delivery + return window ended)
const convertSchema = z.object({ orderId: z.string() });
router.patch('/ledger/convert', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { orderId } = convertSchema.parse(req.body);
  const updated = await prisma.pointsLedgerEntry.updateMany({
    where: { userId, orderId, type: 'earned', status: 'pending' },
    data: { status: 'available' },
  });
  if (updated.count > 0) await updateUserTier(userId);
  res.json({ converted: updated.count });
});

// --- Reverse (cancel or return)
const reverseSchema = z.object({
  orderId: z.string(),
  reason: z.enum(['cancelled', 'returned']),
});
router.post('/ledger/reverse', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { orderId, reason } = reverseSchema.parse(req.body);
  const entries = await prisma.pointsLedgerEntry.findMany({
    where: { userId, orderId, type: 'earned' },
  });
  const toReverse = entries.reduce((sum, e) => sum + e.points, 0);
  if (toReverse <= 0) {
    return res.json({ reversed: 0, message: 'No points to reverse' });
  }
  await prisma.pointsLedgerEntry.create({
    data: {
      userId,
      orderId,
      type: 'reversed',
      points: -toReverse,
      reason,
    },
  });
  await updateUserTier(userId);
  res.status(201).json({ reversed: toReverse });
});

// --- List ledger for user
router.get('/ledger', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const entries = await prisma.pointsLedgerEntry.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
  res.json(entries);
});

// --- Redeem: create Redeemed entry + coupon
const redeemSchema = z.object({ points: z.number().int().min(1) });
router.post('/redeem', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { points } = redeemSchema.parse(req.body);

  const cutoff = getRollingCutoff();
  const earned = await prisma.pointsLedgerEntry.findMany({
    where: { userId, type: 'earned', createdAt: { gte: cutoff } },
  });
  let available = 0;
  const sorted = earned.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  for (const e of sorted) {
    if (e.status === 'available') available += e.points;
  }
  const redeemedEntries = await prisma.pointsLedgerEntry.findMany({
    where: { userId, type: 'redeemed' },
  });
  const redeemedSum = redeemedEntries.reduce((sum, e) => sum + Math.abs(e.points), 0);
  available -= redeemedSum;
  if (available < points) {
    throw new AppError(`Insufficient points. Available: ${available}`, 400);
  }

  const code = `E11REWARD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  await prisma.$transaction([
    prisma.pointsLedgerEntry.create({
      data: { userId, type: 'redeemed', points: -points },
    }),
    prisma.rewardCoupon.create({
      data: { userId, code, pointsValue: points },
    }),
  ]);
  await updateUserTier(userId);
  res.status(201).json({ couponCode: code, points });
});

// --- Validate coupon at checkout
router.get('/coupon/:code', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const code = (req.params.code || '').trim().toUpperCase();
  const coupon = await prisma.rewardCoupon.findFirst({
    where: { code, userId, used: false, invalidatedAt: null },
  });
  if (!coupon) {
    throw new AppError('Invalid or expired coupon', 404);
  }
  res.json({ code: coupon.code, pointsValue: coupon.pointsValue });
});

// --- Mark coupon as used when order is placed
const useCouponSchema = z.object({ orderId: z.string() });
router.post('/coupon/:code/use', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const code = (req.params.code || '').trim().toUpperCase();
  const { orderId } = useCouponSchema.parse(req.body);
  const coupon = await prisma.rewardCoupon.findFirst({
    where: { code, userId, used: false, invalidatedAt: null },
  });
  if (!coupon) throw new AppError('Invalid or expired coupon', 404);
  await prisma.rewardCoupon.update({
    where: { id: coupon.id },
    data: { used: true, orderId },
  });
  res.json({ applied: true, orderId });
});

// --- Invalidate coupon (e.g. order cancelled) or return to balance
router.post('/coupon/:code/invalidate', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const code = (req.params.code || '').trim().toUpperCase();
  const coupon = await prisma.rewardCoupon.findFirst({
    where: { code, userId },
  });
  if (!coupon) throw new AppError('Coupon not found', 404);
  await prisma.rewardCoupon.update({
    where: { id: coupon.id },
    data: { invalidatedAt: new Date() },
  });
  if (coupon.used) {
    await prisma.pointsLedgerEntry.create({
      data: { userId, type: 'reversed', points: coupon.pointsValue, reason: 'coupon_invalidated' },
    });
    await updateUserTier(userId);
  }
  res.json({ invalidated: true });
});

// --- Referral: create when referee signs up with ref code (called from frontend after registration)
const createReferralSchema = z.object({ referrerId: z.string() });
router.post('/referral', authenticateToken, async (req: AuthRequest, res: Response) => {
  const refereeId = req.user!.id;
  const { referrerId } = createReferralSchema.parse(req.body);
  if (referrerId === refereeId) {
    throw new AppError('Cannot refer yourself', 400);
  }
  const referrer = await prisma.user.findUnique({ where: { id: referrerId } });
  if (!referrer) throw new AppError('Referrer not found', 404);
  const existing = await prisma.referral.findUnique({
    where: { referrerId_refereeId: { referrerId, refereeId } },
  });
  if (existing) return res.json(existing);
  const referral = await prisma.referral.create({
    data: { referrerId, refereeId, status: 'pending' },
  });
  res.status(201).json(referral);
});

// --- Referral: on first order delivered, award referrer points + referee voucher
router.post('/referral/on-order-delivered', authenticateToken, async (req: AuthRequest, res: Response) => {
  const refereeId = req.user!.id;
  const pending = await prisma.referral.findFirst({
    where: { refereeId, status: 'pending' },
  });
  if (!pending) return res.json({ awarded: false, message: 'No pending referral' });

  const INVITER_BONUS = 500;
  const REFEREE_VOUCHER_POINTS = 1000; // $10 voucher for referee

  await prisma.$transaction([
    prisma.pointsLedgerEntry.create({
      data: {
        userId: pending.referrerId,
        type: 'earned',
        status: 'available',
        points: INVITER_BONUS,
        reason: 'referral_first_purchase',
      },
    }),
    prisma.referral.update({
      where: { id: pending.id },
      data: { status: 'rewarded' },
    }),
  ]);

  const refCode = `E11REF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  await prisma.rewardCoupon.create({
    data: {
      userId: refereeId,
      code: refCode,
      pointsValue: REFEREE_VOUCHER_POINTS,
    },
  });

  await updateUserTier(pending.referrerId);
  res.json({
    awarded: true,
    referrerBonus: INVITER_BONUS,
    refereeVoucherCode: refCode,
    refereeVoucherValue: REFEREE_VOUCHER_POINTS / 100,
  });
});

// --- Experience summary (available, pending, tier, transactions)
router.get('/experience', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { loyaltyTier: true } });
  const entries = await prisma.pointsLedgerEntry.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    take: 500,
  });
  const cutoff = getRollingCutoff();
  let pendingPoints = 0;
  let availablePoints = 0;
  for (const e of entries) {
    if (e.type === 'earned') {
      if (e.status === 'pending') pendingPoints += e.points;
      else availablePoints += e.points;
    } else if (e.type === 'reversed') {
      availablePoints += e.points;
    } else if (e.type === 'redeemed') {
      availablePoints += e.points;
    }
  }
  const rolling = await getRollingEarnedPoints(userId);
  const tier = user?.loyaltyTier as TierKey | null || getTierFromPoints(rolling);
  const tierOrder: TierKey[] = ['Silver', 'Gold', 'Platinum', 'Diamond'];
  const currentTier = (tier || 'Silver') as TierKey;
  const nextTier = tierOrder[tierOrder.indexOf(currentTier) + 1];
  const pointsToNext = nextTier ? Math.max(0, TIER_THRESHOLDS[nextTier] - rolling) : 0;

  res.json({
    summary: {
      availablePoints,
      pendingPoints,
      estimatedValue: availablePoints / 100,
    },
    tier: {
      tier: currentTier,
      pointsToNext,
    },
    transactions: entries.slice(0, 50).map((e) => ({
      id: e.id,
      date: e.createdAt,
      type: e.type,
      status: e.status,
      points: e.points,
      orderId: e.orderId,
      reason: e.reason,
    })),
  });
});

export default router;
