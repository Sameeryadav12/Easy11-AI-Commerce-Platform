import api from './api';
import type { RewardsExperience } from '../types/rewards';

const fallbackTemplate: RewardsExperience = {
  summary: {
    availablePoints: 0,
    walletBalance: 0,
    estimatedValue: 0,
    pendingPoints: 0,
    expiringPoints: 0,
    expiringOn: null,
  },
  tier: {
    tier: 'Silver',
    tierProgress: 0,
    pointsToNext: 2500,
    aiTip: 'Welcome! Place an order to start earning points. 1 pt = $1. Reach Gold at 2,500 pts.',
    streakMultiplier: 1,
  },
  transactions: [],
  referrals: {
    link: 'https://easy11.com/ref/EASY11-NEW',
    stats: {
      invitesSent: 0,
      signups: 0,
      conversions: 0,
      totalRewards: 0,
      pendingRewards: 0,
      lastUpdated: new Date().toISOString(),
    },
    invites: [],
  },
  challenges: {
    streak: {
      current: 0,
      best: 0,
      multiplier: 1,
      endsAt: null,
    },
    daily: [],
    weekly: [],
    seasonal: [],
  },
  badges: [],
  lastSynced: new Date().toISOString(),
};

const cloneExperience = (experience: RewardsExperience): RewardsExperience => ({
  summary: { ...experience.summary },
  tier: { ...experience.tier },
  transactions: experience.transactions.map((txn) => ({ ...txn })),
  referrals: {
    link: experience.referrals.link,
    stats: { ...experience.referrals.stats },
    invites: experience.referrals.invites.map((invite) => ({ ...invite })),
  },
  challenges: {
    streak: { ...experience.challenges.streak },
    daily: experience.challenges.daily.map((challenge) => ({ ...challenge, progress: { ...challenge.progress } })),
    weekly: experience.challenges.weekly.map((challenge) => ({ ...challenge, progress: { ...challenge.progress } })),
    seasonal: experience.challenges.seasonal.map((challenge) => ({ ...challenge, progress: { ...challenge.progress } })),
  },
  badges: experience.badges.map((badge) => ({ ...badge })),
  lastSynced: new Date().toISOString(),
});

export const createRewardsFallbackExperience = (): RewardsExperience => cloneExperience(fallbackTemplate);

export const fetchRewardsExperience = async (): Promise<RewardsExperience> => {
  try {
    const response = await api.get<RewardsExperience>('/rewards/experience');
    return response.data;
  } catch (error) {
    console.warn('[RewardsAPI] Falling back to local experience seed.', error);
    return createRewardsFallbackExperience();
  }
};

export const rotateReferralLink = async (): Promise<string> => {
  try {
    const response = await api.post<{ link: string }>('/rewards/referrals/regenerate');
    return response.data.link;
  } catch (error) {
    console.warn('[RewardsAPI] Using fallback referral link generator.', error);
    const randomSegment = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `https://easy11.com/ref/EASY11-${randomSegment}`;
  }
};

/** Validate reward coupon (e.g. E11REWARD-xxx). Returns pointsValue for display; apply pointsValue/100 as dollar discount. */
export const validateRewardCoupon = async (code: string): Promise<{ code: string; pointsValue: number }> => {
  const response = await api.get<{ code: string; pointsValue: number }>(`/rewards/coupon/${encodeURIComponent(code.trim().toUpperCase())}`);
  return response.data;
};

/** Invalidate a reward coupon (e.g. after order cancelled). If it was used, points are returned to balance. */
export const invalidateRewardCoupon = async (code: string): Promise<void> => {
  await api.post(`/rewards/coupon/${encodeURIComponent(code.trim().toUpperCase())}/invalidate`);
};

/** Mark reward coupon as used for an order (call after order is placed). */
export const useRewardCoupon = async (code: string, orderId: string): Promise<void> => {
  await api.post(`/rewards/coupon/${encodeURIComponent(code.trim().toUpperCase())}/use`, { orderId });
};

/** Add earned points (pending) when order is placed. Backend ledger source of truth. */
export const addLedgerEarned = async (orderId: string, points: number): Promise<void> => {
  await api.post('/rewards/ledger/earned', { orderId, points });
};

/** Convert pending → available when order is delivered. */
export const convertLedgerPending = async (orderId: string): Promise<void> => {
  await api.patch('/rewards/ledger/convert', { orderId });
};

/** Reverse points when order is cancelled or returned. */
export const reverseLedger = async (orderId: string, reason: 'cancelled' | 'returned'): Promise<void> => {
  await api.post('/rewards/ledger/reverse', { orderId, reason });
};

/** Redeem points for a voucher. Returns coupon code. Backend creates ledger entry + coupon. */
export const redeemRewardPoints = async (points: number): Promise<{ couponCode: string; points: number }> => {
  const res = await api.post<{ couponCode: string; points: number }>('/rewards/redeem', { points });
  return res.data;
};

/** Create referral attribution when referee signs up with ref=referrerId in URL. */
export const createReferralAttribution = async (referrerId: string): Promise<void> => {
  await api.post('/rewards/referral', { referrerId });
};

/** Notify backend that order was delivered. Triggers referral payout if referee's first order. */
export const notifyOrderDelivered = async (): Promise<{ awarded: boolean; refereeVoucherCode?: string }> => {
  const res = await api.post<{ awarded: boolean; refereeVoucherCode?: string; refereeVoucherValue?: number }>(
    '/rewards/referral/on-order-delivered'
  );
  return res.data;
};

