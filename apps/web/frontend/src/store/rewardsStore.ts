import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  createRewardsFallbackExperience,
  fetchRewardsExperience,
  rotateReferralLink,
} from '../services/rewardsAPI';
import { userScopedStorage } from './userScopedStorage';
import {
  REFERRAL_FIRST_PURCHASE_BONUS_INVITER,
  computeOrderPoints,
  TIER_THRESHOLDS,
  TIER_POINTS_MULTIPLIER,
  ROLLING_TIER_MONTHS,
} from '../utils/rewardsConstants';
import type { Order } from '../types/order';
import type {
  RewardTier,
  RewardTransaction,
  BalanceSummary,
  TierOverview,
  ReferralStats,
  ReferralInvite,
  Challenge,
  StreakSummary,
  LoyaltyBadge,
  RewardsExperience,
  LedgerEvent,
} from '../types/rewards';

/** Ledger is source of truth. When non-empty, points/summary/transactions are derived from it. */
function deriveFromLedger(ledger: LedgerEvent[]): {
  pendingPoints: number;
  availablePoints: number;
  lifetimePointsEarned: number;
  /** Points earned in last ROLLING_TIER_MONTHS months (for tier calculation). */
  rolling12MonthPoints: number;
  transactions: RewardTransaction[];
} {
  const now = Date.now();
  const cutoffMs = now - ROLLING_TIER_MONTHS * 30 * 24 * 60 * 60 * 1000; // ~12 months ago

  const lifetimePointsEarned = ledger
    .filter((e) => e.type === 'earned')
    .reduce((sum, e) => sum + e.points, 0);

  const rolling12MonthPoints = ledger
    .filter((e) => e.type === 'earned' && new Date(e.date).getTime() >= cutoffMs)
    .reduce((sum, e) => sum + e.points, 0);

  // Process in chronological order. Reversals subtract from available first, then pending; allow negative available.
  const sorted = [...ledger].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let pendingPoints = 0;
  let availablePoints = 0;
  for (const e of sorted) {
    if (e.type === 'earned') {
      if (e.status === 'pending') pendingPoints += e.points;
      else availablePoints += e.points;
    } else if (e.type === 'reversed') {
      let remain = -e.points;
      const fromAvailable = Math.min(availablePoints, remain);
      availablePoints -= fromAvailable;
      remain -= fromAvailable;
      const fromPending = Math.min(pendingPoints, remain);
      pendingPoints -= fromPending;
      remain -= fromPending;
      if (remain > 0) availablePoints -= remain; // allow negative balance when points were already used
    } else if (e.type === 'redeemed' || e.type === 'expired') {
      availablePoints += e.points; // negative
    }
  }

  const transactions: RewardTransaction[] = ledger
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((e): RewardTransaction => {
      if (e.type === 'earned') {
        return { id: e.id, date: e.date, type: 'earned', status: e.status, points: e.points, description: e.description, orderId: e.orderId };
      }
      if (e.type === 'reversed') {
        return { id: e.id, date: e.date, type: 'reversed', points: e.points, description: e.description, orderId: e.orderId, reason: e.reason };
      }
      if (e.type === 'redeemed') {
        return { id: e.id, date: e.date, type: 'redeemed', points: e.points, description: e.description };
      }
      if (e.type === 'expired') {
        return { id: e.id, date: e.date, type: 'expired', points: e.points, description: e.description };
      }
      return { id: e.id, date: e.date, type: e.type, points: e.points, description: e.description, orderId: e.orderId };
    });

  return { pendingPoints, availablePoints, lifetimePointsEarned, rolling12MonthPoints, transactions };
}

interface RewardsState {
  /** Ledger is source of truth. When set, points/summary.pending/available/transactions derived from it. */
  ledger: LedgerEvent[];
  points: number;
  /** Lifetime points earned (never decreases on redemption). Tier is derived from this. */
  lifetimePointsEarned: number;
  tier: RewardTier;
  tierProgress: number;
  transactions: RewardTransaction[];
  walletBalance: number;
  summary: BalanceSummary;
  tierOverview: TierOverview;
  referralLink: string;
  referralStats: ReferralStats;
  referralInvites: ReferralInvite[];
  challenges: {
    daily: Challenge[];
    weekly: Challenge[];
    seasonal: Challenge[];
  };
  streak: StreakSummary;
  badges: LoyaltyBadge[];
  isLoading: boolean;
  error: string | null;
  lastSynced: string | null;

  /** Add points as Pending (order placed). Use convertPendingToAvailable when order is delivered. */
  addPendingPoints: (orderId: string, points: number, description?: string) => void;
  /** Move order's pending points to available (order delivered / return window passed). */
  convertPendingToAvailable: (orderId: string) => void;
  /** Reverse pending points for cancelled/returned order. */
  reversePoints: (orderId: string, reason: 'cancelled' | 'returned') => void;
  /** Add points directly as available (e.g. challenges, referrals). */
  addPoints: (points: number, description: string, orderId?: string) => void;
  redeemPoints: (points: number, description: string) => void;
  setTier: (tier: RewardTier) => void;
  addWalletFunds: (amount: number) => void;
  deductWalletFunds: (amount: number) => void;

  getPointsToNextTier: () => number;
  canRedeemPoints: (points: number) => boolean;

  refreshRewardsExperience: (options?: { force?: boolean }) => Promise<void>;
  regenerateReferralLink: () => Promise<void>;
  completeChallenge: (challengeId: string) => void;
  recordReferralShare: (channel: ReferralInvite['channel']) => void;
  /** Mark invite as "Signed up" (friend joined). */
  recordReferralSignup: (inviteId: string) => void;
  /** Reward on first purchase: award inviter points and mark invite as rewarded. */
  recordReferralFirstPurchase: (inviteId: string) => void;
  /** One-time bootstrap: derive ledger events from existing orders if ledger is empty. */
  syncFromOrders: (orders: Order[]) => void;
  reset: () => void;
}

const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);

/** Tier from 12-month rolling points. Silver → Gold → Platinum → Diamond. */
const calculateTierState = (rollingPoints: number, currentMultiplier = 1): TierOverview => {
  if (rollingPoints >= TIER_THRESHOLDS.Diamond) {
    return {
      tier: 'Diamond',
      tierProgress: 100,
      pointsToNext: 0,
      aiTip: 'You reached Diamond. Enjoy 1.25× points and top perks.',
      streakMultiplier: currentMultiplier,
    };
  }
  if (rollingPoints >= TIER_THRESHOLDS.Platinum) {
    const span = TIER_THRESHOLDS.Diamond - TIER_THRESHOLDS.Platinum;
    const progress = ((rollingPoints - TIER_THRESHOLDS.Platinum) / span) * 100;
    return {
      tier: 'Platinum',
      tierProgress: clamp(progress),
      pointsToNext: TIER_THRESHOLDS.Diamond - rollingPoints,
      aiTip: 'Earn more to reach Diamond at 25,000 points for 1.25×.',
      streakMultiplier: currentMultiplier,
    };
  }
  if (rollingPoints >= TIER_THRESHOLDS.Gold) {
    const span = TIER_THRESHOLDS.Platinum - TIER_THRESHOLDS.Gold;
    const progress = ((rollingPoints - TIER_THRESHOLDS.Gold) / span) * 100;
    return {
      tier: 'Gold',
      tierProgress: clamp(progress),
      pointsToNext: TIER_THRESHOLDS.Platinum - rollingPoints,
      aiTip: 'Earn more to reach Platinum at 10,000 points for 1.1×.',
      streakMultiplier: currentMultiplier,
    };
  }
  const progress = TIER_THRESHOLDS.Gold > 0 ? (rollingPoints / TIER_THRESHOLDS.Gold) * 100 : 0;
  return {
    tier: 'Silver',
    tierProgress: clamp(progress),
    pointsToNext: TIER_THRESHOLDS.Gold - rollingPoints,
    aiTip: 'Place orders to earn points. Reach Gold at 2,500 points for 1.05×.',
    streakMultiplier: currentMultiplier,
  };
};

/** Map backend transaction to LedgerEvent for ledger derivation */
function backendTransactionToLedgerEvent(t: {
  id: string;
  date: string;
  type: string;
  status?: string;
  points: number;
  orderId?: string | null;
  reason?: string | null;
}): LedgerEvent {
  const dateStr = typeof t.date === 'string' ? t.date : new Date(t.date).toISOString();
  const desc =
    t.type === 'earned'
      ? `Order ${t.orderId ? `#${t.orderId}` : ''} – ${t.status === 'pending' ? 'Pending' : 'Earned'}`
      : t.type === 'reversed'
        ? (t.reason === 'cancelled' ? 'Reversed (cancelled)' : 'Reversed (returned)')
        : t.type === 'redeemed'
          ? 'Redeemed'
          : t.type;
  return {
    id: t.id,
    date: dateStr,
    type: t.type as LedgerEvent['type'],
    status: t.status as LedgerEvent['status'],
    points: t.points,
    description: desc,
    orderId: t.orderId ?? undefined,
    reason: t.reason ?? undefined,
  };
}

const normaliseExperience = (experience: RewardsExperience) => {
  const points = experience.summary.availablePoints;
  const lifetimePointsEarned = points + (experience.summary.pendingPoints ?? 0);
  const tierOverview = calculateTierState(lifetimePointsEarned, experience.challenges.streak.multiplier);
  return {
  points,
  lifetimePointsEarned,
  tier: tierOverview.tier,
  tierProgress: tierOverview.tierProgress,
  transactions: experience.transactions,
  walletBalance: experience.summary.walletBalance,
  summary: experience.summary,
  tierOverview,
  referralLink: experience.referrals.link,
  referralStats: experience.referrals.stats,
  referralInvites: experience.referrals.invites,
  challenges: {
    daily: experience.challenges.daily,
    weekly: experience.challenges.weekly,
    seasonal: experience.challenges.seasonal,
  },
  streak: experience.challenges.streak,
  badges: experience.badges,
  isLoading: false,
  error: null,
  lastSynced: experience.lastSynced,
};
};

const updateSummaryValues = (summary: BalanceSummary, deltaPoints: number, deltaWallet = 0): BalanceSummary => ({
  ...summary,
  availablePoints: summary.availablePoints + deltaPoints,
  estimatedValue: (summary.availablePoints + deltaPoints) / 100,
  walletBalance: summary.walletBalance + deltaWallet,
});

const applyLedgerDerived = (ledger: LedgerEvent[], state: RewardsState) => {
  const { pendingPoints, availablePoints, lifetimePointsEarned, rolling12MonthPoints, transactions } = deriveFromLedger(ledger);
  const lifetime = ledger.length > 0 ? lifetimePointsEarned : (state.lifetimePointsEarned ?? 0);
  const tierOverview = calculateTierState(ledger.length > 0 ? rolling12MonthPoints : lifetime, state.streak.multiplier);
  return {
    points: availablePoints,
    lifetimePointsEarned: lifetime,
    tier: tierOverview.tier,
    tierProgress: tierOverview.tierProgress,
    tierOverview,
    summary: {
      ...state.summary,
      availablePoints,
      pendingPoints,
      estimatedValue: availablePoints / 100,
    },
    transactions: transactions.slice(0, 100),
    lastSynced: new Date().toISOString(),
  };
};

export const useRewardsStore = create<RewardsState>()(
  persist(
    (set, get) => {
      const seed = normaliseExperience(createRewardsFallbackExperience());

      return {
        ...seed,
        ledger: [] as LedgerEvent[],

        syncFromOrders: (orders) => {
          if (!orders || orders.length === 0) return;
          const state = get();
          // Don't re-sync if we already have ledger data
          if (state.ledger.length > 0) return;

          const now = new Date().toISOString();
          const events: LedgerEvent[] = [];

          orders.forEach((order) => {
            const points =
              order.pointsEarned ?? computeOrderPoints(order.subtotal ?? 0);
            if (!points || points <= 0) {
              return;
            }

            // Cancelled/returned orders: record as reversed so history is accurate but net zero.
            if (order.status === 'cancelled' || order.status === 'returned') {
              events.push({
                id: `ledger_sync_rev_${order.id}`,
                date: order.cancelledAt ?? order.date ?? now,
                type: 'reversed',
                points: -points,
                description:
                  order.status === 'cancelled'
                    ? 'Reversed (cancelled)'
                    : 'Reversed (returned)',
                orderId: order.id,
                reason: order.status,
              });
              return;
            }

            const isDelivered = order.status === 'delivered';
            events.push({
              id: `ledger_sync_${order.id}`,
              date: order.deliveredDate ?? order.date ?? now,
              type: 'earned',
              status: isDelivered ? 'available' : 'pending',
              points,
              description: `Order #${order.orderNumber} – ${
                isDelivered ? 'Earned' : 'Pending'
              }`,
              orderId: order.id,
            });
          });

          if (events.length === 0) return;

          const ledger = [...events, ...state.ledger];
          set((s) => ({
            ledger,
            ...applyLedgerDerived(ledger, s),
          }));
        },

        addPendingPoints: (orderId, points, description) => {
          if (points <= 0) return;
          set((state) => {
            let ledger = state.ledger;
            if (ledger.length === 0 && (state.points > 0 || state.summary.availablePoints > 0)) {
              const legacyPoints = state.points || state.summary.availablePoints;
              ledger = [
                {
                  id: `ledger_legacy_${Date.now()}`,
                  date: new Date().toISOString(),
                  type: 'earned',
                  status: 'available',
                  points: legacyPoints,
                  description: 'Legacy balance',
                },
              ];
            }
            const event: LedgerEvent = {
              id: `ledger_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
              date: new Date().toISOString(),
              type: 'earned',
              status: 'pending',
              points,
              description: description ?? `Order #${orderId} – Pending`,
              orderId,
            };
            ledger = [event, ...ledger];
            return { ledger, ...applyLedgerDerived(ledger, state) };
          });
        },

        convertPendingToAvailable: (orderId) => {
          set((state) => {
            const ledger = state.ledger.map((e) =>
              e.type === 'earned' && e.orderId === orderId && e.status === 'pending'
                ? { ...e, status: 'available' as const }
                : e
            );
            return { ledger, ...applyLedgerDerived(ledger, state) };
          });
        },

        reversePoints: (orderId, reason) => {
          const state = get();
          const toReverse = state.ledger
            .filter((e) => e.type === 'earned' && e.orderId === orderId)
            .reduce((sum, e) => sum + e.points, 0);
          if (toReverse <= 0) return;
          const event: LedgerEvent = {
            id: `ledger_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            date: new Date().toISOString(),
            type: 'reversed',
            points: -toReverse,
            description: reason === 'cancelled' ? 'Reversed (cancelled)' : 'Reversed (returned)',
            orderId,
            reason,
          };
          set((s) => {
            const ledger = [event, ...s.ledger];
            return { ledger, ...applyLedgerDerived(ledger, s) };
          });
        },

        addPoints: (points, description, orderId) => {
          if (points <= 0) return;
          const event: LedgerEvent = {
            id: `ledger_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            date: new Date().toISOString(),
            type: 'earned',
            status: 'available',
            points,
            description,
            orderId,
          };
          set((state) => {
            const ledger = [event, ...state.ledger];
            const lifetime = (state.lifetimePointsEarned ?? state.points) + points;
            return { ledger, lifetimePointsEarned: lifetime, ...applyLedgerDerived(ledger, { ...state, lifetimePointsEarned: lifetime }) };
          });
        },

        redeemPoints: (points, description) => {
          const state = get();
          const available = state.ledger.length > 0 ? deriveFromLedger(state.ledger).availablePoints : state.points;
          if (available < points) return;
          const event: LedgerEvent = {
            id: `ledger_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            date: new Date().toISOString(),
            type: 'redeemed',
            points: -points,
            description,
          };
          set((s) => {
            const ledger = [event, ...s.ledger];
            return { ledger, ...applyLedgerDerived(ledger, s) };
          });
        },

        setTier: (tier) => {
          set((state) => {
            const targetPoints = Math.max(state.lifetimePointsEarned, TIER_THRESHOLDS[tier]);
            const tierOverview = calculateTierState(targetPoints, state.streak.multiplier);
            return {
              tier: tierOverview.tier,
              tierOverview,
              tierProgress: tierOverview.tierProgress,
            };
          });
        },

        addWalletFunds: (amount) => {
          set((state) => ({
            walletBalance: state.walletBalance + amount,
            summary: updateSummaryValues(state.summary, 0, amount),
          }));
        },

        deductWalletFunds: (amount) => {
          set((state) => {
            const newBalance = Math.max(0, state.walletBalance - amount);
            return {
              walletBalance: newBalance,
              summary: {
                ...state.summary,
                walletBalance: newBalance,
              },
            };
          });
        },

        getPointsToNextTier: () => {
          const { tierOverview } = get();
          return tierOverview.pointsToNext;
        },

        canRedeemPoints: (points) => {
          const s = get();
          const available = s.ledger.length > 0 ? deriveFromLedger(s.ledger).availablePoints : s.points;
          return available >= points;
        },

        refreshRewardsExperience: async ({ force = false } = {}) => {
          const { lastSynced, isLoading } = get();
          if (!force && isLoading) return;

          if (!force && lastSynced) {
            const minutesSinceSync = (Date.now() - new Date(lastSynced).getTime()) / (1000 * 60);
            if (minutesSinceSync < 5) {
              return;
            }
          }

          set({ isLoading: true, error: null });
          try {
            const experience = await fetchRewardsExperience();
            set((state) => {
              const merged = normaliseExperience(experience);
              // Backend is source of truth: when we have transactions from API, hydrate ledger from them
              const backendLedger: LedgerEvent[] =
                Array.isArray(experience.transactions) && experience.transactions.length > 0
                  ? experience.transactions.map((t) =>
                      backendTransactionToLedgerEvent({
                        id: t.id,
                        date: t.date,
                        type: t.type,
                        status: t.status,
                        points: t.points,
                        orderId: t.orderId,
                        reason: t.reason,
                      })
                    )
                  : [];
              const ledger = backendLedger.length > 0 ? backendLedger : state.ledger;
              const derived = ledger.length > 0 ? applyLedgerDerived(ledger, merged) : merged;
              return { ...merged, ...derived, ledger };
            });
          } catch (error) {
            console.error('[RewardsStore] Failed to refresh experience', error);
            set((state) => ({
              isLoading: false,
              error: 'Unable to refresh loyalty data right now. Showing cached view.',
              lastSynced: state.lastSynced,
            }));
          }
        },

        regenerateReferralLink: async () => {
          try {
            const link = await rotateReferralLink();
            set((state) => ({
              referralLink: link,
              referralStats: {
                ...state.referralStats,
                lastUpdated: new Date().toISOString(),
              },
            }));
          } catch (error) {
            console.error('[RewardsStore] Unable to regenerate referral link', error);
            set({
              error: 'Unable to generate a new referral link. Please try again shortly.',
            });
          }
        },

        completeChallenge: (challengeId) => {
          const state = get();

          const updateCollection = (collection: Challenge[]) =>
            collection.map((challenge) => {
              if (challenge.id !== challengeId) {
                return challenge;
              }
              if (challenge.status === 'completed') {
                return challenge;
              }
              return {
                ...challenge,
                status: 'completed',
                progress: {
                  ...challenge.progress,
                  current: challenge.progress.target,
                },
              };
            });

          set({
            challenges: {
              daily: updateCollection(state.challenges.daily),
              weekly: updateCollection(state.challenges.weekly),
              seasonal: updateCollection(state.challenges.seasonal),
            },
          });

          const challenge =
            state.challenges.daily.find((ch) => ch.id === challengeId) ||
            state.challenges.weekly.find((ch) => ch.id === challengeId) ||
            state.challenges.seasonal.find((ch) => ch.id === challengeId);

          if (challenge && challenge.status !== 'completed') {
            get().addPoints(
              challenge.rewardPoints,
              `Challenge completed: ${challenge.title}`
            );
          }
        },

        recordReferralShare: (channel) => {
          set((state) => ({
            referralStats: {
              ...state.referralStats,
              invitesSent: state.referralStats.invitesSent + 1,
              lastUpdated: new Date().toISOString(),
            },
            referralInvites: [
              {
                id: `pending-${Date.now()}`,
                name: 'Pending Invite',
                email: 'pending@invite.com',
                status: 'pending',
                invitedAt: new Date().toISOString(),
                channel,
              },
              ...state.referralInvites,
            ].slice(0, 20),
          }));
        },

        recordReferralSignup: (inviteId) => {
          set((state) => {
            const invite = state.referralInvites.find((i) => i.id === inviteId);
            if (!invite || invite.status !== 'pending') return state;
            return {
              referralStats: {
                ...state.referralStats,
                signups: state.referralStats.signups + 1,
                lastUpdated: new Date().toISOString(),
              },
              referralInvites: state.referralInvites.map((i) =>
                i.id === inviteId ? { ...i, status: 'joined' as const, lastActivity: new Date().toISOString() } : i
              ),
            };
          });
        },

        recordReferralFirstPurchase: (inviteId) => {
          const state = get();
          const invite = state.referralInvites.find((i) => i.id === inviteId);
          if (!invite || invite.status === 'rewarded') return;
          const bonus = REFERRAL_FIRST_PURCHASE_BONUS_INVITER;
          get().addPoints(bonus, `Referral bonus – ${invite.name || 'friend'}'s first purchase`);
          set((s) => ({
            referralStats: {
              ...s.referralStats,
              conversions: s.referralStats.conversions + 1,
              totalRewards: s.referralStats.totalRewards + bonus / 100,
              pendingRewards: Math.max(0, (s.referralStats.pendingRewards ?? 0) - bonus / 100),
              lastUpdated: new Date().toISOString(),
            },
            referralInvites: s.referralInvites.map((i) =>
              i.id === inviteId ? { ...i, status: 'rewarded' as const, rewardEarned: bonus, lastActivity: new Date().toISOString() } : i
            ),
          }));
        },

        reset: () => set(() => ({ ...normaliseExperience(createRewardsFallbackExperience()), ledger: [] })),
      };
    },
    {
      name: 'easy11-rewards-storage',
      version: 6,
      migrate: (persisted: unknown, version: number) => {
        const p = persisted as Record<string, unknown>;
        if (p && typeof p === 'object') {
          if (version < 3 && !Array.isArray((p as { ledger?: unknown }).ledger)) {
            (p as { ledger: LedgerEvent[] }).ledger = [];
          }
          if (version < 4) {
            const tier = (p as { tier?: string }).tier;
            if (tier === 'Diamond') (p as { tier: RewardTier }).tier = 'Platinum';
            const overview = (p as { tierOverview?: { tier: string } }).tierOverview;
            if (overview?.tier === 'Diamond') overview.tier = 'Platinum';
          }
          // v5: Silver default, Gold 2500, Platinum 7500, Diamond 15000, Elite 30000; 12-month rolling; Bronze → Silver
          if (version < 5) {
            const tier = (p as { tier?: string }).tier;
            if (tier === 'Bronze') (p as { tier: RewardTier }).tier = 'Silver';
            const overview = (p as { tierOverview?: { tier: string } }).tierOverview;
            if (overview?.tier === 'Bronze') overview.tier = 'Silver';
          }
          // v6: Remove Elite; Diamond top tier; Platinum 10k, Diamond 25k
          if (version < 6) {
            const tier = (p as { tier?: string }).tier;
            if (tier === 'Elite') (p as { tier: RewardTier }).tier = 'Diamond';
            const overview = (p as { tierOverview?: { tier: string } }).tierOverview;
            if (overview?.tier === 'Elite') overview.tier = 'Diamond';
          }
        }
        return p as RewardsState;
      },
      storage: createJSONStorage(() => userScopedStorage),
      skipHydration: true,
    }
  )
);

export { TIER_POINTS_MULTIPLIER } from '../utils/rewardsConstants';