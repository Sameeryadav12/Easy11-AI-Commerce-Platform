import axios from 'axios';
import type {
  PricingRecommendation,
  DiscountSimulationResult,
  ProductForecast,
  PricingStrategy,
} from '../types/vendorPricing';
import type { VendorProduct } from '../types/vendor';

const DEFAULT_BASE_URL = 'http://localhost:8000';
const ML_BASE_URL = import.meta.env.VITE_ML_SERVICE_URL || DEFAULT_BASE_URL;
const BASE = ML_BASE_URL.replace(/\/$/, '');

const pricingEndpoint = `${BASE}/api/v1/pricing`;
const forecastEndpoint = `${BASE}/api/v1/forecast`;

const api = axios.create({
  timeout: 5000,
});

interface PriceRecommendationPayload {
  product_id: string;
  current_price: number;
  cost_price?: number;
  vendor_id?: string;
  strategy?: PricingStrategy;
  currency?: string;
}

export const getPriceRecommendation = async (payload: PriceRecommendationPayload) => {
  const response = await api.post<PricingRecommendation>(`${pricingEndpoint}/recommendation`, {
    ...payload,
    strategy: payload.strategy ?? 'balanced',
    currency: payload.currency ?? 'USD',
  });
  return response.data;
};

export const getBulkPriceRecommendations = async (
  items: PriceRecommendationPayload[],
  vendorId?: string,
  strategy: PricingStrategy = 'balanced'
) => {
  const response = await api.post<{ count: number; recommendations: PricingRecommendation[] }>(
    `${pricingEndpoint}/bulk`,
    {
      vendor_id: vendorId,
      items,
      strategy,
    }
  );
  return response.data;
};

export const simulateDiscount = async (params: {
  product_id: string;
  base_price: number;
  cost_price: number;
  discount_pct: number;
  strategy?: PricingStrategy;
}) => {
  const response = await api.post<DiscountSimulationResult>(`${pricingEndpoint}/simulate-discount`, {
    ...params,
    strategy: params.strategy ?? 'balanced',
  });
  return response.data;
};

export const getProductForecast = async (productId: string, horizon = 30) => {
  const response = await api.post<ProductForecast>(`${forecastEndpoint}/product/${productId}`, {
    horizon,
    algo: 'prophet',
  });
  return response.data;
};

export const getDemandForecast = async (horizon = 30) => {
  const response = await api.post(`${forecastEndpoint}/demand`, { horizon, algo: 'prophet' });
  return response.data;
};

export const vendorOptimizationAPI = {
  getPriceRecommendation,
  getBulkPriceRecommendations,
  simulateDiscount,
  getProductForecast,
  getDemandForecast,
};

export default vendorOptimizationAPI;

