import { create } from 'zustand';
import type { Recommendation } from '../types';
import recommendationsAPI from '../services/recommendationsAPI';

interface RecommendationState {
  items: Recommendation[];
  isLoading: boolean;
  error: string | null;
  algo: 'hybrid' | 'als' | 'lightfm';
  modelVersion: string | null;
  metrics: Record<string, unknown>;
  lastUpdated: string | null;
  fetchRecommendations: (userId: string, limit?: number, algo?: 'hybrid' | 'als' | 'lightfm') => Promise<void>;
  clear: () => void;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  items: [],
  isLoading: false,
  error: null,
  algo: 'hybrid',
  modelVersion: null,
  metrics: {},
  lastUpdated: null,

  fetchRecommendations: async (userId, limit = 8, algo = 'hybrid') => {
    set({ isLoading: true, error: null });
    try {
      const response = await recommendationsAPI.fetchRecommendations(userId, limit, algo);
      set({
        items: response.recommendations,
        isLoading: false,
        algo: response.algo as 'hybrid' | 'als' | 'lightfm',
        modelVersion: response.modelVersion,
        metrics: response.metrics,
        lastUpdated: response.generatedAt,
      });
    } catch (error) {
      set({
        error: 'Unable to load personalized recommendations right now.',
        isLoading: false,
      });
    }
  },

  clear: () =>
    set({
      items: [],
      error: null,
      lastUpdated: null,
    }),
}));

export default useRecommendationStore;

