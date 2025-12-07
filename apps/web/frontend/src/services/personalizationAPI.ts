/**
 * Sprint 15 — Personalization API (mock implementations)
 */

import type {
  PersonalizationContext,
  PersonalizedSection,
  ReRankResult,
  PersonalizationSettings,
  EmailTopPick,
} from '../types/personalization';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockProducts = [
  {
    id: 'p-1001',
    title: 'Nimbus Run Pro Shoes',
    price: 118.99,
    currency: 'USD',
    image: '👟',
    badges: ['Low stock', 'Trending near you'],
    url: '/products/11',
  },
  {
    id: 'p-1002',
    title: 'AeroFit Windbreaker',
    price: 89.5,
    currency: 'USD',
    image: '🧥',
    badges: ['New arrival'],
    url: '/products/5',
  },
  {
    id: 'p-1003',
    title: 'Skyline Messenger Bag',
    price: 159.99,
    currency: 'USD',
    image: '👜',
    badges: ['Staff pick'],
    url: '/products/3',
  },
  {
    id: 'p-1004',
    title: 'Lumen Smart Lamp',
    price: 134.0,
    currency: 'USD',
    image: '💡',
    badges: ['Seasonal drop'],
    url: '/products/9',
  },
];

const buildSection = (
  id: string,
  title: string,
  subtitle: string,
  reasonCode: string,
  slice: number,
): PersonalizedSection => ({
  id,
  surface: 'home',
  title,
  subtitle,
  reasonCode,
  explorationWeight: 0.18,
  items: mockProducts.slice(0, slice).map((product, idx) => ({
    ...product,
    score: 0.86 - idx * 0.05,
    reason: idx === 0 ? 'High purchase intent' : 'Complementary to recent views',
  })),
});

export const fetchHomeExperience = async (
  context: PersonalizationContext,
): Promise<PersonalizedSection[]> => {
  console.debug('[PersonalizationAPI] Fetching home experience', context);
  await delay(260);
  return [
    buildSection('home-hero', 'Because you viewed performance gear', 'Fresh drops for cooler evenings', 'session_viewed', 4),
    {
      ...buildSection(
        'home-complete-look',
        'Finish the look',
        'Match accessories with your new favorites',
        'set_completion',
        3,
      ),
      items: mockProducts.slice(1, 4).map((item, idx) => ({
        ...item,
        score: 0.81 - idx * 0.05,
        reason: 'Complements items in cart',
      })),
    },
    buildSection('home-trending-nearby', 'Trending near you', 'Popular with shoppers in Austin', 'geo_trending', 4),
  ];
};

export const fetchPLPRerank = async (
  productIds: string[],
  context: PersonalizationContext,
): Promise<ReRankResult> => {
  await delay(180);
  const reranked = [...productIds];
  // Move AI tagged IDs to top based on score heuristics
  reranked.sort((a, b) => {
    const weight = (id: string) => {
      if (id === '1' || id === '11') return 0.95;
      if (id === '3' || id === '7') return 0.9;
      return 0.5;
    };
    return weight(b) - weight(a);
  });
  return {
    originalOrder: productIds,
    rerankedOrder: reranked,
    reasonCodes: {
      '1': 'high_click_through',
      '11': 'recent_purchase_segment',
      '7': 'margin_target',
    },
    sessionFeatures: {
      recent_view_count: 6,
      cart_value: 89,
      margin_target: context.priceBand === 'premium' ? 0.8 : 0.6,
    },
  };
};

export const fetchPDPCompletion = async (
  productId: string,
  context: PersonalizationContext,
): Promise<PersonalizedSection> => {
  await delay(220);
  return {
    id: `pdp-${productId}-bundle`,
    surface: 'pdp',
    title: 'Complete the set',
    subtitle: 'Bundles shoppers frequently add together',
    reasonCode: 'frequently_bought',
    items: mockProducts.map((item, idx) => ({
      ...item,
      score: 0.9 - idx * 0.04,
      reason: idx === 0 ? 'Customers add this 68% of the time' : 'Keeps AOV in target band',
    })),
  };
};

export const fetchEmailTopPicks = async (
  context: PersonalizationContext,
): Promise<EmailTopPick[]> => {
  await delay(200);
  return mockProducts.slice(0, 3).map((item, idx) => ({
    productId: item.id,
    title: item.title,
    price: item.price,
    heroCopy:
      idx === 0
        ? 'Your size is back — complete the training kit while stock lasts.'
        : 'Save it for later? We will keep an eye on price drops.',
    sendWindow: idx === 0 ? '07:30 local' : '19:00 local',
  }));
};

export const fetchPersonalizationSettings = async (): Promise<PersonalizationSettings> => {
  await delay(120);
  return {
    mutedBrands: [],
    mutedCategories: ['beauty'],
    allowExploration: true,
    explorationRatio: 0.15,
  };
};

export const updatePersonalizationSettings = async (settings: PersonalizationSettings) => {
  await delay(150);
  return settings;
};

export const trackPersonalizationEvent = async (
  event: string,
  payload: Record<string, unknown>,
) => {
  console.debug('[PersonalizationAPI] tracked', event, payload);
};

const personalizationAPI = {
  fetchHomeExperience,
  fetchPLPRerank,
  fetchPDPCompletion,
  fetchEmailTopPicks,
  fetchPersonalizationSettings,
  updatePersonalizationSettings,
  trackPersonalizationEvent,
};

export default personalizationAPI;


