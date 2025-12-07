export type RewardTier = 'Silver' | 'Gold' | 'Platinum';

export type RewardTransactionType = 'earned' | 'redeemed' | 'expired';

export interface RewardTransaction {
  id: string;
  date: string;
  type: RewardTransactionType;
  points: number;
  description: string;
  orderId?: string;
}

export type ReferralStatus = 'pending' | 'joined' | 'purchased' | 'rewarded';

export interface ReferralInvite {
  id: string;
  name: string;
  email: string;
  status: ReferralStatus;
  invitedAt: string;
  lastActivity?: string;
  rewardEarned?: number;
  channel?: 'email' | 'sms' | 'social' | 'copy';
}

export interface ReferralStats {
  invitesSent: number;
  signups: number;
  conversions: number;
  totalRewards: number;
  pendingRewards: number;
  lastUpdated: string;
}

export type ChallengeCadence = 'daily' | 'weekly' | 'seasonal';

export interface ChallengeProgress {
  current: number;
  target: number;
  unit: 'actions' | 'points' | 'currency' | 'streak';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;
  cadence: ChallengeCadence;
  status: 'active' | 'completed' | 'locked';
  progress: ChallengeProgress;
  accentColor: string;
  icon: string;
  cta?: {
    label: string;
    href: string;
  };
}

export interface StreakSummary {
  current: number;
  best: number;
  multiplier: number;
  endsAt: string;
}

export type BadgeRarity = 'common' | 'rare' | 'epic';

export interface LoyaltyBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  earnedOn?: string;
}

export interface TierOverview {
  tier: RewardTier;
  tierProgress: number;
  pointsToNext: number;
  aiTip: string;
  streakMultiplier: number;
}

export interface BalanceSummary {
  availablePoints: number;
  walletBalance: number;
  estimatedValue: number;
  pendingPoints: number;
  expiringPoints?: number;
  expiringOn?: string;
}

export interface RewardsExperience {
  summary: BalanceSummary;
  tier: TierOverview;
  transactions: RewardTransaction[];
  referrals: {
    link: string;
    stats: ReferralStats;
    invites: ReferralInvite[];
  };
  challenges: {
    streak: StreakSummary;
    daily: Challenge[];
    weekly: Challenge[];
    seasonal: Challenge[];
  };
  badges: LoyaltyBadge[];
  lastSynced: string;
}


