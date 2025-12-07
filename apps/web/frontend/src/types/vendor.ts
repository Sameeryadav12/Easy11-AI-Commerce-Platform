/**
 * Vendor System TypeScript Types
 * Sprint 7: Unified Integration, Vendor Portal & Launch Foundation
 */

// ==================== Vendor Management ====================

export type VendorStatus = 'pending' | 'active' | 'suspended' | 'rejected' | 'kyc_required';
export type VendorTier = 'starter' | 'growth' | 'enterprise';
export type KYCStatus = 'not_started' | 'in_progress' | 'submitted' | 'approved' | 'rejected';

export interface Vendor {
  id: string;
  business_name: string;
  legal_name: string;
  slug: string; // e.g., "techco-electronics"
  status: VendorStatus;
  tier: VendorTier;
  email: string;
  phone: string;
  
  // Business Details
  abn?: string; // Australian Business Number
  acn?: string; // Australian Company Number
  business_type: 'sole_trader' | 'partnership' | 'company' | 'trust';
  industry: string;
  description: string;
  logo_url?: string;
  banner_url?: string;
  
  // Address
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  
  // KYC
  kyc_status: KYCStatus;
  kyc_submitted_at?: string;
  kyc_approved_at?: string;
  kyc_rejection_reason?: string;
  
  // Metrics
  metrics: {
    products_count: number;
    orders_count: number;
    revenue_total: number;
    revenue_30d: number;
    avg_rating: number;
    reviews_count: number;
  };
  
  // Financials
  commission_rate: number; // e.g., 0.15 for 15%
  payout_schedule: 'weekly' | 'biweekly' | 'monthly';
  stripe_account_id?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  approved_at?: string;
}

export interface VendorRegistrationData {
  business_name: string;
  legal_name: string;
  email: string;
  phone: string;
  password: string;
  business_type: 'sole_trader' | 'partnership' | 'company' | 'trust';
  industry: string;
  abn?: string;
  acn?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
}

// ==================== KYC (Know Your Customer) ====================

export type KYCDocumentType = 
  | 'government_id' // Driver's license, passport
  | 'business_registration' // ABN/ACN certificate
  | 'proof_of_address' // Utility bill, bank statement
  | 'bank_details' // Bank statement
  | 'director_id'; // For companies

export interface KYCDocument {
  id: string;
  vendor_id: string;
  type: KYCDocumentType;
  file_url: string;
  file_name: string;
  file_size: number;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  uploaded_at: string;
  reviewed_at?: string;
  reviewed_by?: string; // Admin user ID
}

export interface KYCSubmission {
  vendor_id: string;
  documents: {
    government_id: File;
    business_registration?: File;
    proof_of_address: File;
    bank_details: File;
    director_id?: File; // Required for companies
  };
  declaration: {
    is_owner: boolean;
    is_authorized: boolean;
    accepts_terms: boolean;
  };
}

// ==================== Vendor Products ====================

export interface VendorProduct {
  id: string;
  vendor_id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  category: string;
  subcategory?: string;
  
  // Pricing
  price: number;
  compare_at_price?: number; // For showing discounts
  cost_price?: number; // For profit calculations (vendor-only)
  
  // Inventory
  sku: string;
  barcode?: string;
  stock_quantity: number;
  low_stock_threshold: number;
  allow_backorder: boolean;
  
  // Media
  images: string[]; // URLs
  video_url?: string;
  
  // Specifications
  specifications?: Record<string, string>;
  variants?: ProductVariant[];
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  
  // Status
  status: 'draft' | 'active' | 'out_of_stock' | 'archived';
  visibility: 'public' | 'hidden';
  
  // Metrics
  views_count: number;
  sales_count: number;
  avg_rating: number;
  reviews_count: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface ProductVariant {
  id: string;
  name: string; // "Red / Large"
  sku: string;
  price: number;
  stock_quantity: number;
  attributes: Record<string, string>; // { color: "Red", size: "Large" }
}

// ==================== Vendor Orders ====================

export type VendorOrderStatus =
  | 'pending' // Customer paid, vendor needs to confirm
  | 'confirmed' // Vendor confirmed
  | 'preparing' // Vendor is preparing the order
  | 'shipped' // Vendor shipped
  | 'delivered' // Customer received
  | 'cancelled' // Cancelled by customer or vendor
  | 'refunded'; // Fully refunded

export interface VendorOrder {
  id: string;
  order_number: string; // e.g., "ORD-12345"
  vendor_id: string;
  customer_id: string;
  
  // Customer Info (readonly for vendor)
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  
  // Shipping
  shipping_address: {
    full_name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    phone: string;
  };
  
  // Items
  items: VendorOrderItem[];
  
  // Financials
  subtotal: number;
  shipping_fee: number;
  tax: number;
  total: number;
  commission_fee: number; // Easy11's commission
  vendor_payout: number; // What vendor receives
  currency?: string;
  
  // Status & Tracking
  status: VendorOrderStatus;
  tracking_number?: string;
  carrier?: string; // "Australia Post", "FedEx", etc.
  estimated_delivery?: string;
  fulfillment_sla?: {
    promised_dispatch_at: string;
    promised_delivery_at: string;
    breach_risk?: 'low' | 'medium' | 'high';
  };
  
  // Notes
  customer_notes?: string;
  vendor_notes?: string;
  internal_notes?: VendorOrderNote[];
  
  // Timestamps
  created_at: string;
  confirmed_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  refunded_at?: string;

  // Intelligence
  timeline?: VendorOrderTimelineEvent[];
  payment?: VendorOrderPayment;
  refund?: RefundSummary;
  issues?: VendorOrderIssue[];
}

export interface VendorOrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  variant_name?: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface VendorOrderTimelineEvent {
  id: string;
  status: VendorOrderStatus | 'refunded';
  title?: string;
  description?: string;
  timestamp: string;
  actor?: {
    type: 'system' | 'vendor' | 'customer' | 'support';
    name: string;
    user_id?: string;
  };
  metadata?: Record<string, string | number>;
}

export interface VendorOrderPayment {
  method: 'card' | 'paypal' | 'afterpay' | 'bank_transfer';
  processor: string;
  transaction_id: string;
  status: 'authorized' | 'captured' | 'refunded' | 'partially_refunded' | 'failed';
  amount_charged: number;
  fees_total: number;
  currency: string;
  captured_at: string;
  installments?: {
    count: number;
    amount_per_installment: number;
    schedule: string[];
  };
  breakdown?: {
    platform_fee: number;
    payment_processing_fee: number;
    taxes: number;
  };
}

export interface RefundSummary {
  id: string;
  amount: number;
  currency: string;
  reason?: string;
  initiated_at: string;
  processed_at?: string;
  status: 'pending' | 'processed' | 'failed';
  actor?: string;
}

export interface VendorOrderIssue {
  id: string;
  type: 'delay' | 'damage' | 'lost' | 'customer_support';
  severity: 'low' | 'medium' | 'high';
  description: string;
  opened_at: string;
  resolved_at?: string;
  resolution_notes?: string;
}

export interface VendorOrderNote {
  id: string;
  author: {
    name: string;
    role: 'vendor' | 'support';
  };
  message: string;
  created_at: string;
  visibility: 'internal' | 'shared';
}

// ==================== Vendor Analytics ====================

export interface VendorAnalytics {
  vendor_id: string;
  period: 'today' | '7d' | '30d' | '90d' | '1y' | 'all';
  
  // Revenue
  revenue: {
    total: number;
    change_percent: number;
    chart: { date: string; value: number }[];
  };
  
  // Orders
  orders: {
    total: number;
    change_percent: number;
    avg_order_value: number;
    chart: { date: string; value: number }[];
  };
  
  // Products
  products: {
    total: number;
    active: number;
    out_of_stock: number;
    low_stock: number;
  };
  
  // Customers
  customers: {
    total: number;
    new: number;
    returning: number;
    repeat_rate: number;
  };
  
  // Top Products
  top_products: {
    product_id: string;
    name: string;
    sales: number;
    revenue: number;
  }[];
  
  // Performance
  performance: {
    avg_fulfillment_time: number; // hours
    on_time_delivery_rate: number; // percentage
    cancellation_rate: number; // percentage
    return_rate: number; // percentage
  };

  // Traffic & acquisition
  traffic_sources: {
    channel: string;
    visits: number;
    conversions: number;
    revenue: number;
  }[];

  // Customer retention cohorts
  retention: {
    cohort: string;
    retention_rate: number;
    change_vs_prior: number;
    lifetime_value: number;
  }[];

  // Experimentation summary
  experiment_summary: {
    id: string;
    name: string;
    status: 'running' | 'completed' | 'paused';
    uplift: number;
    significance: number;
    primary_metric: string;
  }[];

  // Alerts and anomalies
  anomaly_alerts: {
    metric: string;
    severity: 'info' | 'warning' | 'critical';
    message: string;
    detected_at: string;
    action?: string;
  }[];
}

// ==================== Vendor Payouts ====================

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed';

export interface VendorPayout {
  id: string;
  vendor_id: string;
  period_start: string;
  period_end: string;
  
  // Financials
  gross_revenue: number;
  commission_fee: number;
  refunds: number;
  adjustments: number;
  net_payout: number;
  
  // Status
  status: PayoutStatus;
  scheduled_date: string;
  paid_date?: string;
  
  // Payment Details
  payment_method: 'bank_transfer' | 'stripe' | 'paypal';
  transaction_id?: string;
  
  // Breakdown
  orders_count: number;
  orders_ids: string[];
  
  created_at: string;
}

// ==================== RBAC (Role-Based Access Control) ====================

export type UserRole = 'customer' | 'vendor' | 'admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  
  // Vendor-specific
  vendor_id?: string; // If role is 'vendor'
  
  // Permissions (for admins)
  permissions?: string[];
  
  // Status
  is_active: boolean;
  is_verified: boolean;
  
  created_at: string;
  last_login_at?: string;
}

export interface Permission {
  id: string;
  name: string; // "vendors.create", "products.approve", "orders.view_all"
  description: string;
  category: 'vendors' | 'products' | 'orders' | 'customers' | 'analytics' | 'settings';
}

// ==================== Admin Vendor Management ====================

export interface VendorApplicationReview {
  vendor_id: string;
  reviewer_id: string; // Admin user ID
  reviewer_name: string;
  action: 'approve' | 'reject' | 'request_info';
  notes?: string;
  reviewed_at: string;
}

export interface VendorSuspension {
  vendor_id: string;
  reason: string;
  suspended_by: string; // Admin user ID
  suspended_at: string;
  expires_at?: string; // Null for permanent suspension
}

// ==================== API Response Types ====================

export interface VendorListResponse {
  vendors: Vendor[];
  total_count: number;
  has_more: boolean;
}

export interface VendorResponse {
  vendor: Vendor;
}

export interface VendorProductListResponse {
  products: VendorProduct[];
  total_count: number;
  has_more: boolean;
}

export interface VendorOrderListResponse {
  orders: VendorOrder[];
  total_count: number;
  has_more: boolean;
}

export interface VendorAnalyticsResponse {
  analytics: VendorAnalytics;
}

export interface VendorPayoutListResponse {
  payouts: VendorPayout[];
  total_count: number;
  next_payout?: VendorPayout;
}

// ==================== Error Types ====================

export interface VendorError {
  code: string;
  message: string;
  field?: string;
}

