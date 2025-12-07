/**
 * Vendor Orders, Returns & Payouts Types
 * Sprint 9: Marketplace-grade order operations
 */

// ==================== Core Order Types ====================

export type OrderStatus = 
  | 'new' 
  | 'acknowledged' 
  | 'packing' 
  | 'shipped' 
  | 'delivered' 
  | 'exception' 
  | 'canceled';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface VendorOrder {
  id: string;
  marketplace_order_id: string; // Overall order ID
  vendor_id: string;
  customer_id: string;
  
  // Order Details
  order_number: string; // e.g., "ORD-12345-V1"
  
  // Customer Info (PII Masked by role)
  customer: {
    name: string; // Masked: "J***n D**"
    email: string; // Masked: "j***@example.com"
    phone: string; // Masked: "+61 4** *** **8"
  };
  
  // Shipping Address (Masked)
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
  
  // Billing (Masked)
  billing_address?: {
    full_name: string;
    line1: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  
  // Line Items
  items: OrderItem[];
  
  // Financials
  subtotal: number;
  tax: number;
  shipping_fee: number;
  discount: number;
  total: number;
  currency: string; // ISO 4217 (AUD, USD)
  
  // Vendor Earnings
  platform_fee: number; // Easy11's commission
  shipping_chargebacks: number;
  vendor_payout: number; // What vendor receives
  
  // Status & Workflow
  status: OrderStatus;
  acknowledged_at?: string;
  packed_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  canceled_at?: string;
  
  // Risk & Fraud
  risk_score: number; // 0-100
  risk_level: RiskLevel;
  fraud_signals?: FraudSignal[];
  requires_manual_review: boolean;
  
  // SLA & Tracking
  acknowledge_by: string; // Deadline (e.g., 24h from placed_at)
  ship_by?: string;
  is_late: boolean;
  
  // Notes & Communication
  customer_notes?: string;
  vendor_notes?: string;
  internal_notes?: string; // Staff only
  
  // Metadata
  channel: 'website' | 'mobile_app' | 'marketplace';
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'refunded' | 'partially_refunded';
  
  // Timestamps
  placed_at: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  vendor_id: string;
  
  // Product Info
  product_name: string;
  product_image: string;
  sku: string;
  variant_name?: string;
  
  // Pricing
  quantity: number;
  unit_price: number;
  tax_rate: number;
  tax_amount: number;
  discount_allocation: number;
  total_price: number;
  
  // Status
  status: 'pending' | 'fulfilled' | 'refunded' | 'returned';
  
  // Fulfillment
  shipped_quantity: number;
  refunded_quantity: number;
  returned_quantity: number;
}

export interface OrderEvent {
  id: string;
  order_id: string;
  
  // Actor
  actor_id: string;
  actor_type: 'vendor' | 'customer' | 'admin' | 'system';
  actor_name?: string;
  
  // Event
  type: 
    | 'order_placed'
    | 'order_acknowledged'
    | 'order_packed'
    | 'order_shipped'
    | 'order_delivered'
    | 'order_canceled'
    | 'refund_issued'
    | 'return_requested'
    | 'note_added'
    | 'status_changed';
  
  // Details
  payload: any;
  message?: string;
  
  // Metadata
  ip_address?: string;
  user_agent?: string;
  
  created_at: string;
}

export interface FraudSignal {
  type: 
    | 'first_time_buyer'
    | 'high_order_value'
    | 'address_mismatch'
    | 'velocity_spike'
    | 'suspicious_device'
    | 'email_domain_risk'
    | 'payment_decline_history';
  
  severity: 'low' | 'medium' | 'high';
  message: string;
  confidence: number; // 0-100
}

// ==================== Returns & Refunds ====================

export type ReturnStatus = 
  | 'requested'
  | 'approved'
  | 'denied'
  | 'label_issued'
  | 'in_transit'
  | 'received'
  | 'inspected'
  | 'refunded'
  | 'closed';

export type ReturnReason = 
  | 'defective'
  | 'wrong_item'
  | 'size_fit'
  | 'not_as_described'
  | 'buyer_remorse'
  | 'arrived_late'
  | 'damaged_shipping'
  | 'other';

export type ItemCondition = 'new' | 'opened' | 'used' | 'damaged';

export interface Return {
  id: string;
  rma_code: string; // e.g., "RMA-12345"
  order_id: string;
  vendor_id: string;
  customer_id: string;
  
  // Customer Info
  customer_name: string;
  customer_email: string;
  
  // Reason
  reason_code: ReturnReason;
  reason_text?: string;
  photo_urls: string[];
  
  // Items
  items: ReturnItem[];
  
  // Status & Workflow
  status: ReturnStatus;
  decision?: 'approved' | 'denied' | 'partial';
  denial_reason?: string;
  
  // RMA Label
  label_type?: 'prepaid' | 'customer_paid';
  label_url?: string;
  tracking_number?: string;
  carrier?: string;
  
  // Inspection (After receipt)
  received_at?: string;
  inspected_at?: string;
  inspection_notes?: string;
  approved_for_refund: boolean;
  
  // Refund
  refund_id?: string;
  refund_amount?: number;
  restocking_fee?: number;
  
  // Timestamps
  requested_at: string;
  approved_at?: string;
  denied_at?: string;
  closed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReturnItem {
  id: string;
  return_id: string;
  order_item_id: string;
  
  // Product Info
  product_name: string;
  product_image: string;
  sku: string;
  
  // Return Details
  quantity: number;
  condition: ItemCondition;
  defect_description?: string;
  
  // Inspection Results
  inspection_passed: boolean;
  inspection_notes?: string;
  
  // Refund
  refund_amount: number;
  restocking_fee: number;
  net_refund: number;
}

export interface Refund {
  id: string;
  order_id: string;
  return_id?: string; // If from a return
  vendor_id: string;
  
  // Amount
  amount: number;
  currency: string;
  
  // Breakdown
  items_refund: number;
  tax_refund: number;
  shipping_refund: number;
  restocking_fee: number;
  net_refund: number;
  
  // Method
  method: 'original_payment' | 'store_credit';
  
  // Reason
  reason: string;
  reason_code?: string;
  
  // Approval
  approved_by: string;
  stepup_token_id?: string; // For large refunds
  requires_admin_approval: boolean;
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processed_at?: string;
  failed_reason?: string;
  
  created_at: string;
}

// ==================== Shipping ====================

export type ShipmentStatus = 
  | 'created'
  | 'label_purchased'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed_delivery'
  | 'returned_to_sender'
  | 'exception';

export type Carrier = 
  | 'australia_post'
  | 'startrack'
  | 'fedex'
  | 'dhl'
  | 'ups'
  | 'other';

export interface Shipment {
  id: string;
  order_id: string;
  vendor_id: string;
  
  // Carrier & Service
  carrier: Carrier;
  carrier_name: string;
  service_type: string; // "Express", "Standard", "Economy"
  
  // Tracking
  tracking_number: string;
  tracking_url?: string;
  
  // Label
  label_url: string;
  label_format: 'pdf' | 'png' | 'zpl';
  label_cost: number;
  
  // Package Details
  packages: ShipmentPackage[];
  
  // Status & Timeline
  status: ShipmentStatus;
  status_timeline: ShipmentStatusEvent[];
  
  // Dates
  shipped_at?: string;
  estimated_delivery?: string;
  delivered_at?: string;
  
  // Notes
  notes?: string;
  
  created_at: string;
  updated_at: string;
}

export interface ShipmentPackage {
  id: string;
  shipment_id: string;
  
  // Dimensions
  weight_grams: number;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  
  // Contents
  items: {
    order_item_id: string;
    quantity: number;
  }[];
  
  // Packaging
  package_type?: string; // "box", "envelope", "tube"
  signature_required: boolean;
  insured_value?: number;
}

export interface ShipmentStatusEvent {
  timestamp: string;
  status: string;
  location?: string;
  message: string;
  carrier_status_code?: string;
}

export interface ShippingRate {
  carrier: Carrier;
  carrier_name: string;
  service_type: string;
  service_name: string;
  cost: number;
  currency: string;
  estimated_days: number;
  delivery_date?: string;
}

// ==================== Payouts & Ledger ====================

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'on_hold';

export type LedgerTransactionType = 
  | 'earn' // Order revenue
  | 'fee' // Platform fee
  | 'refund' // Refund deduction
  | 'chargeback' // Chargeback deduction
  | 'payout' // Disbursement
  | 'adjustment' // Manual correction
  | 'hold' // Fraud hold
  | 'release'; // Hold release

export interface VendorWallet {
  vendor_id: string;
  
  // Balance
  balance: number; // Available for payout
  hold_balance: number; // Frozen (fraud/disputes)
  pending_balance: number; // Not yet cleared
  total_balance: number; // balance + hold_balance + pending_balance
  
  // Currency
  currency: string;
  
  // Next Payout
  next_payout_date?: string;
  next_payout_amount?: number;
  
  updated_at: string;
}

export interface Payout {
  id: string;
  vendor_id: string;
  
  // Schedule
  period_start: string;
  period_end: string;
  schedule_date: string; // When it's supposed to go out
  
  // Amount
  gross_revenue: number;
  platform_fees: number;
  refunds: number;
  chargebacks: number;
  adjustments: number;
  net_payout: number;
  currency: string;
  
  // Status
  status: PayoutStatus;
  status_message?: string;
  
  // Bank Transfer
  bank_reference?: string;
  paid_at?: string;
  failed_at?: string;
  failure_reason?: string;
  
  // Documents
  statement_url?: string;
  invoice_url?: string;
  
  // Breakdown
  orders_count: number;
  orders_ids: string[];
  
  created_at: string;
  updated_at: string;
}

export interface LedgerEntry {
  id: string;
  vendor_id: string;
  
  // Transaction
  transaction_type: LedgerTransactionType;
  reference_id: string; // Order ID, Refund ID, etc.
  reference_type: 'order' | 'refund' | 'payout' | 'adjustment';
  
  // Amount
  amount: number; // Positive for earn, negative for deductions
  currency: string;
  
  // Balance After
  balance_after: number;
  
  // Metadata
  description: string;
  meta: any;
  
  // Hash Chain (Immutable audit)
  hash_prev: string;
  hash_current: string;
  
  created_at: string;
}

export interface PayoutStatement {
  payout_id: string;
  vendor_id: string;
  period_start: string;
  period_end: string;
  
  // Summary
  total_orders: number;
  gross_revenue: number;
  
  // Fees Breakdown
  platform_fees: {
    commission: number;
    payment_processing: number;
    other: number;
    total: number;
  };
  
  // Deductions
  refunds: number;
  chargebacks: number;
  adjustments: number;
  total_deductions: number;
  
  // Net
  net_payout: number;
  
  // Line Items
  line_items: PayoutLineItem[];
  
  generated_at: string;
}

export interface PayoutLineItem {
  date: string;
  type: string;
  reference: string; // Order #, Refund #
  description: string;
  amount: number;
  fee: number;
  net: number;
}

// ==================== Vendor Settings ====================

export interface VendorBankDetails {
  vendor_id: string;
  
  // Bank Info (Encrypted)
  account_holder_name: string;
  bank_name: string;
  bsb?: string; // Australia
  account_number_last4: string; // Masked
  account_number_encrypted: string; // Full number (encrypted)
  
  // Verification
  is_verified: boolean;
  verified_at?: string;
  
  // KYC
  kyc_status: 'not_started' | 'pending' | 'approved' | 'rejected';
  kyc_documents?: string[];
  
  updated_at: string;
}

export interface VendorShippingPreset {
  id: string;
  vendor_id: string;
  
  name: string; // "Default Box", "Large Parcel"
  
  // Dimensions
  weight_grams: number;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  
  // Preferred Carrier
  carrier?: Carrier;
  service_type?: string;
  
  is_default: boolean;
  
  created_at: string;
}

export interface VendorRefundPolicy {
  vendor_id: string;
  
  // Policy
  accepts_returns: boolean;
  return_window_days: number; // e.g., 30 days
  
  // Conditions
  conditions: string[]; // "Original packaging", "Unused", etc.
  restocking_fee_percentage: number;
  
  // Auto-approval Rules
  auto_approve_defective: boolean;
  auto_approve_wrong_item: boolean;
  
  // Exceptions
  non_returnable_categories?: string[];
  
  updated_at: string;
}

// ==================== Reports & Analytics ====================

export interface OrdersReportFilters {
  date_from?: string;
  date_to?: string;
  status?: OrderStatus[];
  risk_level?: RiskLevel[];
  channel?: string[];
  min_amount?: number;
  max_amount?: number;
}

export interface VendorOrdersAnalytics {
  vendor_id: string;
  period: '7d' | '30d' | '90d' | '1y';
  
  // Order Stats
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  
  // Fulfillment
  avg_acknowledge_time_hours: number;
  avg_ship_time_hours: number;
  on_time_ship_rate: number; // %
  
  // Returns & Refunds
  return_rate: number; // %
  total_refunds: number;
  refund_rate: number; // %
  
  // Risk
  high_risk_orders: number;
  fraud_blocks: number;
  
  // Trends
  orders_over_time: { date: string; count: number; revenue: number }[];
  top_products: { product_id: string; name: string; units: number; revenue: number }[];
  
  // SLA Compliance
  sla_compliance_rate: number; // %
  late_orders: number;
}

// ==================== API Response Types ====================

export interface OrdersListResponse {
  orders: VendorOrder[];
  total_count: number;
  page: number;
  per_page: number;
  has_more: boolean;
  counts_by_status: Record<OrderStatus, number>;
}

export interface ReturnsListResponse {
  returns: Return[];
  total_count: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

export interface ShipmentsListResponse {
  shipments: Shipment[];
  total_count: number;
}

export interface PayoutsListResponse {
  payouts: Payout[];
  upcoming_payout?: Payout;
  total_count: number;
}

export interface LedgerResponse {
  entries: LedgerEntry[];
  total_count: number;
  page: number;
  per_page: number;
  current_balance: number;
}

// ==================== Step-Up Auth ====================

export interface StepUpRequirement {
  action: string;
  reason: string;
  requires_mfa: boolean;
  timeout_seconds: number;
}

// ==================== Rate Limiting ====================

export interface RateLimitInfo {
  action: string;
  limit: number;
  remaining: number;
  reset_at: string;
}

