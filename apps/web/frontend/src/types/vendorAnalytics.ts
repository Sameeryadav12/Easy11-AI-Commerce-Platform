/**
 * Vendor Analytics & Revenue Insights Types
 * Sprint 10: Complete BI system with ML forecasting
 */

// ==================== Analytics Summary ====================

export type AnalyticsPeriod = '7d' | '30d' | '90d' | '1y' | 'all' | 'custom';

export interface AnalyticsSummary {
  vendor_id: string;
  period: AnalyticsPeriod;
  date_from: string;
  date_to: string;
  
  // Revenue Metrics
  revenue: {
    gmv: number; // Gross Merchandise Value
    net_revenue: number; // After refunds
    cost: number;
    profit: number;
    profit_margin_percentage: number;
    change_vs_previous_period: number; // %
  };
  
  // Order Metrics
  orders: {
    total_count: number;
    avg_order_value: number;
    items_per_order: number;
    change_vs_previous_period: number; // %
  };
  
  // Conversion Metrics
  conversion: {
    views: number;
    clicks: number;
    orders: number;
    click_rate: number; // %
    conversion_rate: number; // %
    change_vs_previous_period: number; // %
  };
  
  // Refund Metrics
  refunds: {
    total_count: number;
    total_amount: number;
    refund_rate: number; // %
    avg_refund_amount: number;
    change_vs_previous_period: number; // %
  };
  
  // Fulfillment SLA
  sla: {
    avg_acknowledge_time_hours: number;
    avg_ship_time_hours: number;
    on_time_ship_rate: number; // %
    late_shipments_count: number;
  };
  
  // Vendor Health Score
  health_score: number; // 0-100
  health_factors: {
    fulfillment: number;
    customer_satisfaction: number;
    product_quality: number;
    compliance: number;
  };
  
  last_updated: string;
}

// ==================== Revenue Analytics ====================

export interface RevenueAnalytics {
  vendor_id: string;
  period: AnalyticsPeriod;
  
  // Time Series
  revenue_over_time: TimeSeriesDataPoint[];
  profit_over_time: TimeSeriesDataPoint[];
  
  // Breakdown by Category
  revenue_by_category: CategoryBreakdown[];
  
  // Breakdown by Channel
  revenue_by_channel: {
    channel: 'website' | 'mobile_app' | 'marketplace';
    revenue: number;
    percentage: number;
  }[];
  
  // Top Products by Revenue
  top_products: {
    product_id: string;
    product_name: string;
    revenue: number;
    units_sold: number;
    profit: number;
  }[];
  
  // Geographic Breakdown
  revenue_by_region: {
    region: string;
    revenue: number;
    orders: number;
    percentage: number;
  }[];
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface CategoryBreakdown {
  category: string;
  revenue: number;
  orders: number;
  profit: number;
  percentage: number;
}

// ==================== Product Performance ====================

export interface ProductPerformanceAnalytics {
  vendor_id: string;
  period: AnalyticsPeriod;
  
  // All Products Summary
  total_products: number;
  active_products: number;
  top_performer_id: string;
  worst_performer_id: string;
  
  // Products List with Metrics
  products: ProductPerformanceMetric[];
  
  // Aggregates
  avg_conversion_rate: number;
  avg_return_rate: number;
  avg_rating: number;
}

export interface ProductPerformanceMetric {
  product_id: string;
  product_name: string;
  product_image: string;
  category: string;
  
  // Traffic
  views: number;
  clicks: number;
  click_rate: number; // %
  
  // Sales
  units_sold: number;
  revenue: number;
  conversion_rate: number; // %
  
  // Inventory
  current_stock: number;
  stock_velocity: number; // Units/day
  days_until_out: number;
  
  // Quality
  avg_rating: number;
  reviews_count: number;
  return_rate: number; // %
  
  // Trends
  sales_trend_7d: number; // % change
  revenue_trend_30d: number; // % change
  
  // Health
  product_health_score: number; // 0-100
}

// ==================== Returns & Refund Analytics ====================

export interface ReturnsAnalytics {
  vendor_id: string;
  period: AnalyticsPeriod;
  
  // Summary
  total_returns: number;
  total_refund_amount: number;
  return_rate: number; // %
  avg_return_value: number;
  
  // Trends
  returns_over_time: TimeSeriesDataPoint[];
  
  // By Reason
  returns_by_reason: {
    reason: string;
    count: number;
    percentage: number;
    avg_refund_value: number;
  }[];
  
  // By Product
  top_returned_products: {
    product_id: string;
    product_name: string;
    return_count: number;
    return_rate: number; // %
    total_refund_value: number;
  }[];
  
  // By Condition
  returns_by_condition: {
    condition: string;
    count: number;
    percentage: number;
  }[];
  
  // Processing Metrics
  avg_approval_time_hours: number;
  avg_refund_time_hours: number;
  auto_approval_rate: number; // %
}

// ==================== Customer Cohorts ====================

export interface CohortAnalytics {
  vendor_id: string;
  
  // Cohort Matrix
  cohorts: CohortData[];
  
  // Retention Summary
  overall_retention_rate: number; // %
  avg_customer_lifetime_value: number;
  avg_purchase_frequency: number;
  
  // Churn Analysis
  churn_rate: number; // %
  at_risk_customers: number;
  churned_customers: number;
}

export interface CohortData {
  cohort_month: string; // "2025-10"
  cohort_size: number;
  
  // Retention by month
  retention_month_0: number; // %
  retention_month_1: number; // %
  retention_month_2: number; // %
  retention_month_3: number; // %
  retention_month_6: number; // %
  retention_month_12: number; // %
  
  // Revenue
  total_revenue: number;
  avg_ltv: number;
}

export interface CustomerSegment {
  segment: 'new' | 'active' | 'at_risk' | 'churned' | 'vip';
  count: number;
  percentage: number;
  avg_order_value: number;
  total_revenue: number;
}

// ==================== ML Forecasting ====================

export type ForecastMetric = 'sales' | 'revenue' | 'units' | 'refunds';
export type ForecastPeriod = '30d' | '90d' | '180d' | '365d';

export interface Forecast {
  vendor_id: string;
  metric: ForecastMetric;
  period: ForecastPeriod;
  
  // Historical Data
  historical: {
    date: string;
    actual: number;
  }[];
  
  // Predictions
  predictions: {
    date: string;
    predicted: number;
    lower_ci: number; // Confidence interval
    upper_ci: number;
  }[];
  
  // Model Info
  model_type: 'prophet' | 'xgboost' | 'arima';
  model_version: string;
  accuracy_mape: number; // Mean Absolute Percentage Error
  last_trained_at: string;
  
  // Insights
  trend: 'rising' | 'stable' | 'falling';
  seasonality_detected: boolean;
  anomalies: {
    date: string;
    expected: number;
    actual: number;
    deviation_percent: number;
  }[];
}

export interface ForecastAlert {
  id: string;
  vendor_id: string;
  
  type: 'low_stock_predicted' | 'sales_spike_expected' | 'demand_drop_warning';
  severity: 'info' | 'warning' | 'critical';
  
  metric: ForecastMetric;
  predicted_date: string;
  predicted_value: number;
  
  message: string;
  actionable_recommendation: string;
  
  created_at: string;
  acknowledged_at?: string;
}

// ==================== Pricing Intelligence ====================

export interface PricingIntelligence {
  product_id: string;
  product_name: string;
  
  // Current Pricing
  current_price: number;
  current_margin: number; // %
  
  // Competitor Analysis
  competitor_prices: {
    competitor: string;
    price: number;
    availability: 'in_stock' | 'out_of_stock';
    last_checked: string;
  }[];
  
  market_avg_price: number;
  market_min_price: number;
  market_max_price: number;
  
  // AI Recommendations
  recommended_price: number;
  price_elasticity: number; // Demand sensitivity
  optimal_price_for_volume: number;
  optimal_price_for_profit: number;
  
  // Impact Simulation
  if_reduce_10_percent: {
    expected_sales_increase: number; // %
    expected_profit_change: number; // $
  };
  
  if_increase_10_percent: {
    expected_sales_decrease: number; // %
    expected_profit_change: number; // $
  };
  
  last_updated: string;
}

// ==================== Vendor Health Score ====================

export interface VendorHealthScore {
  vendor_id: string;
  vendor_name: string;
  
  // Overall Score (0-100)
  overall_score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  
  // Factor Scores
  factors: {
    fulfillment_performance: FactorScore;
    customer_satisfaction: FactorScore;
    product_quality: FactorScore;
    compliance: FactorScore;
    financial_health: FactorScore;
  };
  
  // Benchmarks
  industry_avg_score: number;
  platform_avg_score: number;
  percentile_rank: number; // Top X%
  
  // Recommendations
  recommendations: {
    factor: string;
    current_score: number;
    target_score: number;
    action: string;
    impact: 'high' | 'medium' | 'low';
  }[];
  
  // Trend
  score_history: {
    date: string;
    score: number;
  }[];
  
  last_calculated: string;
}

export interface FactorScore {
  score: number; // 0-100
  weight: number; // Importance in overall score
  status: 'excellent' | 'good' | 'fair' | 'poor';
  metrics: {
    name: string;
    value: number;
    threshold: number;
    passed: boolean;
  }[];
}

// ==================== AI Insights ====================

export interface AIInsight {
  id: string;
  vendor_id: string;
  
  // Insight Type
  type: 
    | 'sales_trend'
    | 'product_recommendation'
    | 'pricing_opportunity'
    | 'inventory_alert'
    | 'customer_behavior'
    | 'competitive_insight';
  
  // Priority
  priority: 'high' | 'medium' | 'low';
  
  // Content
  title: string;
  summary: string;
  narrative: string; // Full AI-generated paragraph
  
  // Data
  supporting_data?: any;
  chart_data?: TimeSeriesDataPoint[];
  
  // Actions
  actionable_steps: string[];
  estimated_impact?: string; // e.g., "+$2,500 revenue/month"
  
  // Status
  is_read: boolean;
  is_dismissed: boolean;
  
  created_at: string;
  expires_at?: string;
}

export interface WeeklySummary {
  vendor_id: string;
  week_start: string;
  week_end: string;
  
  // AI-Generated Narrative
  executive_summary: string; // 2-3 paragraphs
  
  // Key Highlights
  highlights: {
    type: 'positive' | 'negative' | 'neutral';
    metric: string;
    change: number;
    message: string;
  }[];
  
  // Top Actions
  recommended_actions: {
    priority: number;
    action: string;
    reason: string;
    estimated_impact: string;
  }[];
  
  generated_at: string;
  model_version: string;
}

// ==================== Alerts & Notifications ====================

export interface AnalyticsAlert {
  id: string;
  vendor_id: string;
  
  // Alert Type
  type: 
    | 'revenue_drop'
    | 'refund_spike'
    | 'low_stock'
    | 'sla_breach'
    | 'review_drop'
    | 'fraud_increase'
    | 'competitor_price_change';
  
  // Severity
  severity: 'info' | 'warning' | 'critical';
  
  // Content
  title: string;
  message: string;
  
  // Threshold
  metric_name: string;
  current_value: number;
  threshold_value: number;
  threshold_type: 'above' | 'below';
  
  // Action
  action_url?: string;
  action_label?: string;
  
  // Status
  is_acknowledged: boolean;
  acknowledged_at?: string;
  
  created_at: string;
  expires_at?: string;
}

export interface AlertRule {
  id: string;
  vendor_id: string;
  
  name: string;
  description?: string;
  
  // Condition
  metric: string;
  threshold: number;
  comparison: 'greater_than' | 'less_than' | 'equals';
  period: AnalyticsPeriod;
  
  // Notification
  notification_channels: ('email' | 'sms' | 'push' | 'in_app')[];
  
  // Status
  is_active: boolean;
  
  created_at: string;
  updated_at: string;
}

// ==================== Reports & Exports ====================

export interface ReportExportRequest {
  id: string;
  vendor_id: string;
  
  report_type: 'orders' | 'revenue' | 'products' | 'returns' | 'payouts' | 'complete';
  
  // Filters
  date_from: string;
  date_to: string;
  filters?: any;
  
  // Format
  format: 'csv' | 'excel' | 'pdf';
  
  // Status
  status: 'queued' | 'processing' | 'completed' | 'failed';
  
  // Output
  download_url?: string;
  expires_at?: string;
  file_size_bytes?: number;
  
  // Security
  stepup_token_id?: string;
  row_count?: number;
  
  created_at: string;
  completed_at?: string;
}

export interface ReportTemplate {
  id: string;
  vendor_id: string;
  
  name: string;
  description?: string;
  
  // Configuration
  report_type: string;
  filters: any;
  columns: string[];
  sort_by?: string;
  
  // Schedule
  is_scheduled: boolean;
  schedule_frequency?: 'daily' | 'weekly' | 'monthly';
  schedule_day_of_week?: number;
  schedule_time?: string;
  
  created_at: string;
}

// ==================== Competitor Intelligence ====================

export interface CompetitorIntelligence {
  vendor_id: string;
  category: string;
  
  // Market Position
  market_share: number; // %
  rank_in_category: number;
  total_competitors: number;
  
  // Pricing Comparison
  avg_price_vs_market: number; // % difference
  products_priced_above_market: number;
  products_priced_below_market: number;
  
  // Performance vs Competitors
  conversion_rate_vs_market: number; // % difference
  avg_rating_vs_market: number;
  
  // Opportunities
  underserved_keywords: string[];
  pricing_gaps: {
    product_id: string;
    product_name: string;
    your_price: number;
    market_avg: number;
    opportunity: 'increase' | 'decrease';
    estimated_impact: string;
  }[];
  
  last_updated: string;
}

// ==================== Ask AI Feature ====================

export interface AskAIQuery {
  id: string;
  vendor_id: string;
  
  // Query
  question: string;
  
  // Response
  answer: string;
  confidence: number; // 0-100
  
  // Supporting Data
  charts?: any[];
  metrics?: any[];
  related_insights?: string[];
  
  // Feedback
  was_helpful?: boolean;
  
  created_at: string;
}

export interface AskAISuggestion {
  question: string;
  category: 'sales' | 'products' | 'customers' | 'pricing' | 'trends';
  popularity: number; // How many vendors ask this
}

// ==================== Data Warehouse Analytics ====================

export interface WarehouseMetrics {
  // Pipeline Health
  last_etl_run: string;
  next_etl_run: string;
  etl_duration_seconds: number;
  etl_status: 'success' | 'running' | 'failed';
  
  // Data Quality
  dbt_tests_passed: number;
  dbt_tests_failed: number;
  data_freshness: 'fresh' | 'stale' | 'very_stale';
  
  // Volume
  total_rows_processed: number;
  warehouse_size_gb: number;
}

// ==================== Payout Analytics ====================

export interface PayoutAnalytics {
  vendor_id: string;
  period: AnalyticsPeriod;
  
  // Summary
  total_payouts: number;
  total_payout_amount: number;
  avg_payout_amount: number;
  
  // Trends
  payouts_over_time: TimeSeriesDataPoint[];
  
  // Fee Breakdown
  total_fees: number;
  fee_breakdown: {
    type: string;
    amount: number;
    percentage: number;
  }[];
  
  // Status Distribution
  pending_amount: number;
  processing_amount: number;
  paid_amount: number;
  on_hold_amount: number;
  
  // Payment Health
  payout_reliability: number; // % on time
  avg_payout_delay_days: number;
  failed_payouts_count: number;
}

// ==================== Dashboard Configuration ====================

export interface DashboardWidget {
  id: string;
  type: 'metric_card' | 'line_chart' | 'bar_chart' | 'donut_chart' | 'table' | 'heatmap';
  title: string;
  metric: string;
  size: 'small' | 'medium' | 'large' | 'full';
  position: { x: number; y: number; w: number; h: number };
  refresh_interval_seconds?: number;
}

export interface VendorDashboardConfig {
  vendor_id: string;
  layout: 'default' | 'compact' | 'detailed' | 'custom';
  widgets: DashboardWidget[];
  default_period: AnalyticsPeriod;
  updated_at: string;
}

// ==================== API Response Types ====================

export interface AnalyticsAPIResponse<T> {
  data: T;
  meta: {
    vendor_id: string;
    period: AnalyticsPeriod;
    date_from: string;
    date_to: string;
    generated_at: string;
    cache_ttl_seconds: number;
  };
}

export interface PaginatedAnalyticsResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}

