/**
 * Marketing API Service Layer
 * Sprint 11: Complete marketing & growth platform
 */

import axios from 'axios';
import type {
  Campaign,
  CampaignsListResponse,
  AudienceSegment,
  AttributionModel,
  AttributionEvent,
  UnifiedAnalyticsSummary,
  ChannelPerformance,
  GrowthMetrics,
  BlogPost,
  AIContentRequest,
  AIContentResponse,
  LaunchPhase,
  LaunchAsset,
  PressKit,
  SEOMetrics,
  BrandMetrics,
  AdCampaign,
} from '../types/marketing';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const DEFAULT_BASE_URL = 'http://localhost:8000';
const ML_BASE_URL = import.meta.env.VITE_ML_SERVICE_URL || DEFAULT_BASE_URL;

// ==================== Campaigns ====================

export const getCampaigns = async (): Promise<CampaignsListResponse> => {
  await delay(500);

  const now = new Date();
  const toISO = (offsetDays: number) =>
    new Date(now.getTime() - offsetDays * 24 * 60 * 60 * 1000).toISOString();

  const campaigns: Campaign[] = [
    {
      id: 'camp-launch',
      name: 'Unified Launch Week',
      description: 'Multi-channel push for Easy11 unified vendor launch.',
      type: 'email',
      goal: 'acquisition',
      audience: {
        id: 'seg-prospects',
        name: 'High-intent prospects',
        description: 'Vendors who started signup but did not complete onboarding.',
        user_type: ['vendor'],
        vendor_tier: ['starter', 'growth'],
        estimated_size: 1520,
        created_at: toISO(21),
      },
      subject: 'Early access to Easy11 launch perks',
      headline: 'Grow faster with AI-powered commerce tools',
      body:
        'Introduce Easy11 value props, highlight pricing intelligence demo, and invite prospects to soft-launch cohort.',
      cta_text: 'Claim launch invite',
      cta_url: 'https://easy11.com/launch',
      status: 'running',
      scheduled_at: toISO(5),
      started_at: toISO(3),
      metrics: {
        sent: 1520,
        delivered: 1492,
        failed: 28,
        delivery_rate: 98.1,
        opened: 786,
        open_rate: 52.7,
        clicked: 244,
        click_rate: 16.0,
        unsubscribed: 6,
        conversions: 72,
        conversion_rate: 4.7,
        revenue: 26840,
        cost_per_click: 0.42,
        cost_per_conversion: 3.65,
        roi: 12.6,
        last_updated: new Date().toISOString(),
      },
      has_variants: true,
      variants: [
        {
          id: 'camp-launch-a',
          campaign_id: 'camp-launch',
          name: 'Variant A - Feature-focused',
          traffic_allocation: 60,
          body: 'Deep dive into product intelligence suite with CTA to book a live walkthrough.',
          cta_text: 'Book product demo',
          metrics: {
            sent: 912,
            delivered: 900,
            failed: 12,
            delivery_rate: 98.7,
            opened: 490,
            open_rate: 54.4,
            clicked: 168,
            click_rate: 18.7,
            unsubscribed: 2,
            conversions: 55,
            conversion_rate: 6.0,
            revenue: 22400,
            cost_per_click: 0.38,
            cost_per_conversion: 3.12,
            roi: 14.4,
            last_updated: new Date().toISOString(),
          },
          is_winner: true,
        },
        {
          id: 'camp-launch-b',
          campaign_id: 'camp-launch',
          name: 'Variant B - Social proof',
          traffic_allocation: 40,
          body: 'Testimonials from beta vendors + highlight ROI improvements.',
          cta_text: 'See customer stories',
          metrics: {
            sent: 608,
            delivered: 592,
            failed: 16,
            delivery_rate: 97.4,
            opened: 296,
            open_rate: 50.0,
            clicked: 76,
            click_rate: 12.8,
            unsubscribed: 4,
            conversions: 17,
            conversion_rate: 2.9,
            revenue: 4440,
            cost_per_click: 0.49,
            cost_per_conversion: 4.72,
            roi: 6.1,
            last_updated: new Date().toISOString(),
          },
          is_winner: false,
        },
      ],
      winning_variant_id: 'camp-launch-a',
      ai_generated: true,
      ai_score: 88,
      budget: 900,
      spent: 640,
      created_by: 'mkt-ops',
      created_at: toISO(30),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'camp-retarget',
      name: 'Retargeting Flow — Abandoned Carts',
      description: 'Multi-touch journey for customers who abandoned checkout in last 7 days.',
      type: 'sms',
      goal: 'retention',
      audience: {
        id: 'seg-abandoned',
        name: 'Checkout abandoners',
        description: 'Customers who added items and left at payment step.',
        user_type: ['customer'],
        abandoned_cart: true,
        estimated_size: 860,
        created_at: toISO(14),
      },
      body: 'Complete your order and unlock free express shipping. Your cart is waiting!',
      cta_text: 'Resume checkout',
      cta_url: 'https://easy11.com/cart',
      status: 'scheduled',
      scheduled_at: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      metrics: {
        sent: 0,
        delivered: 0,
        failed: 0,
        delivery_rate: 0,
        opened: 0,
        open_rate: 0,
        clicked: 0,
        click_rate: 0,
        unsubscribed: 0,
        conversions: 0,
        conversion_rate: 0,
        revenue: 0,
        last_updated: new Date().toISOString(),
      },
      has_variants: false,
      ai_generated: false,
      created_by: 'growth-team',
      created_at: toISO(4),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'camp-paid-social',
      name: 'Paid Social — Creator Collaboration',
      description: 'Paid social ads featuring creator content across Instagram and TikTok.',
      type: 'social',
      goal: 'awareness',
      audience: {
        id: 'seg-lookalike',
        name: 'Lookalike — Top Vendors',
        description: 'Paid social lookalike audience based on high-performing vendor cohort.',
        user_type: ['vendor'],
        vendor_tier: ['growth', 'enterprise'],
        estimated_size: 28000,
        created_at: toISO(45),
      },
      headline: 'Scale your marketplace revenue with Easy11',
      body: 'Creators show how Easy11 automates product sync, marketing, and fulfilment.',
      cta_text: 'See how it works',
      cta_url: 'https://easy11.com/demo',
      image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
      status: 'running',
      started_at: toISO(6),
      metrics: {
        sent: 0,
        delivered: 0,
        failed: 0,
        delivery_rate: 0,
        opened: 0,
        open_rate: 0,
        clicked: 1340,
        click_rate: 0,
        unsubscribed: 0,
        conversions: 118,
        conversion_rate: 0,
        revenue: 48600,
        cost_per_click: 2.34,
        cost_per_conversion: 26.57,
        roi: 6.2,
        last_updated: new Date().toISOString(),
      },
      has_variants: false,
      ai_generated: false,
      budget: 12000,
      spent: 8450,
      created_by: 'paid-social',
      created_at: toISO(20),
      updated_at: new Date().toISOString(),
    },
  ];

  return {
    campaigns,
    total_count: campaigns.length,
    page: 1,
    per_page: campaigns.length,
  };
};

export const getAudienceSegments = async (): Promise<AudienceSegment[]> => {
  await delay(400);
  return [
    {
      id: 'seg-prospects',
      name: 'High-intent prospects',
      description: 'Vendors who started onboarding but did not activate stores.',
      user_type: ['vendor'],
      vendor_tier: ['starter', 'growth'],
      estimated_size: 1520,
      created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'seg-abandoned',
      name: 'Checkout abandoners',
      description: 'Customers who abandoned carts within the last 7 days.',
      user_type: ['customer'],
      abandoned_cart: true,
      estimated_size: 860,
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'seg-loyal',
      name: 'Loyalists — 3+ purchases',
      description: 'Customers with ≥3 purchases and NPS ≥ 8.',
      user_type: ['customer'],
      has_purchased: true,
      purchase_count: { min: 3 },
      total_spent: { min: 500 },
      estimated_size: 530,
      created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

export const createCampaign = async (data: Partial<Campaign>): Promise<Campaign> => {
  await delay(600);
  
  return {
    id: 'camp-' + Date.now(),
    name: data.name || 'New Campaign',
    type: data.type || 'email',
    goal: data.goal || 'acquisition',
    audience: data.audience || ({} as AudienceSegment),
    body: data.body || '',
    status: 'draft',
    metrics: {
      sent: 0,
      delivered: 0,
      failed: 0,
      delivery_rate: 0,
      opened: 0,
      open_rate: 0,
      clicked: 0,
      click_rate: 0,
      unsubscribed: 0,
      conversions: 0,
      conversion_rate: 0,
      revenue: 0,
      last_updated: new Date().toISOString(),
    },
    has_variants: false,
    ai_generated: false,
    created_by: 'admin-123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

// ==================== Attribution ====================

export const trackAttributionEvent = async (event: Partial<AttributionEvent>): Promise<{ status: string }> => {
  await delay(200);
  console.log('[Marketing API] Attribution event tracked:', event);
  return { status: 'tracked' };
};

export const getAttributionModels = async (
  conversionId?: string
): Promise<AttributionModel[]> => {
  await delay(600);
  return [];
};

export const getChannelPerformance = async (period: string): Promise<ChannelPerformance[]> => {
  await delay(700);
  
  return [
    {
      channel: 'organic',
      sessions: 12450,
      users: 8930,
      avg_session_duration_seconds: 245,
      bounce_rate: 42.3,
      pages_per_session: 3.8,
      conversions: 328,
      conversion_rate: 2.63,
      revenue: 125680,
    },
    {
      channel: 'paid_search',
      sessions: 4520,
      users: 3680,
      avg_session_duration_seconds: 198,
      bounce_rate: 38.5,
      pages_per_session: 4.2,
      conversions: 156,
      conversion_rate: 3.45,
      revenue: 58420,
      cost: 8250,
      cpa: 52.88,
      roas: 7.08,
    },
    {
      channel: 'email',
      sessions: 2340,
      users: 1890,
      avg_session_duration_seconds: 312,
      bounce_rate: 28.2,
      pages_per_session: 5.1,
      conversions: 89,
      conversion_rate: 3.80,
      revenue: 32450,
      cost: 450,
      cpa: 5.06,
      roas: 72.11,
    },
  ];
};

// ==================== Unified Analytics ====================

export const getUnifiedAnalytics = async (period: string): Promise<UnifiedAnalyticsSummary> => {
  await delay(900);
  
  return {
    period,
    date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    date_to: new Date().toISOString(),
    
    total_users: 45230,
    active_users: 12680,
    new_users: 3420,
    
    customer: {
      total_customers: 8930,
      active_customers: 3240,
      total_orders: 2450,
      total_revenue: 468920,
      avg_order_value: 191.40,
      conversion_rate: 2.58,
      ltv: 524.50,
      cac: 42.30,
    },
    
    vendor: {
      total_vendors: 156,
      active_vendors: 142,
      avg_gmv_per_vendor: 3000.50,
      total_products: 4580,
      avg_fulfillment_time: 18.5,
      vendor_satisfaction_score: 4.6,
    },
    
    marketing: {
      total_campaigns: 23,
      active_campaigns: 8,
      total_ad_spend: 18450,
      total_attributed_revenue: 156820,
      overall_roas: 8.50,
      avg_ctr: 3.8,
      avg_conversion_rate: 2.9,
    },
    
    platform: {
      uptime_percentage: 99.98,
      avg_response_time_ms: 185,
      error_rate: 0.02,
      support_tickets: 45,
      avg_resolution_time_hours: 4.2,
    },
    
    generated_at: new Date().toISOString(),
  };
};

export const getGrowthMetrics = async (period: string): Promise<GrowthMetrics> => {
  await delay(700);
  
  return {
    period,
    
    user_growth: {
      total_users: 45230,
      new_users: 3420,
      growth_rate: 8.2,
      churn_rate: 2.5,
      net_growth: 2985,
    },
    
    revenue_growth: {
      total_revenue: 468920,
      mrr: 156307,
      growth_rate: 12.5,
    },
    
    activation: {
      signups: 3420,
      activated_users: 2890,
      activation_rate: 84.5,
      time_to_first_purchase_days: 3.2,
    },
    
    engagement: {
      dau: 4580,
      mau: 12680,
      dau_mau_ratio: 36.1,
      avg_session_duration_minutes: 8.5,
      avg_sessions_per_user: 4.2,
    },
    
    viral: {
      referrals_sent: 890,
      referrals_converted: 267,
      viral_coefficient: 0.30,
      referral_revenue: 51230,
    },
  };
};

// ==================== Generative AI ====================

export const generateAIContent = async (payload: AIContentRequest): Promise<AIContentResponse> => {
  try {
    const response = await axios.post<AIContentResponse>(
      `${ML_BASE_URL.replace(/\/$/, '')}/api/v1/generative/marketing/content`,
      payload,
      { timeout: 8000 }
    );
    return response.data;
  } catch (error) {
    console.warn('[Marketing API] Generative backend unavailable. Returning fallback content.', error);
    const now = new Date().toISOString();
    return {
      title: `${payload.topic} Launch Guide`,
      outline: [
        'Opportunity snapshot',
        'Audience signals to leverage',
        'Creative direction',
        'Activation plan',
        'Measurement checklist',
      ],
      content:
        `## ${payload.topic} Campaign Playbook\n\n` +
        `Use this fallback template to outline your ${payload.topic.toLowerCase()} initiative. ` +
        'Include customer stories, a clear CTA, and a retargeting plan.\n',
      meta_title: `${payload.topic} | Easy11`,
      meta_description: `Spin up a ${payload.topic.toLowerCase()} campaign in minutes with Easy11.`,
      suggested_keywords: [payload.topic.toLowerCase(), 'easy11 marketing automation'],
      seo_score: 72,
      estimated_word_count: payload.length === 'short' ? 450 : payload.length === 'long' ? 1200 : 800,
      generated_at: now,
      tone: payload.tone,
      length: payload.length,
      target_audience: payload.target_audience,
      image_prompt: `${payload.topic} digital campaign concept art`,
      channel_variations: [
        {
          channel: 'email',
          headline: `${payload.topic} quick win`,
          body: 'Launch the sequence directly from Easy11 and layer loyalty rewards to boost conversion.',
          call_to_action: 'Open Easy11 Command Center',
        },
      ],
    };
  }
};

// ==================== Content & Blog ====================

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  await delay(500);
  return [];
};

// ==================== Launch Campaign ====================

export const getLaunchPhases = async (): Promise<LaunchPhase[]> => {
  await delay(500);
  
  return [
    {
      phase_number: 1,
      name: 'Pre-Launch',
      description: 'Internal beta and testimonial gathering',
      start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      deliverables: ['Seed vendors', 'Collect testimonials', 'Record demo video'],
      kpis: [
        { metric: 'Beta vendors', target: 10, actual: 12 },
        { metric: 'Testimonials', target: 5, actual: 7 },
      ],
      status: 'completed',
      completion_percentage: 100,
    },
    {
      phase_number: 2,
      name: 'Soft Launch',
      description: 'Public landing with invite-only vendor access',
      start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date().toISOString(),
      deliverables: ['Launch website', 'LinkedIn announcement', 'Product Hunt pre-list'],
      kpis: [
        { metric: 'Website visits', target: 1000, actual: 1245 },
        { metric: 'Vendor signups', target: 20, actual: 18 },
      ],
      status: 'in_progress',
      completion_percentage: 85,
    },
  ];
};

export const getPressKit = async (): Promise<PressKit> => {
  await delay(400);
  
  return {
    company_name: 'Easy11',
    tagline: 'AI-Powered Commerce for Everyone',
    description: 'Easy11 is a next-generation marketplace platform that empowers vendors with AI-driven tools for product management, pricing optimization, and customer insights.',
    
    logo_urls: {
      primary: 'https://easy11.com/assets/logo.svg',
      white: 'https://easy11.com/assets/logo-white.svg',
      black: 'https://easy11.com/assets/logo-black.svg',
      icon: 'https://easy11.com/assets/icon.png',
    },
    
    brand_colors: {
      primary: '#000154',
      secondary: '#1A58D3',
      accent: '#31EE88',
    },
    
    fact_sheet_url: 'https://easy11.com/press/fact-sheet.pdf',
    
    product_screenshots: [],
    team_photos: [],
    
    press_contact: {
      name: 'Media Relations',
      email: 'press@easy11.com',
      phone: '+61 2 1234 5678',
    },
    
    updated_at: new Date().toISOString(),
  };
};

// ==================== SEO & Brand ====================

export const getSEOMetrics = async (): Promise<SEOMetrics> => {
  await delay(600);
  
  return {
    avg_position: 12.5,
    top_10_keywords: 45,
    top_3_keywords: 12,
    organic_sessions: 12450,
    organic_conversions: 328,
    organic_revenue: 125680,
    indexed_pages: 1245,
    crawl_errors: 3,
    page_speed_score: 95,
    mobile_usability_score: 98,
    total_backlinks: 3420,
    referring_domains: 245,
    domain_authority: 42,
    last_updated: new Date().toISOString(),
  };
};

export const getBrandMetrics = async (): Promise<BrandMetrics> => {
  await delay(500);
  
  return {
    domain_authority: 42,
    domain_rating: 45,
    
    social_followers: [
      { platform: 'LinkedIn', followers: 4520, engagement_rate: 3.2 },
      { platform: 'Twitter', followers: 2890, engagement_rate: 2.1 },
    ],
    
    branded_search_volume: 1240,
    brand_mentions: 456,
    sentiment_score: 0.78,
    
    estimated_market_share: 0.5,
    category_rank: 15,
    
    last_updated: new Date().toISOString(),
  };
};

// ==================== Export All ====================

const marketingAPI = {
  // Campaigns
  getCampaigns,
  createCampaign,
  getAudienceSegments,
  
  // Attribution
  trackAttributionEvent,
  getAttributionModels,
  getChannelPerformance,
  
  // Unified Analytics
  getUnifiedAnalytics,
  getGrowthMetrics,
  
  // Content
  getBlogPosts,
  generateAIContent,
  
  // Launch
  getLaunchPhases,
  getPressKit,
  
  // SEO & Brand
  getSEOMetrics,
  getBrandMetrics,
};

export default marketingAPI;

