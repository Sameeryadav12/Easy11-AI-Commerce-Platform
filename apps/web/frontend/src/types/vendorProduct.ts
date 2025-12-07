/**
 * Vendor Product Management Types
 * Sprint 8: Complete product catalog intelligence system
 */

// ==================== Core Product Types ====================

export type ProductStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
export type ProductVisibility = 'public' | 'hidden' | 'scheduled';

export interface VendorProductFull {
  id: string;
  vendor_id: string;
  
  // Basic Info
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  brand?: string;
  manufacturer?: string;
  
  // Categorization
  category_id: string;
  category_name?: string;
  subcategory_id?: string;
  tags: string[];
  
  // Identifiers
  sku: string;
  barcode?: string;
  mpn?: string; // Manufacturer Part Number
  
  // Pricing
  cost_price: number; // What vendor pays
  sell_price: number; // What customer pays
  compare_at_price?: number; // Original price (for discounts)
  margin_percentage: number; // Auto-calculated
  
  // Inventory
  stock_quantity: number;
  low_stock_threshold: number;
  allow_backorder: boolean;
  track_inventory: boolean;
  
  // Media
  images: ProductImage[];
  videos?: ProductVideo[];
  primary_image_url?: string;
  
  // Variants
  has_variants: boolean;
  variants?: ProductVariant[];
  
  // SEO & Metadata
  seo: ProductSEO;
  
  // AI Scores
  ai_validation: AIValidationResult;
  seo_score: number; // 0-100
  compliance_score: number; // 0-100
  quality_score: number; // 0-100
  
  // Status & Workflow
  status: ProductStatus;
  visibility: ProductVisibility;
  published_at?: string;
  scheduled_publish_at?: string;
  rejection_reason?: string;
  moderation_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  
  // Analytics (read-only)
  metrics: ProductMetrics;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ==================== Product Variants ====================

export interface ProductVariant {
  id: string;
  vendor_product_id: string;
  
  // Variant Attributes
  name: string; // "Red / Large"
  sku: string;
  
  // Attributes
  color?: string;
  size?: string;
  material?: string;
  pattern?: string;
  custom_attributes?: Record<string, string>;
  
  // Pricing & Inventory
  price: number;
  cost_price: number;
  stock_quantity: number;
  
  // Media
  image_url?: string;
  
  // Status
  is_active: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface VariantOption {
  name: string; // "Color", "Size"
  values: string[]; // ["Red", "Blue"], ["S", "M", "L"]
}

// ==================== Product Images ====================

export interface ProductImage {
  id: string;
  product_id: string;
  vendor_id: string;
  
  // URLs
  url: string; // Original
  thumbnail_url?: string;
  medium_url?: string;
  
  // Metadata
  alt_text: string;
  caption?: string;
  is_primary: boolean;
  sort_order: number;
  
  // AI Analysis
  ai_tags: string[];
  quality_score: number; // 0-100
  ai_quality_issues?: string[];
  
  // Technical
  width: number;
  height: number;
  file_size: number;
  format: string; // jpg, png, webp
  
  created_at: string;
}

export interface ProductVideo {
  id: string;
  product_id: string;
  url: string;
  thumbnail_url?: string;
  duration_seconds: number;
  format: string;
  created_at: string;
}

// ==================== SEO ====================

export interface ProductSEO {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  focus_keyword?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  canonical_url?: string;
  schema_markup?: any; // Schema.org JSON-LD
}

export interface SEOSuggestion {
  type: 'title' | 'description' | 'keywords' | 'schema';
  current?: string;
  suggested: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
}

// ==================== AI Validation ====================

export interface AIValidationResult {
  overall_score: number; // 0-100
  checks: AIValidationCheck[];
  suggestions: string[];
  last_validated_at: string;
  model_version: string;
}

export interface AIValidationCheck {
  check_type: 
    | 'title_quality'
    | 'category_match'
    | 'image_quality'
    | 'description_quality'
    | 'compliance'
    | 'completeness'
    | 'pricing_anomaly';
  
  passed: boolean;
  score: number; // 0-100
  message: string;
  severity: 'error' | 'warning' | 'info';
  actionable_fix?: string;
}

export interface AIImageAnalysis {
  image_id: string;
  quality_score: number;
  issues: {
    type: 'blur' | 'low_resolution' | 'watermark' | 'poor_lighting' | 'cropping';
    severity: 'high' | 'medium' | 'low';
    message: string;
  }[];
  suggested_tags: string[];
  detected_objects: string[];
  background_quality: 'good' | 'fair' | 'poor';
}

// ==================== Inventory Management ====================

export interface InventoryLog {
  id: string;
  vendor_id: string;
  product_id: string;
  variant_id?: string;
  
  // Change Details
  previous_quantity: number;
  new_quantity: number;
  delta: number; // +5, -3, etc.
  
  // Reason
  reason: 
    | 'sale'
    | 'restock'
    | 'adjustment'
    | 'return'
    | 'damaged'
    | 'lost'
    | 'manual';
  notes?: string;
  
  // Actor
  actor_id: string;
  actor_type: 'vendor' | 'admin' | 'system';
  
  created_at: string;
}

export interface BatchInventoryUpdate {
  product_id: string;
  variant_id?: string;
  quantity: number;
  reason: string;
  notes?: string;
}

export interface LowStockAlert {
  product_id: string;
  product_name: string;
  current_stock: number;
  threshold: number;
  days_until_out: number;
  suggested_reorder_quantity: number;
  created_at: string;
}

// ==================== Pricing ====================

export interface PricingRule {
  id: string;
  vendor_id: string;
  
  name: string;
  description?: string;
  
  // Rule Type
  type: 
    | 'discount_percentage'
    | 'discount_fixed'
    | 'markup_percentage'
    | 'minimum_margin'
    | 'competitor_match';
  
  // Conditions
  applies_to: 'all' | 'category' | 'specific_products';
  category_ids?: string[];
  product_ids?: string[];
  
  // Values
  value: number;
  min_quantity?: number;
  max_quantity?: number;
  
  // Schedule
  start_date?: string;
  end_date?: string;
  
  // Status
  is_active: boolean;
  priority: number;
  
  created_at: string;
  updated_at: string;
}

export interface MarginCalculation {
  cost_price: number;
  sell_price: number;
  margin_amount: number;
  margin_percentage: number;
  markup_percentage: number;
  break_even_units: number;
  suggested_price_range: {
    min: number;
    optimal: number;
    max: number;
  };
}

// ==================== Product Metrics ====================

export interface ProductMetrics {
  // Sales
  total_sales: number;
  total_revenue: number;
  total_profit: number;
  units_sold: number;
  
  // Engagement
  views: number;
  clicks: number;
  conversion_rate: number; // clicks to sales
  
  // Performance
  avg_rating: number;
  reviews_count: number;
  return_rate: number;
  
  // Inventory
  days_in_stock: number;
  inventory_turnover: number;
  
  // Trends (7d, 30d)
  sales_trend_7d: number; // +12% or -5%
  sales_trend_30d: number;
  
  // Rankings
  category_rank?: number;
  overall_rank?: number;
  
  last_updated: string;
}

// ==================== Product Analytics ====================

export interface ProductAnalytics {
  product_id: string;
  period: '7d' | '30d' | '90d' | '1y' | 'all';
  
  // Time Series Data
  sales_over_time: { date: string; count: number; revenue: number }[];
  views_over_time: { date: string; count: number }[];
  conversion_over_time: { date: string; rate: number }[];
  
  // Customer Insights
  avg_order_value: number;
  repeat_purchase_rate: number;
  customer_segments: {
    segment: string;
    percentage: number;
  }[];
  
  // Geographic Performance
  top_regions: {
    region: string;
    sales: number;
    percentage: number;
  }[];
  
  // Traffic Sources
  traffic_sources: {
    source: string;
    visits: number;
    conversions: number;
  }[];
}

// ==================== Moderation & Approval ====================

export interface ModerationQueue {
  id: string;
  product_id: string;
  vendor_id: string;
  vendor_name: string;
  
  // Product Info
  product_name: string;
  category: string;
  images_count: number;
  
  // Validation Scores
  ai_score: number;
  compliance_score: number;
  seo_score: number;
  
  // Workflow
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  submitted_at: string;
  assigned_to?: string;
  reviewed_at?: string;
  
  // Priority
  priority: 'high' | 'medium' | 'low';
  auto_approval_eligible: boolean;
}

export interface ModerationAction {
  action: 'approve' | 'reject' | 'request_changes';
  notes?: string;
  rejection_reason?: string;
  required_changes?: string[];
}

export interface VendorReliabilityScore {
  vendor_id: string;
  vendor_name: string;
  
  // Scores (0-100)
  overall_score: number;
  product_quality_score: number;
  compliance_score: number;
  customer_satisfaction_score: number;
  
  // Stats
  total_products: number;
  approved_products: number;
  rejected_products: number;
  approval_rate: number;
  
  // Trust Level
  trust_level: 'new' | 'developing' | 'established' | 'trusted' | 'elite';
  auto_approval_enabled: boolean;
  
  // History
  violation_count: number;
  warning_count: number;
  last_violation_date?: string;
  
  updated_at: string;
}

// ==================== Product Creation Wizard ====================

export interface ProductWizardStep1 {
  name: string;
  description: string;
  short_description?: string;
  category_id: string;
  subcategory_id?: string;
  brand?: string;
  sku: string;
  barcode?: string;
  tags: string[];
}

export interface ProductWizardStep2 {
  cost_price: number;
  sell_price: number;
  compare_at_price?: number;
  stock_quantity: number;
  low_stock_threshold: number;
  allow_backorder: boolean;
  track_inventory: boolean;
}

export interface ProductWizardStep3 {
  images: File[];
  videos?: File[];
  generate_alt_text: boolean;
  enable_seo_optimization: boolean;
}

export interface ProductWizardStep4 {
  seo: Partial<ProductSEO>;
  apply_ai_suggestions: boolean;
}

// ==================== API Response Types ====================

export interface ProductListResponse {
  products: VendorProductFull[];
  total_count: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

export interface AIValidationResponse {
  validation: AIValidationResult;
  seo_suggestions: SEOSuggestion[];
  image_analysis: AIImageAnalysis[];
}

export interface InventoryBatchResponse {
  updated_count: number;
  failed_count: number;
  errors?: { product_id: string; error: string }[];
}

export interface ProductHealthScore {
  product_id: string;
  overall_health: number; // 0-100
  factors: {
    inventory_health: number;
    pricing_competitiveness: number;
    content_quality: number;
    customer_satisfaction: number;
    seo_performance: number;
  };
  recommendations: string[];
}

