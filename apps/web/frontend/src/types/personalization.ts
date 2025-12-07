/**
 * Sprint 15 — Personalization 2.0 models
 */

export type PersonalizationSurface =
  | 'home'
  | 'plp'
  | 'pdp'
  | 'cart'
  | 'email'
  | 'push';

export type PersonalizationContext = {
  userId: string;
  sessionId: string;
  device: 'desktop' | 'mobile';
  geo?: string;
  weather?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  season?: string;
  category?: string;
  priceBand?: 'value' | 'mid' | 'premium';
};

export interface PersonalizedProduct {
  id: string;
  title: string;
  price: number;
  currency: string;
  image?: string;
  badges?: string[];
  reason?: string;
  score: number;
  url: string;
}

export interface PersonalizedSection {
  id: string;
  surface: PersonalizationSurface;
  title: string;
  subtitle?: string;
  reasonCode: string;
  explorationWeight?: number;
  items: PersonalizedProduct[];
}

export interface PersonalizationSettings {
  mutedBrands: string[];
  mutedCategories: string[];
  allowExploration: boolean;
  explorationRatio: number;
}

export interface ReRankResult {
  originalOrder: string[];
  rerankedOrder: string[];
  reasonCodes: Record<string, string>;
  sessionFeatures: Record<string, number>;
}

export interface EmailTopPick {
  productId: string;
  title: string;
  price: number;
  heroCopy: string;
  sendWindow: string;
}


