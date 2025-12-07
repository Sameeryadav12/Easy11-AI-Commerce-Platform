import { create } from 'zustand';
import vendorOptimizationAPI from '../services/vendorOptimizationAPI';
import type { VendorProduct } from '../types/vendor';
import type {
  PricingRecommendation,
  ProductForecast,
  PricingStrategy,
} from '../types/vendorPricing';

interface VendorPricingState {
  recommendations: PricingRecommendation[];
  forecastByProduct: Record<string, ProductForecast>;
  isLoading: boolean;
  isForecastLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  fetchRecommendations: (products: VendorProduct[], vendorId?: string, strategy?: PricingStrategy) => Promise<void>;
  fetchForecast: (productId: string, horizon?: number) => Promise<ProductForecast | null>;
  reset: () => void;
}

export const useVendorPricingStore = create<VendorPricingState>((set, get) => ({
  recommendations: [],
  forecastByProduct: {},
  isLoading: false,
  isForecastLoading: false,
  error: null,
  lastUpdated: null,

  fetchRecommendations: async (products, vendorId, strategy = 'balanced') => {
    if (!products || products.length === 0) return;
    set({ isLoading: true, error: null });
    try {
      const payload = products.slice(0, 12).map((product) => ({
        product_id: product.id,
        current_price: product.price,
        cost_price: product.cost_price ?? product.price * 0.6,
        strategy,
        currency: 'USD',
      }));

      const response = await vendorOptimizationAPI.getBulkPriceRecommendations(payload, vendorId, strategy);
      set({
        recommendations: response.recommendations,
        isLoading: false,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('[VendorPricingStore] Failed to fetch recommendations', error);
      set({
        error: 'Unable to fetch pricing recommendations right now.',
        isLoading: false,
      });
    }
  },

  fetchForecast: async (productId: string, horizon = 30) => {
    if (!productId) return null;
    const existing = get().forecastByProduct[productId];
    if (existing) return existing;
    set({ isForecastLoading: true });
    try {
      const forecast = await vendorOptimizationAPI.getProductForecast(productId, horizon);
      set((state) => ({
        forecastByProduct: {
          ...state.forecastByProduct,
          [productId]: forecast,
        },
        isForecastLoading: false,
      }));
      return forecast;
    } catch (error) {
      console.warn('[VendorPricingStore] Failed to fetch forecast', error);
      set({ error: 'Unable to load demand forecast.', isForecastLoading: false });
      return null;
    }
  },

  reset: () =>
    set({
      recommendations: [],
      forecastByProduct: {},
      isLoading: false,
      isForecastLoading: false,
      error: null,
      lastUpdated: null,
    }),
}));

export default useVendorPricingStore;

