import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  fetchProductCommunity,
  fetchCommunityHub,
  type ProductCommunityResponse,
} from '../services/communityAPI';
import type {
  Review,
  ReviewSummary,
  Question,
  CommunityHubPayload,
  UGCLook,
  Contribution,
} from '../types/community';

interface CommunityState {
  productId: string | null;
  isLoading: boolean;
  error: string | null;

  reviews: Review[];
  reviewSummary: ReviewSummary | null;
  questions: Question[];
  gallery: UGCLook[];
  contributions: Contribution[];

  hub: CommunityHubPayload | null;
  hubLoading: boolean;

  helpfulVoteHistory: Record<string, 'up' | 'down'>;

  fetchForProduct: (productId: string) => Promise<void>;
  fetchHub: () => Promise<void>;
  voteReviewHelpful: (reviewId: string, direction: 'up' | 'down') => void;
}

const initialState: Omit<CommunityState, 'fetchForProduct' | 'fetchHub' | 'voteReviewHelpful'> = {
  productId: null,
  isLoading: false,
  error: null,
  reviews: [],
  reviewSummary: null,
  questions: [],
  gallery: [],
  contributions: [],
  hub: null,
  hubLoading: false,
  helpfulVoteHistory: {},
};

const applyProductCommunity = (
  state: CommunityState,
  productId: string,
  payload: ProductCommunityResponse
) => ({
  ...state,
  productId,
  reviews: payload.reviews,
  reviewSummary: payload.reviewSummary,
  questions: payload.questions,
  gallery: payload.gallery,
  contributions: payload.contributions ?? [],
  isLoading: false,
  error: null,
});

export const useCommunityStore = create<CommunityState>()(
  devtools((set, get) => ({
    ...initialState,

    fetchForProduct: async (productId) => {
      const { productId: currentId, isLoading } = get();
      if (isLoading && currentId === productId) {
        return;
      }

      set({ isLoading: true, error: null });
      try {
        const response = await fetchProductCommunity(productId);
        set((state) => applyProductCommunity(state, productId, response));
      } catch (error) {
        console.error('[CommunityStore] Unable to fetch product community data', error);
        set({
          isLoading: false,
          error: 'We could not load community data right now. Showing cached info.',
        });
      }
    },

    fetchHub: async () => {
      const { hub, hubLoading } = get();
      if (hubLoading) return;
      if (hub) return;

      set({ hubLoading: true });
      try {
        const payload = await fetchCommunityHub();
        set({ hub: payload, hubLoading: false });
      } catch (error) {
        console.error('[CommunityStore] Unable to fetch community hub', error);
        set({ hubLoading: false });
      }
    },

    voteReviewHelpful: (reviewId, direction) => {
      const { helpfulVoteHistory, reviews } = get();
      const previousVote = helpfulVoteHistory[reviewId];
      if (previousVote === direction) {
        return;
      }

      set({
        reviews: reviews.map((review) => {
          if (review.id !== reviewId) return review;
          let { helpfulCount, notHelpfulCount } = review;

          if (direction === 'up') {
            helpfulCount += 1;
            if (previousVote === 'down') {
              notHelpfulCount = Math.max(0, notHelpfulCount - 1);
            }
          } else {
            notHelpfulCount += 1;
            if (previousVote === 'up') {
              helpfulCount = Math.max(0, helpfulCount - 1);
            }
          }

          return {
            ...review,
            helpfulCount,
            notHelpfulCount,
          };
        }),
        helpfulVoteHistory: {
          ...helpfulVoteHistory,
          [reviewId]: direction,
        },
      });
    },
  }))
);


