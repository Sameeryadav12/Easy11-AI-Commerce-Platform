/**
 * Growth, Referrals & Experimentation Types
 * Sprint 12: Post-launch optimization & growth loops
 */

// ==================== Referral System ====================

export interface ReferralProgram {
  id: string;
  user_id: string;
  user_type: 'customer' | 'vendor';
  
  // Referral Code
  referral_code: string; // e.g., "ABC11"
  referral_link: string; // e.g., "https://easy11.com/r/ABC11"
  qr_code_url: string;
  
  // Stats
  invites_sent: number;
  signups: number;
  conversions: number; // Completed first purchase
  conversion_rate: number; // %
  
  // Rewards
  total_rewards_earned: number;
  pending_rewards: number;
  currency: string;
  
  // Status
  is_active: boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'ambassador';
  
  created_at: string;
  updated_at: string;
}

export interface ReferralInvite {
  id: string;
  referrer_id: string;
  
  // Invitee
  invitee_email?: string;
  invitee_phone?: string;
  
  // Status
  status: 'sent' | 'clicked' | 'signed_up' | 'converted' | 'expired';
  
  // Channel
  channel: 'email' | 'sms' | 'whatsapp' | 'social' | 'link';
  
  // Rewards
  referrer_reward: number;
  invitee_reward: number;
  reward_status: 'pending' | 'paid' | 'expired';
  
  // Dates
  sent_at: string;
  clicked_at?: string;
  signed_up_at?: string;
  converted_at?: string;
  expires_at: string;
}

export interface ReferralLeaderboard {
  period: '7d' | '30d' | '90d' | 'all';
  
  leaders: {
    rank: number;
    user_id: string;
    user_name: string;
    avatar_url?: string;
    
    conversions: number;
    total_rewards: number;
    conversion_rate: number;
    
    is_current_user: boolean;
  }[];
  
  current_user_rank?: number;
  total_participants: number;
}

export interface ReferralReward {
  id: string;
  referrer_id: string;
  referral_id: string;
  
  // Amount
  amount: number;
  currency: string;
  type: 'points' | 'credit' | 'discount' | 'cash';
  
  // Status
  status: 'pending' | 'approved' | 'paid' | 'expired' | 'reversed';
  
  // Redemption
  redeemed_at?: string;
  expires_at: string;
  
  created_at: string;
}

// ==================== A/B Testing & Experimentation ====================

export interface Experiment {
  id: string;
  key: string; // Unique identifier e.g., "home_cta_color"
  
  // Meta
  name: string;
  description: string;
  hypothesis: string;
  
  // Variants
  control_variant: ExperimentVariant;
  test_variants: ExperimentVariant[];
  
  // Targeting
  audience: {
    user_type?: ('customer' | 'vendor' | 'all')[];
    traffic_allocation: number; // % of users exposed
    device?: ('mobile' | 'desktop' | 'tablet')[];
    region?: string[];
  };
  
  // Metrics
  primary_metric: string; // e.g., "conversion_rate"
  secondary_metrics: string[];
  
  // Status
  status: 'draft' | 'running' | 'paused' | 'completed' | 'rolled_back';
  
  // Results
  results?: ExperimentResults;
  winning_variant_id?: string;
  
  // Dates
  start_date?: string;
  end_date?: string;
  
  // Config
  min_sample_size: number;
  confidence_threshold: number; // e.g., 0.95
  
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ExperimentVariant {
  id: string;
  name: string; // "Control", "Variant A", "Variant B"
  
  // Traffic
  traffic_weight: number; // % allocation
  
  // Config
  config: Record<string, any>; // Variant-specific settings
  
  // Metrics
  exposures: number;
  conversions: number;
  conversion_rate: number;
  
  // Statistical Analysis
  mean: number;
  std_dev: number;
  confidence_interval: [number, number];
}

export interface ExperimentResults {
  experiment_id: string;
  
  // Statistical Significance
  is_significant: boolean;
  confidence_level: number; // 0-1
  p_value: number;
  
  // Winner
  winning_variant_id?: string;
  improvement_percentage?: number;
  
  // Metrics per Variant
  variant_results: {
    variant_id: string;
    variant_name: string;
    exposures: number;
    conversions: number;
    conversion_rate: number;
    uplift_vs_control: number; // %
  }[];
  
  // Recommendation
  recommendation: 'continue' | 'rollout_winner' | 'rollout_control' | 'inconclusive';
  recommendation_reason: string;
  
  calculated_at: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  
  name: string;
  description?: string;
  
  // State
  is_enabled: boolean;
  
  // Targeting
  enabled_for: {
    all_users?: boolean;
    user_ids?: string[];
    user_type?: ('customer' | 'vendor' | 'admin')[];
    percentage?: number; // Gradual rollout
    regions?: string[];
  };
  
  // Metadata
  tags: string[];
  
  created_by: string;
  created_at: string;
  updated_at: string;
}

// ==================== Feedback & Surveys ====================

export interface Survey {
  id: string;
  
  // Meta
  name: string;
  type: 'nps' | 'satisfaction' | 'feature_feedback' | 'custom';
  
  // Targeting
  target_audience: {
    user_type: ('customer' | 'vendor')[];
    trigger: 'post_purchase' | 'post_support' | 'scheduled' | 'on_page';
    page_url?: string;
  };
  
  // Questions
  questions: SurveyQuestion[];
  
  // Status
  is_active: boolean;
  
  // Performance
  total_views: number;
  total_responses: number;
  response_rate: number; // %
  avg_completion_time_seconds: number;
  
  created_at: string;
}

export interface SurveyQuestion {
  id: string;
  type: 'nps' | 'rating' | 'multiple_choice' | 'text' | 'yes_no';
  
  question_text: string;
  is_required: boolean;
  
  // Options (for multiple choice)
  options?: string[];
  
  // Scoring (for NPS/rating)
  min_score?: number;
  max_score?: number;
  
  sort_order: number;
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  user_id?: string;
  
  // Answers
  answers: {
    question_id: string;
    answer_value: string | number;
    answer_text?: string;
  }[];
  
  // NPS Score (if NPS survey)
  nps_score?: number;
  
  // Sentiment
  sentiment?: 'positive' | 'neutral' | 'negative';
  ai_summary?: string;
  
  completed_at: string;
}

export interface FeedbackSummary {
  period: string;
  
  // NPS
  nps_score: number; // -100 to 100
  promoters: number;
  passives: number;
  detractors: number;
  
  // Sentiment
  positive_feedback_count: number;
  neutral_feedback_count: number;
  negative_feedback_count: number;
  overall_sentiment: number; // 0-1
  
  // Topics
  top_topics: {
    topic: string;
    mention_count: number;
    sentiment_score: number;
  }[];
  
  // AI Insights
  ai_summary: string;
  key_takeaways: string[];
  recommended_actions: string[];
  
  generated_at: string;
}

// ==================== Internationalization ====================

export interface Locale {
  code: string; // en-US, ar-SA, hi-IN
  name: string;
  native_name: string;
  
  // Currency
  default_currency: string;
  
  // Formatting
  date_format: string;
  number_format: string;
  rtl: boolean; // Right-to-left
  
  // Status
  is_active: boolean;
  completion_percentage: number; // % of strings translated
  
  created_at: string;
}

export interface Translation {
  locale: string;
  namespace: string; // "common", "auth", "products"
  key: string;
  value: string;
  
  // Metadata
  is_ai_translated: boolean;
  is_verified: boolean;
  verified_by?: string;
  
  updated_at: string;
}

export interface CurrencyRate {
  from_currency: string;
  to_currency: string;
  rate: number;
  
  // Source
  source: 'openexchange' | 'stripe' | 'manual';
  
  // Caching
  cached_at: string;
  expires_at: string;
}

export interface RegionalSettings {
  region: string; // AU, US, IN, etc.
  
  // Defaults
  default_locale: string;
  default_currency: string;
  
  // Tax
  tax_rate: number;
  tax_inclusive: boolean;
  
  // Shipping
  available_carriers: string[];
  
  // Compliance
  data_regulations: ('GDPR' | 'CCPA' | 'PDP' | 'APPI')[];
  age_verification_required: boolean;
  
  // Payment
  payment_methods: string[];
  
  updated_at: string;
}

// ==================== Performance Monitoring ====================

export interface PerformanceMetrics {
  period: string;
  
  // Core Web Vitals
  lcp: number; // Largest Contentful Paint (ms)
  fid: number; // First Input Delay (ms)
  cls: number; // Cumulative Layout Shift
  
  // Page Speed
  ttfb: number; // Time to First Byte (ms)
  tti: number; // Time to Interactive (ms)
  
  // API Performance
  api_p50_latency: number;
  api_p95_latency: number;
  api_p99_latency: number;
  
  // Reliability
  uptime_percentage: number;
  error_rate: number;
  
  // Resource Usage
  avg_memory_mb: number;
  avg_cpu_percentage: number;
  
  measured_at: string;
}

export interface ScalabilityMetrics {
  // Traffic
  peak_requests_per_second: number;
  avg_requests_per_second: number;
  
  // Database
  db_connections_used: number;
  db_connections_max: number;
  db_query_time_p95: number;
  
  // Cache
  cache_hit_rate: number; // %
  cache_miss_rate: number; // %
  
  // CDN
  cdn_bandwidth_gb: number;
  cdn_cache_hit_rate: number; // %
  
  measured_at: string;
}

// ==================== Growth Metrics ====================

export interface GrowthLoop {
  id: string;
  name: string; // "Referral Loop", "Content Loop"
  
  // Components
  trigger: string;
  action: string;
  incentive: string;
  outcome: string;
  
  // Metrics
  loop_completions: number;
  avg_cycle_time_hours: number;
  viral_coefficient: number; // K-factor
  
  // Performance
  is_active: boolean;
  health_score: number; // 0-100
  
  // Trends
  completions_over_time: { date: string; count: number }[];
  
  last_measured: string;
}

export interface RetentionCurve {
  cohort_month: string;
  
  // Retention by Day/Week
  day_1: number; // %
  day_7: number;
  day_30: number;
  day_60: number;
  day_90: number;
  day_180: number;
  
  // Metrics
  cohort_size: number;
  retained_users: number;
}

// ==================== API Response Types ====================

export interface ExperimentsListResponse {
  experiments: Experiment[];
  total_count: number;
  active_count: number;
}

export interface SurveysListResponse {
  surveys: Survey[];
  total_count: number;
}

export interface LocalesListResponse {
  locales: Locale[];
  supported_currencies: string[];
}

