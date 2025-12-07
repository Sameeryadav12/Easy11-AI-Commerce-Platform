import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  createRewardsFallbackExperience,
  fetchRewardsExperience,
  rotateReferralLink,
} from '../services/rewardsAPI';
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
} from '../types/rewards';

interface RewardsState {
  points: number;
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
}

const TIER_THRESHOLDS: Record<RewardTier, number> = {
  Silver: 0,
  Gold: 1000,
  Platinum: 5000,
};

const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);

const calculateTierState = (points: number, currentMultiplier = 1): TierOverview => {
  if (points >= TIER_THRESHOLDS.Platinum) {
    return {
      tier: 'Platinum',
      tierProgress: 100,
      pointsToNext: 0,
      aiTip: 'You unlocked every benefit. Maintain momentum to keep Platinum perks.',
      streakMultiplier: currentMultiplier,
    };
  }

  if (points >= TIER_THRESHOLDS.Gold) {
    const progress = ((points - TIER_THRESHOLDS.Gold) / (TIER_THRESHOLDS.Platinum - TIER_THRESHOLDS.Gold)) * 100;
    return {
      tier: 'Gold',
      tierProgress: clamp(progress),
      pointsToNext: TIER_THRESHOLDS.Platinum - points,
      aiTip: 'Bundle purchases or complete weekly challenges to speed up the journey to Platinum.',
      streakMultiplier: currentMultiplier,
    };
  }

  const progress = (points / (TIER_THRESHOLDS.Gold - TIER_THRESHOLDS.Silver)) * 100;
  return {
    tier: 'Silver',
    tierProgress: clamp(progress),
    pointsToNext: TIER_THRESHOLDS.Gold - points,
    aiTip: 'You are close to unlocking Gold perks. Complete a daily challenge or refer a friend to get there faster.',
    streakMultiplier: currentMultiplier,
  };
};

const normaliseExperience = (experience: RewardsExperience) => ({
  points: experience.summary.availablePoints,
  tier: experience.tier.tier,
  tierProgress: experience.tier.tierProgress,
  transactions: experience.transactions,
  walletBalance: experience.summary.walletBalance,
  summary: experience.summary,
  tierOverview: experience.tier,
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
});

const updateSummaryValues = (summary: BalanceSummary, deltaPoints: number, deltaWallet = 0): BalanceSummary => ({
  ...summary,
  availablePoints: summary.availablePoints + deltaPoints,
  estimatedValue: (summary.availablePoints + deltaPoints) / 100,
  walletBalance: summary.walletBalance + deltaWallet,
});

export const useRewardsStore = create<RewardsState>()(
  persist(
    (set, get) => {
      const seed = normaliseExperience(createRewardsFallbackExperience());

      return {
        ...seed,

        addPoints: (points, description, orderId) => {
          const transaction: RewardTransaction = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            type: 'earned',
            points,
            description,
            orderId,
          };

          set((state) => {
            const updatedPoints = state.points + points;
            const tierOverview = calculateTierState(updatedPoints, state.streak.multiplier);

            return {
              points: updatedPoints,
              tier: tierOverview.tier,
              tierProgress: tierOverview.tierProgress,
              tierOverview,
              summary: updateSummaryValues(state.summary, points),
              transactions: [transaction, ...state.transactions].slice(0, 50),
              lastSynced: new Date().toISOString(),
            };
          });
        },

        redeemPoints: (points, description) => {
          if (!get().canRedeemPoints(points)) {
            return;
          }

          const transaction: RewardTransaction = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            type: 'redeemed',
            points: -points,
            description,
          };

          set((state) => {
            const updatedPoints = state.points - points;
            const tierOverview = calculateTierState(updatedPoints, state.streak.multiplier);

            return {
              points: updatedPoints,
              tier: tierOverview.tier,
              tierProgress: tierOverview.tierProgress,
              tierOverview,
              summary: updateSummaryValues(state.summary, -points),
              transactions: [transaction, ...state.transactions].slice(0, 50),
              lastSynced: new Date().toISOString(),
            };
          });
        },

        setTier: (tier) => {
          set((state) => {
            const targetPoints = Math.max(state.points, TIER_THRESHOLDS[tier]);
            const tierOverview = calculateTierState(targetPoints, state.streak.multiplier);
            return {
              tier,
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

        canRedeemPoints: (points) => get().points >= points,

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
            set(() => normaliseExperience(experience));
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
      };
    },
    {
      name: 'easy11-rewards-storage',
      version: 2,
    }
  )
);

