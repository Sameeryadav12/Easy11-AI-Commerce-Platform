/**
 * Growth & Experimentation Store
 * Sprint 12: Growth loops, A/B testing, referrals
 */

import { create } from 'zustand';
import type {
  ReferralProgram,
  ReferralInvite,
  ReferralLeaderboard,
  Experiment,
  ExperimentResults,
  FeatureFlag,
  Survey,
  FeedbackSummary,
  GrowthLoop,
} from '../types/growth';

interface GrowthState {
  // Referrals
  referralProgram: ReferralProgram | null;
  referralInvites: ReferralInvite[];
  leaderboard: ReferralLeaderboard | null;
  
  // Experiments
  experiments: Experiment[];
  activeExperiments: Experiment[];
  userExperiments: Record<string, string>; // experimentKey -> variantId
  
  // Feature Flags
  featureFlags: Record<string, boolean>;
  
  // Surveys
  surveys: Survey[];
  feedbackSummary: FeedbackSummary | null;
  
  // Growth Loops
  growthLoops: GrowthLoop[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions - Referrals
  setReferralProgram: (program: ReferralProgram) => void;
  setReferralInvites: (invites: ReferralInvite[]) => void;
  setLeaderboard: (leaderboard: ReferralLeaderboard) => void;
  
  // Actions - Experiments
  setExperiments: (experiments: Experiment[]) => void;
  setUserVariant: (experimentKey: string, variantId: string) => void;
  getVariant: (experimentKey: string) => string | null;
  
  // Actions - Feature Flags
  setFeatureFlags: (flags: Record<string, boolean>) => void;
  isFeatureEnabled: (flagKey: string) => boolean;
  
  // Actions - Surveys
  setSurveys: (surveys: Survey[]) => void;
  setFeedbackSummary: (summary: FeedbackSummary) => void;
  
  // Actions - Growth Loops
  setGrowthLoops: (loops: GrowthLoop[]) => void;
  
  // Actions - UI State
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useGrowthStore = create<GrowthState>()((set, get) => ({
  // Initial State
  referralProgram: null,
  referralInvites: [],
  leaderboard: null,
  
  experiments: [],
  activeExperiments: [],
  userExperiments: {},
  
  featureFlags: {},
  
  surveys: [],
  feedbackSummary: null,
  
  growthLoops: [],
  
  isLoading: false,
  error: null,
  
  // Referral Actions
  setReferralProgram: (program) => set({ referralProgram: program }),
  setReferralInvites: (invites) => set({ referralInvites: invites }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  
  // Experiment Actions
  setExperiments: (experiments) => {
    const active = experiments.filter((e) => e.status === 'running');
    set({ experiments, activeExperiments: active });
  },
  
  setUserVariant: (experimentKey, variantId) =>
    set((state) => ({
      userExperiments: { ...state.userExperiments, [experimentKey]: variantId },
    })),
  
  getVariant: (experimentKey) => {
    const state = get();
    return state.userExperiments[experimentKey] || null;
  },
  
  // Feature Flag Actions
  setFeatureFlags: (flags) => set({ featureFlags: flags }),
  
  isFeatureEnabled: (flagKey) => {
    const state = get();
    return state.featureFlags[flagKey] || false;
  },
  
  // Survey Actions
  setSurveys: (surveys) => set({ surveys }),
  setFeedbackSummary: (summary) => set({ feedbackSummary: summary }),
  
  // Growth Loop Actions
  setGrowthLoops: (loops) => set({ growthLoops: loops }),
  
  // UI State Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  reset: () =>
    set({
      referralProgram: null,
      referralInvites: [],
      leaderboard: null,
      experiments: [],
      activeExperiments: [],
      userExperiments: {},
      featureFlags: {},
      surveys: [],
      feedbackSummary: null,
      growthLoops: [],
      isLoading: false,
      error: null,
    }),
}));

