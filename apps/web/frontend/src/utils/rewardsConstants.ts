/**
 * Rewards rules — single source of truth.
 *
 * Earning: 1 point = $1 spent on order subtotal (before tax & shipping).
 * Tier multiplier applied at time of earning.
 * Points are PENDING until order is Delivered (or after safety window).
 *
 * Redemption: 1,000 pts = $10 off; 750 pts = free standard shipping.
 */

import type { RewardTier } from '../types/rewards';

/** Points earned per $1 spent on subtotal. 1 pt = $1. */
export const POINTS_PER_DOLLAR = 1;

/** Minimum order subtotal ($) to earn points. Orders below this earn 0. */
export const MIN_ORDER_FOR_POINTS = 0;

/** When pending points become available: after order delivered (or return window). */
export const PENDING_AVAILABLE_RULE =
  'Points become available after your order is delivered. Cancelled/returned orders: points are reversed.';

/**
 * Tier thresholds (12-month rolling points). Used to compute tier from points earned in last 12 months.
 * Silver 0–2,499 | Gold 2,500–9,999 | Platinum 10,000–24,999 | Diamond 25,000+
 */
export const TIER_THRESHOLDS: Record<RewardTier, number> = {
  Silver: 0,
  Gold: 2500,
  Platinum: 10000,
  Diamond: 25000,
};

/**
 * Points multiplier applied at time of earning (not later).
 * Silver 1×, Gold 1.05×, Platinum 1.1×, Diamond 1.25×.
 */
export const TIER_POINTS_MULTIPLIER: Record<RewardTier, number> = {
  Silver: 1.0,
  Gold: 1.05,
  Platinum: 1.1,
  Diamond: 1.25,
};

/** Tier is based on points earned in the last 12 months (rolling). */
export const ROLLING_TIER_MONTHS = 12;

/**
 * Compute points for an order. Uses subtotal only (no shipping/tax).
 * Returns 0 if subtotal < MIN_ORDER_FOR_POINTS.
 * Multiplier is applied at time of earning (user's current tier).
 */
export function computeOrderPoints(
  subtotal: number,
  tierMultiplier: number = 1
): number {
  if (subtotal < MIN_ORDER_FOR_POINTS) return 0;
  const raw = Math.floor(subtotal * POINTS_PER_DOLLAR);
  return Math.max(0, Math.floor(raw * tierMultiplier));
}

/** Estimated value: 100 points = $1 (1 point = $0.01). */
export const POINTS_TO_DOLLAR_RATE = 0.01;

export function pointsToDollars(points: number): number {
  return points * POINTS_TO_DOLLAR_RATE;
}

/** Redemption: 1,000 pts = $10 off coupon (one-time code at checkout). */
export const REDEEM_POINTS_FOR_10_DOLLARS = 1000;
export const REDEEM_DOLLAR_VALUE = 10;

/** Free standard shipping: 750 points, single-order use. */
export const REDEEM_FREE_SHIPPING_POINTS = 750;

/** Referral: bonus points to inviter when referred friend makes first purchase. */
export const REFERRAL_FIRST_PURCHASE_BONUS_INVITER = 500;
