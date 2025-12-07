/**
 * Marketing, Campaigns & Attribution Types
 * Sprint 11: Unified growth platform with brand marketing
 */

// ==================== Marketing Campaigns ====================

export type CampaignType = 
  | 'email'
  | 'sms'
  | 'push'
  | 'in_app'
  | 'social'
  | 'display_ads'
  | 'search_ads';

export type CampaignStatus = 
  | 'draft'
  | 'scheduled'
  | 'running'
  | 'paused'
  | 'completed'
  | 'archived';

export type CampaignGoal = 
  | 'awareness'
  | 'acquisition'
  | 'activation'
  | 'retention'
  | 'revenue'
  | 'referral';

export interface Campaign {
  id: string;
  
  // Basic Info
  name: string;
  description?: string;
  type: CampaignType;
  goal: CampaignGoal;
  
  // Targeting
  audience: AudienceSegment;
  
  // Content
  subject?: string; // For email
  headline?: string;
  body: string;
  cta_text?: string;
  cta_url?: string;
  
  // Media
  image_url?: string;
  video_url?: string;
  
  // Scheduling
  status: CampaignStatus;
  scheduled_at?: string;
  started_at?: string;
  completed_at?: string;
  
  // Performance
  metrics: CampaignMetrics;
  
  // A/B Testing
  has_variants: boolean;
  variants?: CampaignVariant[];
  winning_variant_id?: string;
  
  // AI
  ai_generated: boolean;
  ai_score?: number; // 0-100
  
  // Budget (for paid campaigns)
  budget?: number;
  spent?: number;
  
  // Creator
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignVariant {
  id: string;
  campaign_id: string;
  name: string; // "Variant A", "Variant B"
  
  subject?: string;
  headline?: string;
  body: string;
  cta_text?: string;
  
  traffic_allocation: number; // % of audience
  
  metrics: CampaignMetrics;
  
  is_winner: boolean;
}

export interface AudienceSegment {
  id: string;
  name: string;
  description?: string;
  
  // Filters
  user_type?: ('customer' | 'vendor' | 'all')[];
  
  // Customer Filters
  has_purchased?: boolean;
  purchase_count?: { min?: number; max?: number };
  total_spent?: { min?: number; max?: number };
  last_purchase_days?: number;
  
  // Vendor Filters
  vendor_tier?: ('starter' | 'growth' | 'enterprise')[];
  vendor_status?: string[];
  
  // Behavioral
  visited_pages?: string[];
  clicked_products?: string[];
  abandoned_cart?: boolean;
  
  // Geographic
  regions?: string[];
  countries?: string[];
  
  // Demographic
  signup_date?: { from?: string; to?: string };
  
  // Size
  estimated_size: number;
  
  created_at: string;
}

export interface CampaignMetrics {
  // Delivery
  sent: number;
  delivered: number;
  failed: number;
  delivery_rate: number; // %
  
  // Engagement
  opened: number;
  open_rate: number; // %
  clicked: number;
  click_rate: number; // %
  unsubscribed: number;
  
  // Conversion
  conversions: number;
  conversion_rate: number; // %
  revenue: number;
  
  // Cost
  cost_per_click?: number;
  cost_per_conversion?: number;
  roi?: number; // Revenue / Cost
  
  last_updated: string;
}

// ==================== Attribution & Tracking ====================

export interface AttributionEvent {
  id: string;
  
  // User & Session
  user_id?: string;
  session_id: string;
  device_id?: string;
  
  // Event
  event_type: string; // "page_view", "product_click", "purchase"
  event_name: string;
  
  // Source Attribution
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  
  referrer?: string;
  landing_page: string;
  
  // Channel
  channel: 'organic' | 'paid_search' | 'paid_social' | 'email' | 'sms' | 'push' | 'direct' | 'referral';
  
  // Context
  page_url: string;
  user_agent?: string;
  ip_address?: string;
  geo_country?: string;
  geo_region?: string;
  
  // Conversion
  conversion_value?: number;
  currency?: string;
  
  // Metadata
  properties: Record<string, any>;
  
  timestamp: string;
}

export interface AttributionModel {
  conversion_id: string;
  
  // User Journey
  touchpoints: AttributionTouchpoint[];
  
  // Models
  first_click: AttributionCredit;
  last_click: AttributionCredit;
  linear: AttributionCredit[];
  time_decay: AttributionCredit[];
  position_based: AttributionCredit[];
  
  // Conversion
  conversion_event: string;
  conversion_value: number;
  conversion_date: string;
}

export interface AttributionTouchpoint {
  timestamp: string;
  channel: string;
  campaign_id?: string;
  utm_source?: string;
  utm_medium?: string;
  page_url: string;
}

export interface AttributionCredit {
  channel: string;
  campaign_id?: string;
  credit: number; // 0-1 (percentage)
  credit_value: number; // $ attributed
}

// ==================== Unified Analytics ====================

export interface UnifiedAnalyticsSummary {
  period: string;
  date_from: string;
  date_to: string;
  
  // Platform-Wide Metrics
  total_users: number;
  active_users: number;
  new_users: number;
  
  // Customer Metrics
  customer: {
    total_customers: number;
    active_customers: number;
    total_orders: number;
    total_revenue: number;
    avg_order_value: number;
    conversion_rate: number;
    ltv: number;
    cac: number;
  };
  
  // Vendor Metrics
  vendor: {
    total_vendors: number;
    active_vendors: number;
    avg_gmv_per_vendor: number;
    total_products: number;
    avg_fulfillment_time: number;
    vendor_satisfaction_score: number;
  };
  
  // Marketing Metrics
  marketing: {
    total_campaigns: number;
    active_campaigns: number;
    total_ad_spend: number;
    total_attributed_revenue: number;
    overall_roas: number; // Return on ad spend
    avg_ctr: number;
    avg_conversion_rate: number;
  };
  
  // Platform Health
  platform: {
    uptime_percentage: number;
    avg_response_time_ms: number;
    error_rate: number;
    support_tickets: number;
    avg_resolution_time_hours: number;
  };
  
  generated_at: string;
}

export interface ChannelPerformance {
  channel: string;
  
  // Traffic
  sessions: number;
  users: number;
  
  // Engagement
  avg_session_duration_seconds: number;
  bounce_rate: number;
  pages_per_session: number;
  
  // Conversion
  conversions: number;
  conversion_rate: number;
  revenue: number;
  
  // Cost (for paid channels)
  cost?: number;
  cpa?: number; // Cost per acquisition
  roas?: number; // Return on ad spend
}

// ==================== Content Management ====================

export interface BlogPost {
  id: string;
  
  // Content
  title: string;
  slug: string;
  excerpt: string;
  content: string; // MDX
  
  // SEO
  meta_title: string;
  meta_description: string;
  keywords: string[];
  canonical_url?: string;
  
  // Media
  featured_image_url?: string;
  og_image_url?: string;
  
  // Categorization
  category: string;
  tags: string[];
  topic_cluster?: string;
  
  // AI
  ai_generated: boolean;
  ai_outline?: string;
  seo_score: number;
  
  // Author
  author_id: string;
  author_name: string;
  
  // Status
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  
  // Analytics
  views: number;
  avg_time_on_page_seconds: number;
  social_shares: number;
  
  created_at: string;
  updated_at: string;
}

export interface ContentCluster {
  id: string;
  name: string; // "AI in Commerce"
  description: string;
  pillar_post_id?: string; // Main comprehensive post
  cluster_posts: string[]; // Related posts
  keywords: string[];
  estimated_traffic: number;
  created_at: string;
}

export interface AIContentRequest {
  topic: string;
  keywords: string[];
  tone: 'friendly' | 'professional' | 'playful' | 'technical';
  length: 'short' | 'medium' | 'long';
  include_examples: boolean;
  target_audience: 'customers' | 'vendors' | 'general';
}

export interface AIContentResponse {
  title: string;
  outline: string[];
  content: string; // Full MDX
  meta_title: string;
  meta_description: string;
  suggested_keywords: string[];
  seo_score: number;
  estimated_word_count: number;
  generated_at: string;
  tone?: string;
  length?: 'short' | 'medium' | 'long';
  target_audience?: 'customers' | 'vendors' | 'general';
  image_prompt?: string;
  channel_variations?: AIChannelVariation[];
  model_version?: string;
}

export interface AIChannelVariation {
  channel: 'email' | 'sms' | 'social' | 'push' | string;
  headline: string;
  subheadline?: string;
  body: string;
  call_to_action: string;
}

// ==================== Launch Campaign ====================

export interface LaunchPhase {
  phase_number: number;
  name: string;
  description: string;
  
  start_date: string;
  end_date: string;
  
  deliverables: string[];
  kpis: {
    metric: string;
    target: number;
    actual?: number;
  }[];
  
  status: 'not_started' | 'in_progress' | 'completed';
  completion_percentage: number;
}

export interface LaunchAsset {
  id: string;
  type: 'video' | 'image' | 'pdf' | 'press_release' | 'social_media_kit';
  name: string;
  description?: string;
  file_url: string;
  thumbnail_url?: string;
  
  // Usage
  channels: string[];
  download_count: number;
  
  created_at: string;
}

export interface PressKit {
  company_name: string;
  tagline: string;
  description: string;
  
  // Assets
  logo_urls: {
    primary: string;
    white: string;
    black: string;
    icon: string;
  };
  
  brand_colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  
  // Documents
  fact_sheet_url: string;
  press_release_url?: string;
  
  // Media
  product_screenshots: string[];
  team_photos: string[];
  
  // Contact
  press_contact: {
    name: string;
    email: string;
    phone: string;
  };
  
  updated_at: string;
}

// ==================== Marketing Automation ====================

export interface AutomationFlow {
  id: string;
  name: string;
  description?: string;
  
  // Trigger
  trigger_type: 
    | 'signup'
    | 'purchase'
    | 'abandoned_cart'
    | 'price_drop'
    | 'inactivity'
    | 'vendor_milestone'
    | 'custom_event';
  
  trigger_conditions: any;
  
  // Flow Steps
  steps: AutomationStep[];
  
  // Status
  is_active: boolean;
  
  // Performance
  total_triggered: number;
  total_completed: number;
  completion_rate: number;
  
  created_at: string;
  updated_at: string;
}

export interface AutomationStep {
  id: string;
  step_number: number;
  
  // Action
  action_type: 'send_email' | 'send_sms' | 'send_push' | 'wait' | 'conditional_split';
  
  // Wait Time
  delay_seconds?: number;
  
  // Message
  template_id?: string;
  subject?: string;
  content?: string;
  
  // Conditions (for splits)
  conditions?: any;
  
  // Performance
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: 'transactional' | 'marketing' | 'notification';
  
  // Content
  subject: string;
  preview_text?: string;
  html_body: string;
  text_body: string;
  
  // Variables
  variables: string[]; // ["customer_name", "product_name"]
  
  // AI
  ai_generated: boolean;
  tone: string;
  
  // Performance
  total_sent: number;
  avg_open_rate: number;
  avg_click_rate: number;
  
  created_at: string;
  updated_at: string;
}

// ==================== SEO & SEM ====================

export interface SEOMetrics {
  // Rankings
  avg_position: number;
  top_10_keywords: number;
  top_3_keywords: number;
  
  // Traffic
  organic_sessions: number;
  organic_conversions: number;
  organic_revenue: number;
  
  // Technical SEO
  indexed_pages: number;
  crawl_errors: number;
  page_speed_score: number;
  mobile_usability_score: number;
  
  // Backlinks
  total_backlinks: number;
  referring_domains: number;
  domain_authority: number;
  
  last_updated: string;
}

export interface KeywordRanking {
  keyword: string;
  position: number;
  search_volume: number;
  competition: 'low' | 'medium' | 'high';
  cpc?: number; // Cost per click (for SEM)
  
  // Trends
  position_change_7d: number;
  position_change_30d: number;
  
  // URLs
  ranking_url: string;
  
  last_checked: string;
}

export interface AdCampaign {
  id: string;
  platform: 'google_ads' | 'meta_ads' | 'linkedin_ads';
  
  name: string;
  status: 'active' | 'paused' | 'completed';
  
  // Budget
  daily_budget: number;
  total_budget: number;
  spent: number;
  remaining: number;
  
  // Performance
  impressions: number;
  clicks: number;
  ctr: number; // %
  conversions: number;
  conversion_rate: number; // %
  revenue: number;
  roas: number; // Return on ad spend
  cpc: number; // Cost per click
  cpa: number; // Cost per acquisition
  
  // Targeting
  keywords?: string[];
  audience?: string;
  geo_targeting?: string[];
  
  // Dates
  start_date: string;
  end_date?: string;
  
  created_at: string;
}

// ==================== Analytics Integration ====================

export interface AnalyticsIntegration {
  platform: 'google_analytics' | 'posthog' | 'mixpanel' | 'segment';
  
  // Configuration
  api_key_last4: string;
  property_id?: string;
  
  // Status
  is_active: boolean;
  is_syncing: boolean;
  last_sync_at?: string;
  
  // Data
  events_synced: number;
  errors_count: number;
  
  created_at: string;
}

export interface ConversionFunnel {
  name: string;
  
  steps: {
    step_number: number;
    step_name: string;
    users_entered: number;
    users_completed: number;
    completion_rate: number; // %
    avg_time_to_complete_seconds: number;
  }[];
  
  overall_conversion_rate: number;
  total_drop_offs: number;
  
  // Segmentation
  by_channel?: Record<string, number>;
  by_device?: Record<string, number>;
}

// ==================== Marketing Website Pages ====================

export interface MarketingPage {
  id: string;
  slug: string; // "home", "about", "pricing"
  
  // Content
  title: string;
  meta_description: string;
  content_sections: ContentSection[];
  
  // SEO
  keywords: string[];
  og_image: string;
  
  // Performance
  views: number;
  avg_time_on_page: number;
  bounce_rate: number;
  
  // Status
  is_published: boolean;
  published_at?: string;
  
  updated_at: string;
}

export interface ContentSection {
  id: string;
  type: 'hero' | 'features' | 'testimonials' | 'cta' | 'stats' | 'faq' | 'pricing';
  
  // Content
  heading?: string;
  subheading?: string;
  body?: string;
  
  // Media
  image_url?: string;
  video_url?: string;
  
  // Configuration
  layout: 'centered' | 'two_column' | 'three_column' | 'full_width';
  background_color?: string;
  
  // CTA
  cta_text?: string;
  cta_url?: string;
  
  sort_order: number;
}

export interface Testimonial {
  id: string;
  
  // Person
  name: string;
  role: string;
  company?: string;
  avatar_url?: string;
  
  // Content
  quote: string;
  rating?: number;
  
  // Meta
  is_featured: boolean;
  is_verified: boolean;
  
  // Source
  source: 'trustpilot' | 'google' | 'manual';
  source_url?: string;
  
  created_at: string;
}

// ==================== Growth Metrics ====================

export interface GrowthMetrics {
  period: string;
  
  // User Growth
  user_growth: {
    total_users: number;
    new_users: number;
    growth_rate: number; // %
    churn_rate: number; // %
    net_growth: number;
  };
  
  // Revenue Growth
  revenue_growth: {
    total_revenue: number;
    mrr?: number; // Monthly recurring revenue (if applicable)
    growth_rate: number; // %
  };
  
  // Activation
  activation: {
    signups: number;
    activated_users: number; // Made first purchase
    activation_rate: number; // %
    time_to_first_purchase_days: number;
  };
  
  // Engagement
  engagement: {
    dau: number; // Daily active users
    mau: number; // Monthly active users
    dau_mau_ratio: number; // Stickiness
    avg_session_duration_minutes: number;
    avg_sessions_per_user: number;
  };
  
  // Viral Metrics
  viral: {
    referrals_sent: number;
    referrals_converted: number;
    viral_coefficient: number; // K-factor
    referral_revenue: number;
  };
}

// ==================== Brand & Market Intelligence ====================

export interface BrandMetrics {
  // SEO Authority
  domain_authority: number; // 0-100 (Moz/Ahrefs)
  domain_rating: number; // 0-100
  
  // Social
  social_followers: {
    platform: string;
    followers: number;
    engagement_rate: number;
  }[];
  
  // Brand Awareness
  branded_search_volume: number;
  brand_mentions: number;
  sentiment_score: number; // -1 to 1
  
  // Market Share
  estimated_market_share: number; // %
  category_rank: number;
  
  last_updated: string;
}

export interface CompetitorAnalysis {
  competitor_name: string;
  
  // Traffic
  estimated_monthly_visitors: number;
  traffic_trend: 'rising' | 'stable' | 'falling';
  
  // Rankings
  avg_keyword_position: number;
  ranking_keywords_count: number;
  
  // Products
  estimated_products: number;
  avg_price_point: number;
  
  // Gaps & Opportunities
  keyword_gaps: string[]; // Keywords they rank for, we don't
  content_gaps: string[]; // Topics they cover, we don't
  
  last_analyzed: string;
}

// ==================== API Response Types ====================

export interface CampaignsListResponse {
  campaigns: Campaign[];
  total_count: number;
  page: number;
  per_page: number;
}

export interface AttributionReportResponse {
  model: AttributionModel[];
  summary: {
    total_conversions: number;
    total_revenue: number;
    top_channel: string;
    top_campaign: string;
  };
}

export interface AnalyticsDashboardResponse {
  summary: UnifiedAnalyticsSummary;
  channel_performance: ChannelPerformance[];
  funnel: ConversionFunnel;
}

