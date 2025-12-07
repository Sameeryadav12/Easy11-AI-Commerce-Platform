import axios from 'axios';
import type { Recommendation, RecommendationResponse } from '../types';

const DEFAULT_BASE_URL = 'http://localhost:8000';
const ML_BASE_URL = import.meta.env.VITE_ML_SERVICE_URL || DEFAULT_BASE_URL;
const ENDPOINT = `${ML_BASE_URL.replace(/\/$/, '')}/api/v1/recommendations`;

const transformRecommendation = (payload: any): Recommendation => ({
  productId: payload.product_id,
  score: payload.score,
  reason: payload.reason,
  explanation: payload.explanation,
  metadata: {
    title: payload.metadata?.title ?? 'Recommended Product',
    subtitle: payload.metadata?.subtitle,
    price: payload.metadata?.price ?? 0,
    currency: payload.metadata?.currency ?? 'USD',
    image: payload.metadata?.image,
    category: payload.metadata?.category,
    tags: payload.metadata?.tags ?? [],
    badges: payload.metadata?.badges ?? [],
    product_url: payload.metadata?.product_url,
  },
});

const fallbackRecommendations: Recommendation[] = [
  {
    productId: 'prod-fallback-sound',
    score: 0.72,
    reason: 'Popular with similar shoppers',
    explanation: 'Fallback recommendation served while ML service is unavailable.',
    metadata: {
      title: 'Compact Smart Speaker',
      subtitle: 'Voice assistant built-in with adaptive EQ',
      price: 149,
      currency: 'USD',
      image: '🔊',
      category: 'Electronics',
      tags: ['smart-home', 'audio'],
      badges: ['Fast delivery'],
      product_url: '/products/prod-fallback-sound',
    },
  },
  {
    productId: 'prod-fallback-wellness',
    score: 0.69,
    reason: 'Keep your wellness streak going',
    explanation: 'Fallback recommendation served while ML service is unavailable.',
    metadata: {
      title: 'Serenity Yoga Mat',
      subtitle: 'Dual texture mat with recycled materials',
      price: 79,
      currency: 'USD',
      image: '🧘',
      category: 'Wellness',
      tags: ['mindfulness', 'home-gym'],
      badges: ['Eco choice'],
      product_url: '/products/prod-fallback-wellness',
    },
  },
];

export const fetchRecommendations = async (
  userId: string,
  limit = 8,
  algo: 'hybrid' | 'als' | 'lightfm' = 'hybrid'
): Promise<RecommendationResponse> => {
  try {
    const response = await axios.get(ENDPOINT, {
      params: { user_id: userId, limit, algo },
      timeout: 4000,
    });

    const data = response.data;
    const recommendations: Recommendation[] = Array.isArray(data.recommendations)
      ? data.recommendations.map(transformRecommendation)
      : [];

    return {
      userId: data.user_id ?? userId,
      algo: data.algo ?? algo,
      modelVersion: data.model_version ?? 'v2.0.0',
      generatedAt: data.generated_at ?? new Date().toISOString(),
      metrics: data.metrics ?? {},
      recommendations: recommendations.length > 0 ? recommendations : fallbackRecommendations,
    };
  } catch (error) {
    console.warn('[recommendationsAPI] Falling back to static recommendations', error);
    return {
      userId,
      algo,
      modelVersion: 'fallback',
      generatedAt: new Date().toISOString(),
      metrics: {},
      recommendations: fallbackRecommendations,
    };
  }
};

const recommendationsAPI = {
  fetchRecommendations,
};

export default recommendationsAPI;

