/**
 * Marketing & Campaigns Store
 * Sprint 11: Unified growth platform state management
 */

import { create } from 'zustand';
import type {
  Campaign,
  CampaignMetrics,
  AudienceSegment,
  AttributionModel,
  UnifiedAnalyticsSummary,
  ChannelPerformance,
  GrowthMetrics,
  LaunchPhase,
  BlogPost,
  AIContentRequest,
  AIContentResponse,
} from '../types/marketing';
import { generateAIContent as generateAIContentAPI } from '../services/marketingAPI';

interface MarketingState {
  // Campaigns
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  audienceSegments: AudienceSegment[];
  
  // Attribution
  attributionModels: AttributionModel[];
  channelPerformance: ChannelPerformance[];
  
  // Unified Analytics
  unifiedSummary: UnifiedAnalyticsSummary | null;
  growthMetrics: GrowthMetrics | null;
  
  // Launch
  launchPhases: LaunchPhase[];
  currentPhase: LaunchPhase | null;
  
  // Content
  blogPosts: BlogPost[];
  aiGeneratedContent: AIContentResponse | null;
  
  // UI State
  isLoading: boolean;
  isGeneratingContent: boolean;
  error: string | null;
  
  // Actions - Campaigns
  setCampaigns: (campaigns: Campaign[]) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  setSelectedCampaign: (campaign: Campaign | null) => void;
  
  // Actions - Audience
  setAudienceSegments: (segments: AudienceSegment[]) => void;
  addAudienceSegment: (segment: AudienceSegment) => void;
  
  // Actions - Attribution
  setAttributionModels: (models: AttributionModel[]) => void;
  setChannelPerformance: (performance: ChannelPerformance[]) => void;
  
  // Actions - Analytics
  setUnifiedSummary: (summary: UnifiedAnalyticsSummary) => void;
  setGrowthMetrics: (metrics: GrowthMetrics) => void;
  
  // Actions - Launch
  setLaunchPhases: (phases: LaunchPhase[]) => void;
  setCurrentPhase: (phase: LaunchPhase | null) => void;
  updatePhaseProgress: (phaseNumber: number, completionPercentage: number) => void;
  
  // Actions - Content
  setBlogPosts: (posts: BlogPost[]) => void;
  addBlogPost: (post: BlogPost) => void;
  setAIGeneratedContent: (content: AIContentResponse | null) => void;
  
  // Actions - UI State
  setLoading: (loading: boolean) => void;
  setGeneratingContent: (generating: boolean) => void;
  setError: (error: string | null) => void;
  generateAIContent: (request: AIContentRequest) => Promise<void>;
  reset: () => void;
}

export const useMarketingStore = create<MarketingState>()((set, get) => ({
  // Initial State
  campaigns: [],
  selectedCampaign: null,
  audienceSegments: [],
  
  attributionModels: [],
  channelPerformance: [],
  
  unifiedSummary: null,
  growthMetrics: null,
  
  launchPhases: [],
  currentPhase: null,
  
  blogPosts: [],
  aiGeneratedContent: null,
  
  isLoading: false,
  isGeneratingContent: false,
  error: null,
  
  // Campaign Actions
  setCampaigns: (campaigns) => set({ campaigns }),
  
  addCampaign: (campaign) =>
    set((state) => ({
      campaigns: [campaign, ...state.campaigns],
    })),
  
  updateCampaign: (id, updates) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  
  deleteCampaign: (id) =>
    set((state) => ({
      campaigns: state.campaigns.filter((c) => c.id !== id),
    })),
  
  setSelectedCampaign: (campaign) => set({ selectedCampaign: campaign }),
  
  // Audience Actions
  setAudienceSegments: (segments) => set({ audienceSegments: segments }),
  
  addAudienceSegment: (segment) =>
    set((state) => ({
      audienceSegments: [...state.audienceSegments, segment],
    })),
  
  // Attribution Actions
  setAttributionModels: (models) => set({ attributionModels: models }),
  setChannelPerformance: (performance) => set({ channelPerformance: performance }),
  
  // Analytics Actions
  setUnifiedSummary: (summary) => set({ unifiedSummary: summary }),
  setGrowthMetrics: (metrics) => set({ growthMetrics: metrics }),
  
  // Launch Actions
  setLaunchPhases: (phases) => set({ launchPhases: phases }),
  setCurrentPhase: (phase) => set({ currentPhase: phase }),
  
  updatePhaseProgress: (phaseNumber, completionPercentage) =>
    set((state) => ({
      launchPhases: state.launchPhases.map((phase) =>
        phase.phase_number === phaseNumber
          ? { ...phase, completion_percentage: completionPercentage }
          : phase
      ),
    })),
  
  // Content Actions
  setBlogPosts: (posts) => set({ blogPosts: posts }),
  
  addBlogPost: (post) =>
    set((state) => ({
      blogPosts: [post, ...state.blogPosts],
    })),
  
  setAIGeneratedContent: (content) => set({ aiGeneratedContent: content }),
  
  // UI State Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setGeneratingContent: (generating) => set({ isGeneratingContent: generating }),
  setError: (error) => set({ error }),

  generateAIContent: async (request) => {
    set({ isGeneratingContent: true, error: null });
    try {
      const content = await generateAIContentAPI(request);
      set({
        aiGeneratedContent: content,
        isGeneratingContent: false,
      });
    } catch (error) {
      console.error('[MarketingStore] Failed to generate content', error);
      set({
        error: 'Unable to generate content right now. Please try again shortly.',
        isGeneratingContent: false,
      });
    }
  },
  
  reset: () =>
    set({
      campaigns: [],
      selectedCampaign: null,
      audienceSegments: [],
      attributionModels: [],
      channelPerformance: [],
      unifiedSummary: null,
      growthMetrics: null,
      launchPhases: [],
      currentPhase: null,
      blogPosts: [],
      aiGeneratedContent: null,
      isLoading: false,
      isGeneratingContent: false,
      error: null,
    }),
}));

