import api from './api';
import type { RewardsExperience } from '../types/rewards';

const fallbackTemplate: RewardsExperience = {
  summary: {
    availablePoints: 2430,
    walletBalance: 42.5,
    estimatedValue: 24.3,
    pendingPoints: 180,
    expiringPoints: 120,
    expiringOn: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  tier: {
    tier: 'Gold',
    tierProgress: 36,
    pointsToNext: 2570,
    aiTip: 'Complete one more weekly challenge to unlock Platinum faster.',
    streakMultiplier: 2,
  },
  transactions: [
    {
      id: 'txn-3001',
      date: new Date().toISOString(),
      type: 'earned',
      points: 120,
      description: 'Challenge completed: Weekend Bundle Builder',
    },
    {
      id: 'txn-2999',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'earned',
      points: 240,
      description: 'Order #84512 purchase reward',
      orderId: '84512',
    },
    {
      id: 'txn-2996',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'redeemed',
      points: -500,
      description: 'Redeemed $5 wallet credit',
    },
    {
      id: 'txn-2988',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'earned',
      points: 75,
      description: 'Review posted: AirFlex Runner',
      orderId: '83002',
    },
    {
      id: 'txn-2986',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'earned',
      points: 300,
      description: 'Referral bonus – Priya completed first order',
    },
  ],
  referrals: {
    link: 'https://easy11.com/ref/EASY11-JAY-84',
    stats: {
      invitesSent: 18,
      signups: 11,
      conversions: 7,
      totalRewards: 70,
      pendingRewards: 20,
      lastUpdated: new Date().toISOString(),
    },
    invites: [
      {
        id: 'ref-101',
        name: 'Priya Rao',
        email: 'priya.rao@example.com',
        status: 'rewarded',
        invitedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        rewardEarned: 10,
        channel: 'email',
      },
      {
        id: 'ref-102',
        name: 'Miguel Alvarez',
        email: 'miguel.alvarez@example.com',
        status: 'purchased',
        invitedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        rewardEarned: 10,
        channel: 'social',
      },
      {
        id: 'ref-103',
        name: 'Skylar Chen',
        email: 'skylar.chen@example.com',
        status: 'joined',
        invitedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        channel: 'copy',
      },
      {
        id: 'ref-104',
        name: 'Sarah Lee',
        email: 'sarah.lee@example.com',
        status: 'pending',
        invitedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        channel: 'sms',
      },
    ],
  },
  challenges: {
    streak: {
      current: 7,
      best: 21,
      multiplier: 2,
      endsAt: new Date(Date.now() + 17 * 60 * 60 * 1000).toISOString(),
    },
    daily: [
      {
        id: 'daily-collect-reviews',
        title: 'Write a product review',
        description: 'Share feedback on an item you purchased this week.',
        rewardPoints: 25,
        cadence: 'daily',
        status: 'active',
        progress: { current: 0, target: 1, unit: 'actions' },
        accentColor: 'from-blue-500 to-indigo-500',
        icon: '📝',
        cta: { label: 'Review items', href: '/account/orders' },
      },
      {
        id: 'daily-wishlist',
        title: 'Wishlist refresh',
        description: 'Add 3 items to your wishlist to get tailored deals.',
        rewardPoints: 15,
        cadence: 'daily',
        status: 'active',
        progress: { current: 2, target: 3, unit: 'actions' },
        accentColor: 'from-teal-500 to-emerald-500',
        icon: '💚',
        cta: { label: 'Browse items', href: '/products' },
      },
    ],
    weekly: [
      {
        id: 'weekly-bundle',
        title: 'Build a bundle',
        description: 'Purchase two complementary products in one order.',
        rewardPoints: 80,
        cadence: 'weekly',
        status: 'active',
        progress: { current: 1, target: 2, unit: 'actions' },
        accentColor: 'from-purple-500 to-purple-700',
        icon: '🛍️',
        cta: { label: 'Shop curated sets', href: '/products?bundle=1' },
      },
      {
        id: 'weekly-referral',
        title: 'Invite two friends',
        description: 'Get two friends to sign up with your link.',
        rewardPoints: 100,
        cadence: 'weekly',
        status: 'active',
        progress: { current: 1, target: 2, unit: 'actions' },
        accentColor: 'from-amber-500 to-orange-500',
        icon: '👥',
        cta: { label: 'Share invite', href: '/account/referrals' },
      },
    ],
    seasonal: [
      {
        id: 'seasonal-room-refresh',
        title: 'Room refresh',
        description: 'Spend $250 on home goods this season.',
        rewardPoints: 250,
        cadence: 'seasonal',
        status: 'active',
        progress: { current: 120, target: 250, unit: 'currency' },
        accentColor: 'from-sky-500 to-blue-600',
        icon: '🏠',
        cta: { label: 'Shop home', href: '/products?category=home' },
      },
    ],
  },
  badges: [
    {
      id: 'badge-first-order',
      name: 'First Order',
      description: 'Completed your very first Easy11 purchase.',
      icon: '🥇',
      rarity: 'common',
      earnedOn: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'badge-reviewer',
      name: 'Top Reviewer',
      description: 'Published 10 high-quality product reviews.',
      icon: '⭐',
      rarity: 'rare',
      earnedOn: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'badge-streak',
      name: 'Streak Keeper',
      description: 'Maintained a 14-day loyalty streak.',
      icon: '🔥',
      rarity: 'epic',
      earnedOn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'badge-referral',
      name: 'Referral Hero',
      description: 'Converted 5 friends within one month.',
      icon: '👯',
      rarity: 'rare',
    },
  ],
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


