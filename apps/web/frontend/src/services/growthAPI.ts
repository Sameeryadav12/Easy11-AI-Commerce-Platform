/**
 * Growth & Experimentation API Service
 * Sprint 12: Growth loops, A/B testing, referrals
 */

import type {
  ReferralProgram,
  ReferralInvite,
  ReferralLeaderboard,
  Experiment,
  ExperimentResults,
  FeatureFlag,
  Survey,
  SurveyResponse,
  FeedbackSummary,
  GrowthLoop,
  Locale,
  CurrencyRate,
} from '../types/growth';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ==================== Referrals ====================

export const getReferralProgram = async (userId: string): Promise<ReferralProgram> => {
  await delay(500);
  
  return {
    id: 'ref-prog-001',
    user_id: userId,
    user_type: 'customer',
    referral_code: 'EASY11ABC',
    referral_link: 'https://easy11.com/r/EASY11ABC',
    qr_code_url: 'https://easy11.com/qr/EASY11ABC.png',
    invites_sent: 12,
    signups: 5,
    conversions: 3,
    conversion_rate: 60.0,
    total_rewards_earned: 450.00,
    pending_rewards: 150.00,
    currency: 'AUD',
    is_active: true,
    tier: 'silver',
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const sendReferralInvite = async (
  referrerId: string,
  email: string,
  channel: string
): Promise<ReferralInvite> => {
  await delay(600);
  
  return {
    id: 'inv-' + Date.now(),
    referrer_id: referrerId,
    invitee_email: email,
    status: 'sent',
    channel: channel as any,
    referrer_reward: 50.00,
    invitee_reward: 25.00,
    reward_status: 'pending',
    sent_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
};

export const getReferralLeaderboard = async (period: string): Promise<ReferralLeaderboard> => {
  await delay(500);
  
  return {
    period: period as any,
    leaders: [
      {
        rank: 1,
        user_id: 'user-456',
        user_name: 'Sarah Chen',
        conversions: 28,
        total_rewards: 1400.00,
        conversion_rate: 68.3,
        is_current_user: false,
      },
    ],
    total_participants: 245,
  };
};

// ==================== A/B Testing ====================

export const getExperiments = async (): Promise<Experiment[]> => {
  await delay(500);
  const now = new Date();
  const toISO = (offsetDays: number) => new Date(now.getTime() - offsetDays * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: 'exp-home-cta',
      key: 'home_cta_color',
      name: 'Homepage CTA color',
      description: 'Test primary CTA color change from blue (control) to teal.',
      hypothesis: 'Teal CTA will increase vendor signup conversion rate by 5%.',
      control_variant: {
        id: 'control',
        name: 'Control',
        traffic_weight: 50,
        config: { ctaColor: '#1A58D3' },
        exposures: 12890,
        conversions: 420,
        conversion_rate: 3.26,
        mean: 0.0326,
        std_dev: 0.008,
        confidence_interval: [0.0302, 0.0350],
      },
      test_variants: [
        {
          id: 'variant-a',
          name: 'Variant A',
          traffic_weight: 50,
          config: { ctaColor: '#31EE88' },
          exposures: 12960,
          conversions: 494,
          conversion_rate: 3.81,
          mean: 0.0381,
          std_dev: 0.009,
          confidence_interval: [0.0355, 0.0407],
        },
      ],
      audience: {
        user_type: ['vendor'],
        traffic_allocation: 100,
        device: ['desktop', 'mobile'],
      },
      primary_metric: 'conversion_rate',
      secondary_metrics: ['click_through_rate'],
      status: 'running',
      start_date: toISO(5),
      min_sample_size: 25000,
      confidence_threshold: 0.95,
      created_by: 'growth-lab',
      created_at: toISO(6),
      updated_at: new Date().toISOString(),
      results: {
        experiment_id: 'exp-home-cta',
        is_significant: true,
        confidence_level: 0.982,
        p_value: 0.018,
        winning_variant_id: 'variant-a',
        improvement_percentage: 16.9,
        variant_results: [
          {
            variant_id: 'control',
            variant_name: 'Control',
            exposures: 12890,
            conversions: 420,
            conversion_rate: 3.26,
            uplift_vs_control: 0,
          },
          {
            variant_id: 'variant-a',
            variant_name: 'Variant A',
            exposures: 12960,
            conversions: 494,
            conversion_rate: 3.81,
            uplift_vs_control: 16.9,
          },
        ],
        recommendation: 'rollout_winner',
        recommendation_reason: 'Variant A has statistically significant uplift above threshold.',
        calculated_at: new Date().toISOString(),
      },
      winning_variant_id: 'variant-a',
    },
    {
      id: 'exp-pricing-flow',
      key: 'pricing_checkout_copy',
      name: 'Pricing checkout copy',
      description: 'Update copy in checkout flow to emphasise AI pricing automation.',
      hypothesis: 'AI-focused copy will reduce checkout abandonment by 3%.',
      control_variant: {
        id: 'pricing-control',
        name: 'Control',
        traffic_weight: 50,
        config: { messaging: 'Standard' },
        exposures: 5600,
        conversions: 980,
        conversion_rate: 17.5,
        mean: 0.175,
        std_dev: 0.04,
        confidence_interval: [0.166, 0.184],
      },
      test_variants: [
        {
          id: 'pricing-ai',
          name: 'AI Copy',
          traffic_weight: 50,
          config: { messaging: 'AI Automation' },
          exposures: 5615,
          conversions: 1018,
          conversion_rate: 18.1,
          mean: 0.181,
          std_dev: 0.041,
          confidence_interval: [0.172, 0.190],
        },
      ],
      audience: {
        user_type: ['vendor'],
        traffic_allocation: 50,
      },
      primary_metric: 'conversion_rate',
      secondary_metrics: ['average_order_value'],
      status: 'completed',
      start_date: toISO(20),
      end_date: toISO(3),
      min_sample_size: 10000,
      confidence_threshold: 0.9,
      created_by: 'growth-lab',
      created_at: toISO(21),
      updated_at: new Date().toISOString(),
      results: {
        experiment_id: 'exp-pricing-flow',
        is_significant: false,
        confidence_level: 0.74,
        p_value: 0.26,
        variant_results: [
          {
            variant_id: 'pricing-control',
            variant_name: 'Control',
            exposures: 5600,
            conversions: 980,
            conversion_rate: 17.5,
            uplift_vs_control: 0,
          },
          {
            variant_id: 'pricing-ai',
            variant_name: 'AI Copy',
            exposures: 5615,
            conversions: 1018,
            conversion_rate: 18.1,
            uplift_vs_control: 3.4,
          },
        ],
        recommendation: 'continue',
        recommendation_reason: 'Lift observed but not statistically significant; consider re-running with larger sample.',
        calculated_at: new Date().toISOString(),
      },
      winning_variant_id: undefined,
    },
  ];
};

export const getVariantForUser = async (
  userId: string,
  experimentKey: string
): Promise<{ variant_id: string; config: any }> => {
  await delay(200);
  
  return {
    variant_id: 'control',
    config: {},
  };
};

export const trackExperimentExposure = async (
  experimentKey: string,
  variantId: string,
  userId: string
): Promise<{ status: string }> => {
  await delay(100);
  return { status: 'tracked' };
};

export const getFeatureFlags = async (userId: string): Promise<Record<string, boolean>> => {
  await delay(300);
  
  return {
    'new_checkout_flow': true,
    'ai_product_recommendations': true,
    'advanced_analytics': false,
  };
};

// ==================== Surveys & Feedback ====================

export const getSurveys = async (): Promise<Survey[]> => {
  await delay(400);
  return [];
};

export const submitSurveyResponse = async (
  surveyId: string,
  answers: any[]
): Promise<SurveyResponse> => {
  await delay(500);
  
  return {
    id: 'resp-' + Date.now(),
    survey_id: surveyId,
    answers,
    completed_at: new Date().toISOString(),
  };
};

export const getFeedbackSummary = async (period: string): Promise<FeedbackSummary> => {
  await delay(700);
  
  return {
    period,
    nps_score: 42,
    promoters: 156,
    passives: 89,
    detractors: 23,
    positive_feedback_count: 245,
    neutral_feedback_count: 67,
    negative_feedback_count: 34,
    overall_sentiment: 0.78,
    top_topics: [
      { topic: 'Shipping Speed', mention_count: 89, sentiment_score: 0.85 },
      { topic: 'Product Quality', mention_count: 67, sentiment_score: 0.92 },
      { topic: 'Customer Service', mention_count: 45, sentiment_score: 0.73 },
    ],
    ai_summary: 'Overall sentiment is positive with customers praising product quality and fast shipping. Main areas for improvement include customer service response times and return process clarity.',
    key_takeaways: [
      'Shipping speed is a key differentiator',
      'Product quality exceeds expectations',
      'Customer service needs faster response times',
    ],
    recommended_actions: [
      'Hire additional support staff for faster responses',
      'Simplify returns process with clearer instructions',
      'Maintain current shipping partnerships',
    ],
    generated_at: new Date().toISOString(),
  };
};

// ==================== Internationalization ====================

export const getLocales = async (): Promise<Locale[]> => {
  await delay(400);
  
  return [
    {
      code: 'en-US',
      name: 'English (US)',
      native_name: 'English',
      default_currency: 'USD',
      date_format: 'MM/DD/YYYY',
      number_format: '1,234.56',
      rtl: false,
      is_active: true,
      completion_percentage: 100,
      created_at: new Date().toISOString(),
    },
    {
      code: 'en-AU',
      name: 'English (Australia)',
      native_name: 'English',
      default_currency: 'AUD',
      date_format: 'DD/MM/YYYY',
      number_format: '1,234.56',
      rtl: false,
      is_active: true,
      completion_percentage: 100,
      created_at: new Date().toISOString(),
    },
  ];
};

export const getCurrencyRate = async (from: string, to: string): Promise<CurrencyRate> => {
  await delay(300);
  
  return {
    from_currency: from,
    to_currency: to,
    rate: 1.52, // Example: USD to AUD
    source: 'openexchange',
    cached_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  };
};

// ==================== Growth Loops ====================

export const getGrowthLoops = async (): Promise<GrowthLoop[]> => {
  await delay(500);
  
  return [
    {
      id: 'loop-001',
      name: 'Referral Loop',
      trigger: 'Customer completes purchase',
      action: 'Receives referral link',
      incentive: '$25 credit for both parties',
      outcome: 'Friend signs up and orders',
      loop_completions: 156,
      avg_cycle_time_hours: 48.5,
      viral_coefficient: 0.32,
      is_active: true,
      health_score: 85,
      completions_over_time: Array.from({ length: 6 }, (_, index) => ({
        date: new Date(Date.now() - (5 - index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: Math.floor(18 + Math.random() * 6),
      })),
      last_measured: new Date().toISOString(),
    },
    {
      id: 'loop-002',
      name: 'Product Review Loop',
      trigger: 'Order delivered',
      action: 'Prompt to review with loyalty bonus',
      incentive: '50 EasyPoints',
      outcome: 'Review published boosting discovery',
      loop_completions: 284,
      avg_cycle_time_hours: 72,
      viral_coefficient: 0.18,
      is_active: true,
      health_score: 78,
      completions_over_time: Array.from({ length: 6 }, (_, index) => ({
        date: new Date(Date.now() - (5 - index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: Math.floor(40 + Math.random() * 12),
      })),
      last_measured: new Date().toISOString(),
    },
    {
      id: 'loop-003',
      name: 'Vendor Co-Marketing Loop',
      trigger: 'Vendor enables cross-promotions',
      action: 'Co-marketing assets automatically generated',
      incentive: 'Shared ad credit pool + boosted visibility',
      outcome: 'Partner vendor drives new traffic back',
      loop_completions: 48,
      avg_cycle_time_hours: 168,
      viral_coefficient: 0.42,
      is_active: false,
      health_score: 62,
      completions_over_time: Array.from({ length: 6 }, (_, index) => ({
        date: new Date(Date.now() - (5 - index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: Math.floor(6 + Math.random() * 4),
      })),
      last_measured: new Date().toISOString(),
    },
  ];
};

// ==================== Export All ====================

const growthAPI = {
  // Referrals
  getReferralProgram,
  sendReferralInvite,
  getReferralLeaderboard,
  
  // Experiments
  getExperiments,
  getVariantForUser,
  trackExperimentExposure,
  
  // Feature Flags
  getFeatureFlags,
  
  // Surveys
  getSurveys,
  submitSurveyResponse,
  getFeedbackSummary,
  
  // i18n
  getLocales,
  getCurrencyRate,
  
  // Growth Loops
  getGrowthLoops,
};

export default growthAPI;

