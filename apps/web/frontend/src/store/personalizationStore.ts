import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  PersonalizationContext,
  PersonalizedSection,
  ReRankResult,
  PersonalizationSettings,
} from '../types/personalization';
import personalizationAPI from '../services/personalizationAPI';

interface PersonalizationState {
  homeSections: PersonalizedSection[];
  pdpSection: PersonalizedSection | null;
  rerankResult: ReRankResult | null;
  settings: PersonalizationSettings | null;
  isLoading: boolean;
  error: string | null;
  fetchHomeSections: (context: PersonalizationContext) => Promise<void>;
  fetchPDPSection: (productId: string, context: PersonalizationContext) => Promise<void>;
  rerankProducts: (
    productIds: string[],
    context: PersonalizationContext,
  ) => Promise<ReRankResult | null>;
  loadSettings: () => Promise<void>;
  updateSettings: (settings: PersonalizationSettings) => Promise<void>;
  clearError: () => void;
}

const initialState = {
  homeSections: [],
  pdpSection: null,
  rerankResult: null,
  settings: null,
  isLoading: false,
  error: null,
} satisfies Omit<PersonalizationState, keyof PersonalizationState>;

export const usePersonalizationStore = create<PersonalizationState>()(
  devtools((set, get) => ({
    ...initialState,

    fetchHomeSections: async (context) => {
      set({ isLoading: true, error: null });
      try {
        const sections = await personalizationAPI.fetchHomeExperience(context);
        set({ homeSections: sections });
        await personalizationAPI.trackPersonalizationEvent('home_sections_loaded', {
          sessionId: context.sessionId,
          sectionCount: sections.length,
        });
      } catch (error) {
        console.error('[PersonalizationStore] Home fetch failed', error);
        set({ error: 'We could not personalize the feed. Showing curated picks instead.' });
      } finally {
        set({ isLoading: false });
      }
    },

    fetchPDPSection: async (productId, context) => {
      set({ isLoading: true, error: null });
      try {
        const section = await personalizationAPI.fetchPDPCompletion(productId, context);
        set({ pdpSection: section });
      } catch (error) {
        console.error('[PersonalizationStore] PDP section failed', error);
        set({ error: 'Personalized bundles unavailable. Try again soon.' });
      } finally {
        set({ isLoading: false });
      }
    },

    rerankProducts: async (productIds, context) => {
      try {
        const result = await personalizationAPI.fetchPLPRerank(productIds, context);
        set({ rerankResult: result });
        return result;
      } catch (error) {
        console.error('[PersonalizationStore] Rerank failed', error);
        set({ error: 'Using standard sort order while we reset personalization.' });
        return null;
      }
    },

    loadSettings: async () => {
      try {
        const settings = await personalizationAPI.fetchPersonalizationSettings();
        set({ settings });
      } catch (error) {
        console.error('[PersonalizationStore] Load settings failed', error);
        set({ error: 'Unable to load your personalization preferences.' });
      }
    },

    updateSettings: async (settings) => {
      try {
        const updated = await personalizationAPI.updatePersonalizationSettings(settings);
        set({ settings: updated });
        await personalizationAPI.trackPersonalizationEvent('personalization_settings_updated', {
          exploration: updated.explorationRatio,
        });
      } catch (error) {
        console.error('[PersonalizationStore] Update settings failed', error);
        set({ error: 'Could not update preferences. Please retry.' });
      }
    },

    clearError: () => set({ error: null }),
  })),
);

export default usePersonalizationStore;


