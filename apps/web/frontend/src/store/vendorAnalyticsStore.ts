/**
 * Vendor Analytics Store
 * Sprint 10: Complete analytics & BI state management
 */

import { create } from 'zustand';
import type {
  AnalyticsPeriod,
  AnalyticsSummary,
  RevenueAnalytics,
  ProductPerformanceAnalytics,
  ReturnsAnalytics,
  CohortAnalytics,
  Forecast,
  ForecastAlert,
  VendorHealthScore,
  AIInsight,
  WeeklySummary,
  AnalyticsAlert,
  PricingIntelligence,
  PayoutAnalytics,
} from '../types/vendorAnalytics';
import type { ModelCard, DriftStatus, AuditLogEntry } from '../types/governance';

interface VendorAnalyticsState {
  // Selected Period
  selectedPeriod: AnalyticsPeriod;
  customDateRange: {
    from: string;
    to: string;
  } | null;
  
  // Summary Data
  summary: AnalyticsSummary | null;
  
  // Detailed Analytics
  revenueAnalytics: RevenueAnalytics | null;
  productPerformance: ProductPerformanceAnalytics | null;
  returnsAnalytics: ReturnsAnalytics | null;
  cohortAnalytics: CohortAnalytics | null;
  payoutAnalytics: PayoutAnalytics | null;
  
  // ML & AI
  forecasts: Record<string, Forecast>; // key: metric
  forecastAlerts: ForecastAlert[];
  healthScore: VendorHealthScore | null;
  aiInsights: AIInsight[];
  weeklySummary: WeeklySummary | null;
  
  // Pricing Intelligence
  pricingIntelligence: Record<string, PricingIntelligence>; // key: product_id

  // Governance
  modelCards: ModelCard[];
  driftStatus: DriftStatus[];
  auditLog: AuditLogEntry[];
  
  // Alerts
  alerts: AnalyticsAlert[];
  unacknowledgedAlertsCount: number;
  
  // UI State
  isLoading: boolean;
  isLoadingForecast: boolean;
  error: string | null;
  
  // Actions - Period Selection
  setPeriod: (period: AnalyticsPeriod) => void;
  setCustomDateRange: (from: string, to: string) => void;
  
  // Actions - Data
  setSummary: (summary: AnalyticsSummary) => void;
  setRevenueAnalytics: (analytics: RevenueAnalytics) => void;
  setProductPerformance: (analytics: ProductPerformanceAnalytics) => void;
  setReturnsAnalytics: (analytics: ReturnsAnalytics) => void;
  setCohortAnalytics: (analytics: CohortAnalytics) => void;
  setPayoutAnalytics: (analytics: PayoutAnalytics) => void;
  
  // Actions - ML & AI
  setForecast: (metric: string, forecast: Forecast) => void;
  setForecastAlerts: (alerts: ForecastAlert[]) => void;
  setHealthScore: (score: VendorHealthScore) => void;
  setAIInsights: (insights: AIInsight[]) => void;
  addAIInsight: (insight: AIInsight) => void;
  dismissInsight: (id: string) => void;
  setWeeklySummary: (summary: WeeklySummary) => void;
  
  // Actions - Pricing
  setPricingIntelligence: (productId: string, intelligence: PricingIntelligence) => void;

  // Actions - Governance
  setModelCards: (cards: ModelCard[]) => void;
  setDriftStatus: (status: DriftStatus[]) => void;
  setAuditLog: (entries: AuditLogEntry[]) => void;
  
  // Actions - Alerts
  setAlerts: (alerts: AnalyticsAlert[]) => void;
  acknowledgeAlert: (id: string) => void;
  recalculateUnacknowledgedCount: () => void;
  
  // Actions - UI State
  setLoading: (loading: boolean) => void;
  setLoadingForecast: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVendorAnalyticsStore = create<VendorAnalyticsState>()((set, get) => ({
  // Initial State
  selectedPeriod: '30d',
  customDateRange: null,
  
  summary: null,
  revenueAnalytics: null,
  productPerformance: null,
  returnsAnalytics: null,
  cohortAnalytics: null,
  payoutAnalytics: null,
  
  forecasts: {},
  forecastAlerts: [],
  healthScore: null,
  aiInsights: [],
  weeklySummary: null,
  
  pricingIntelligence: {},

  modelCards: [],
  driftStatus: [],
  auditLog: [],
  
  alerts: [],
  unacknowledgedAlertsCount: 0,
  
  isLoading: false,
  isLoadingForecast: false,
  error: null,
  
  // Period Actions
  setPeriod: (period) => {
    set({ selectedPeriod: period });
    if (period !== 'custom') {
      set({ customDateRange: null });
    }
  },
  
  setCustomDateRange: (from, to) => {
    set({
      selectedPeriod: 'custom',
      customDateRange: { from, to },
    });
  },
  
  // Data Actions
  setSummary: (summary) => set({ summary }),
  setRevenueAnalytics: (analytics) => set({ revenueAnalytics: analytics }),
  setProductPerformance: (analytics) => set({ productPerformance: analytics }),
  setReturnsAnalytics: (analytics) => set({ returnsAnalytics: analytics }),
  setCohortAnalytics: (analytics) => set({ cohortAnalytics: analytics }),
  setPayoutAnalytics: (analytics) => set({ payoutAnalytics: analytics }),
  
  // ML & AI Actions
  setForecast: (metric, forecast) =>
    set((state) => ({
      forecasts: { ...state.forecasts, [metric]: forecast },
    })),
  
  setForecastAlerts: (alerts) => set({ forecastAlerts: alerts }),
  
  setHealthScore: (score) => set({ healthScore: score }),
  
  setAIInsights: (insights) => set({ aiInsights: insights }),
  
  addAIInsight: (insight) =>
    set((state) => ({
      aiInsights: [insight, ...state.aiInsights],
    })),
  
  dismissInsight: (id) =>
    set((state) => ({
      aiInsights: state.aiInsights.map((insight) =>
        insight.id === id ? { ...insight, is_dismissed: true } : insight
      ),
    })),
  
  setWeeklySummary: (summary) => set({ weeklySummary: summary }),
  
  // Pricing Actions
  setPricingIntelligence: (productId, intelligence) =>
    set((state) => ({
      pricingIntelligence: { ...state.pricingIntelligence, [productId]: intelligence },
    })),

  setModelCards: (cards) => set({ modelCards: cards }),
  setDriftStatus: (status) => set({ driftStatus: status }),
  setAuditLog: (entries) => set({ auditLog: entries }),
  
  // Alerts Actions
  setAlerts: (alerts) => {
    set({ alerts });
    get().recalculateUnacknowledgedCount();
  },
  
  acknowledgeAlert: (id) =>
    set((state) => {
      const newAlerts = state.alerts.map((alert) =>
        alert.id === id
          ? { ...alert, is_acknowledged: true, acknowledged_at: new Date().toISOString() }
          : alert
      );
      const unacked = newAlerts.filter((a) => !a.is_acknowledged).length;
      return { alerts: newAlerts, unacknowledgedAlertsCount: unacked };
    }),
  
  recalculateUnacknowledgedCount: () => {
    const state = get();
    const count = state.alerts.filter((a) => !a.is_acknowledged).length;
    set({ unacknowledgedAlertsCount: count });
  },
  
  // UI State Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setLoadingForecast: (loading) => set({ isLoadingForecast: loading }),
  setError: (error) => set({ error }),
  
  reset: () =>
    set({
      selectedPeriod: '30d',
      customDateRange: null,
      summary: null,
      revenueAnalytics: null,
      productPerformance: null,
      returnsAnalytics: null,
      cohortAnalytics: null,
      payoutAnalytics: null,
      forecasts: {},
      forecastAlerts: [],
      healthScore: null,
      aiInsights: [],
      weeklySummary: null,
      pricingIntelligence: {},
      modelCards: [],
      driftStatus: [],
      auditLog: [],
      alerts: [],
      unacknowledgedAlertsCount: 0,
      isLoading: false,
      isLoadingForecast: false,
      error: null,
    }),
}));

