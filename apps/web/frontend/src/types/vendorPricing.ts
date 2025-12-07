export type PricingStrategy = 'balanced' | 'growth' | 'margin';

export interface PricingGuardrails {
  min_price: number;
  max_price: number;
  max_discount_pct: number;
  min_margin_pct: number;
}

export interface PricingScenario {
  price: number;
  price_delta_pct: number;
  demand_change_pct: number;
  revenue_change_pct: number;
  margin_pct: number;
}

export interface PricingRecommendation {
  product_id: string;
  vendor_id: string;
  current_price: number;
  currency: string;
  recommended_price: number;
  suggested_adjustment_pct: number;
  expected_demand_change_pct: number;
  expected_revenue_change_pct: number;
  expected_margin_change_pct: number;
  confidence: number;
  strategy: PricingStrategy;
  elasticity_estimate: number;
  guardrails: PricingGuardrails;
  signals: {
    conversion_rate: number;
    return_rate: number;
    stock_velocity: number;
  };
  scenarios: PricingScenario[];
  explanation: string;
  recommended_actions: string[];
  model_version: string;
}

export interface DiscountSimulationResult {
  product_id: string;
  base_price: number;
  cost_price: number;
  discount_pct: number;
  new_price: number;
  estimated_demand_change_pct: number;
  estimated_revenue_change_pct: number;
  margin_delta_pct: number;
  confidence: number;
  explanation: string;
}

export interface DemandForecastPoint {
  date: string;
  value: number;
  lower_bound: number;
  upper_bound: number;
}

export interface DemandScenario {
  delta_pct: number;
  projected_demand: number;
  revenue_index: number;
  inventory_risk: 'high' | 'balanced' | 'tight';
}

export interface ProductForecastRecommendation {
  recommended_restock_units: number;
  demand_next_7d: number;
  action: string;
  confidence: number;
}

export interface ProductForecast {
  product_id: string;
  forecast: DemandForecastPoint[];
  algo: string;
  horizon: number;
  generated_at: string;
  scenarios: DemandScenario[];
  recommendation: ProductForecastRecommendation;
  model_versions: Record<string, string>;
}


