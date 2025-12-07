/**
 * Vendor Orders API Service Layer
 * Sprint 9: Complete order operations with vendor-scoped security
 */

import type {
  VendorOrder,
  OrderStatus,
  OrderEvent,
  OrdersListResponse,
  OrdersReportFilters,
  VendorOrdersAnalytics,
  Return,
  ReturnStatus,
  ReturnsListResponse,
  Refund,
  Shipment,
  ShipmentPackage,
  ShippingRate,
  ShipmentsListResponse,
  VendorWallet,
  Payout,
  PayoutsListResponse,
  LedgerEntry,
  LedgerResponse,
  PayoutStatement,
  VendorBankDetails,
  VendorShippingPreset,
  VendorRefundPolicy,
} from '../types/vendorOrders';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ==================== Mock Data ====================

const mockOrder: VendorOrder = {
  id: 'vord-001',
  marketplace_order_id: 'ord-12345',
  vendor_id: 'vendor-123',
  customer_id: 'cust-456',
  order_number: 'ORD-12345-V1',
  
  // Customer (Masked PII)
  customer: {
    name: 'J***n D**',
    email: 'j***@example.com',
    phone: '+61 4** *** **8',
  },
  
  shipping_address: {
    full_name: 'John Doe',
    line1: '123 Main Street',
    line2: 'Apt 4B',
    city: 'Melbourne',
    state: 'Victoria',
    country: 'AU',
    postal_code: '3000',
    phone: '+61412345678',
  },
  
  items: [
    {
      id: 'item-001',
      order_id: 'vord-001',
      product_id: 'prod-001',
      vendor_id: 'vendor-123',
      product_name: 'Wireless Headphones',
      product_image: 'https://via.placeholder.com/100',
      sku: 'WH-001',
      quantity: 1,
      unit_price: 299.99,
      tax_rate: 0.10,
      tax_amount: 30.00,
      discount_allocation: 0,
      total_price: 329.99,
      status: 'pending',
      shipped_quantity: 0,
      refunded_quantity: 0,
      returned_quantity: 0,
    },
  ],
  
  subtotal: 299.99,
  tax: 30.00,
  shipping_fee: 12.00,
  discount: 0,
  total: 341.99,
  currency: 'AUD',
  
  platform_fee: 44.998, // 15% commission
  shipping_chargebacks: 0,
  vendor_payout: 267.00,
  
  status: 'new',
  
  risk_score: 25,
  risk_level: 'low',
  fraud_signals: [],
  requires_manual_review: false,
  
  acknowledge_by: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  is_late: false,
  
  customer_notes: 'Please leave at front door',
  
  channel: 'website',
  payment_method: 'Credit Card',
  payment_status: 'paid',
  
  placed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
};

const mockWallet: VendorWallet = {
  vendor_id: 'vendor-123',
  balance: 5420.50,
  hold_balance: 125.00,
  pending_balance: 842.30,
  total_balance: 6387.80,
  currency: 'AUD',
  next_payout_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  next_payout_amount: 5420.50,
  updated_at: new Date().toISOString(),
};

// ==================== Orders Management ====================

export const getVendorOrders = async (
  vendorId: string,
  filters?: OrdersReportFilters
): Promise<OrdersListResponse> => {
  await delay(500);
  
  return {
    orders: [mockOrder],
    total_count: 1,
    page: 1,
    per_page: 20,
    has_more: false,
    counts_by_status: {
      new: 1,
      acknowledged: 0,
      packing: 0,
      shipped: 0,
      delivered: 0,
      exception: 0,
      canceled: 0,
    },
  };
};

export const getOrder = async (vendorId: string, orderId: string): Promise<VendorOrder> => {
  await delay(400);
  return mockOrder;
};

export const acknowledgeOrder = async (
  vendorId: string,
  orderId: string,
  note?: string
): Promise<VendorOrder> => {
  await delay(500);
  
  return {
    ...mockOrder,
    status: 'acknowledged',
    acknowledged_at: new Date().toISOString(),
    vendor_notes: note,
  };
};

export const cancelOrder = async (
  vendorId: string,
  orderId: string,
  reason: string
): Promise<VendorOrder> => {
  await delay(600);
  
  return {
    ...mockOrder,
    status: 'canceled',
    canceled_at: new Date().toISOString(),
    vendor_notes: reason,
  };
};

export const getOrderEvents = async (orderId: string): Promise<OrderEvent[]> => {
  await delay(400);
  
  return [
    {
      id: 'evt-001',
      order_id: orderId,
      actor_id: 'cust-456',
      actor_type: 'customer',
      actor_name: 'John Doe',
      type: 'order_placed',
      payload: {},
      message: 'Order placed successfully',
      created_at: mockOrder.placed_at,
    },
  ];
};

export const addOrderNote = async (
  orderId: string,
  note: string
): Promise<OrderEvent> => {
  await delay(300);
  
  return {
    id: 'evt-' + Date.now(),
    order_id: orderId,
    actor_id: 'vendor-123',
    actor_type: 'vendor',
    type: 'note_added',
    payload: { note },
    message: note,
    created_at: new Date().toISOString(),
  };
};

// ==================== Shipping ====================

export const getShippingRates = async (
  orderId: string
): Promise<ShippingRate[]> => {
  await delay(800);
  
  return [
    {
      carrier: 'australia_post',
      carrier_name: 'Australia Post',
      service_type: 'express',
      service_name: 'Express Post',
      cost: 15.50,
      currency: 'AUD',
      estimated_days: 1,
      delivery_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      carrier: 'australia_post',
      carrier_name: 'Australia Post',
      service_type: 'standard',
      service_name: 'Regular Post',
      cost: 9.95,
      currency: 'AUD',
      estimated_days: 3,
      delivery_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

export const createShipment = async (
  vendorId: string,
  orderId: string,
  data: {
    packages: Partial<ShipmentPackage>[];
    carrier: string;
    service_type: string;
  }
): Promise<Shipment> => {
  await delay(1000); // Label purchase takes time
  
  return {
    id: 'ship-' + Date.now(),
    order_id: orderId,
    vendor_id: vendorId,
    carrier: data.carrier as any,
    carrier_name: 'Australia Post',
    service_type: data.service_type,
    tracking_number: 'AP' + Math.random().toString(36).substring(2, 15).toUpperCase(),
    tracking_url: 'https://auspost.com.au/track/AP123456789',
    label_url: 'https://easy11.com/labels/mock-label.pdf',
    label_format: 'pdf',
    label_cost: 15.50,
    packages: data.packages as ShipmentPackage[],
    status: 'label_purchased',
    status_timeline: [
      {
        timestamp: new Date().toISOString(),
        status: 'label_purchased',
        message: 'Shipping label purchased',
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const getShipments = async (vendorId: string): Promise<ShipmentsListResponse> => {
  await delay(400);
  return { shipments: [], total_count: 0 };
};

export const updateShipmentTracking = async (
  shipmentId: string,
  trackingNumber: string,
  carrier: string
): Promise<Shipment> => {
  await delay(400);
  
  return {
    ...({} as Shipment),
    tracking_number: trackingNumber,
    carrier: carrier as any,
    updated_at: new Date().toISOString(),
  };
};

// ==================== Returns & Refunds ====================

export const getReturns = async (vendorId: string): Promise<ReturnsListResponse> => {
  await delay(500);
  return { returns: [], total_count: 0, page: 1, per_page: 20, has_more: false };
};

export const getReturn = async (vendorId: string, returnId: string): Promise<Return> => {
  await delay(400);
  
  return {
    id: returnId,
    rma_code: 'RMA-12345',
    order_id: 'vord-001',
    vendor_id: vendorId,
    customer_id: 'cust-456',
    customer_name: 'J***n D**',
    customer_email: 'j***@example.com',
    reason_code: 'defective',
    reason_text: 'Product not working as expected',
    photo_urls: ['https://via.placeholder.com/400'],
    items: [],
    status: 'requested',
    approved_for_refund: false,
    requested_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const approveReturn = async (
  vendorId: string,
  returnId: string,
  labelType: 'prepaid' | 'customer_paid'
): Promise<Return> => {
  await delay(600);
  
  return {
    ...({} as Return),
    id: returnId,
    status: 'approved',
    label_type: labelType,
    label_url: labelType === 'prepaid' ? 'https://easy11.com/labels/rma-label.pdf' : undefined,
    approved_at: new Date().toISOString(),
  };
};

export const denyReturn = async (
  vendorId: string,
  returnId: string,
  reason: string
): Promise<Return> => {
  await delay(500);
  
  return {
    ...({} as Return),
    id: returnId,
    status: 'denied',
    denial_reason: reason,
    denied_at: new Date().toISOString(),
  };
};

export const createRefund = async (
  vendorId: string,
  orderId: string,
  data: {
    items: { order_item_id: string; quantity: number; amount: number }[];
    reason: string;
    method: 'original_payment' | 'store_credit';
    stepup_token?: string;
  }
): Promise<Refund> => {
  await delay(800); // Refund processing
  
  const totalAmount = data.items.reduce((sum, item) => sum + item.amount, 0);
  
  return {
    id: 'ref-' + Date.now(),
    order_id: orderId,
    vendor_id: vendorId,
    amount: totalAmount,
    currency: 'AUD',
    items_refund: totalAmount,
    tax_refund: totalAmount * 0.1,
    shipping_refund: 0,
    restocking_fee: 0,
    net_refund: totalAmount,
    method: data.method,
    reason: data.reason,
    approved_by: 'vendor-123',
    stepup_token_id: data.stepup_token,
    requires_admin_approval: totalAmount > 500,
    status: 'processing',
    created_at: new Date().toISOString(),
  };
};

// ==================== Payouts & Ledger ====================

export const getVendorWallet = async (vendorId: string): Promise<VendorWallet> => {
  await delay(400);
  return mockWallet;
};

export const getPayouts = async (vendorId: string): Promise<PayoutsListResponse> => {
  await delay(500);
  
  return {
    payouts: [
      {
        id: 'payout-001',
        vendor_id: vendorId,
        period_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        period_end: new Date().toISOString(),
        schedule_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        gross_revenue: 6250.00,
        platform_fees: 937.50,
        refunds: 0,
        chargebacks: 0,
        adjustments: 0,
        net_payout: 5312.50,
        currency: 'AUD',
        status: 'pending',
        orders_count: 21,
        orders_ids: ['ord-1', 'ord-2'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    upcoming_payout: {
      id: 'payout-002',
      vendor_id: vendorId,
      period_start: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      period_end: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      schedule_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      gross_revenue: 3420.00,
      platform_fees: 513.00,
      refunds: 0,
      chargebacks: 0,
      adjustments: 0,
      net_payout: 2907.00,
      currency: 'AUD',
      status: 'pending',
      orders_count: 12,
      orders_ids: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    total_count: 1,
  };
};

export const getLedger = async (
  vendorId: string,
  page: number = 1,
  per_page: number = 50
): Promise<LedgerResponse> => {
  await delay(500);
  
  return {
    entries: [
      {
        id: 'ledger-001',
        vendor_id: vendorId,
        transaction_type: 'earn',
        reference_id: 'ord-12345',
        reference_type: 'order',
        amount: 267.00,
        currency: 'AUD',
        balance_after: 5420.50,
        description: 'Order #12345 - Wireless Headphones',
        meta: {},
        hash_prev: '0x0000',
        hash_current: '0xabcd',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
    total_count: 1,
    page,
    per_page,
    current_balance: mockWallet.balance,
  };
};

export const getPayoutStatement = async (payoutId: string): Promise<PayoutStatement> => {
  await delay(600);
  
  return {
    payout_id: payoutId,
    vendor_id: 'vendor-123',
    period_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    period_end: new Date().toISOString(),
    total_orders: 21,
    gross_revenue: 6250.00,
    platform_fees: {
      commission: 937.50,
      payment_processing: 0,
      other: 0,
      total: 937.50,
    },
    refunds: 0,
    chargebacks: 0,
    adjustments: 0,
    total_deductions: 937.50,
    net_payout: 5312.50,
    line_items: [],
    generated_at: new Date().toISOString(),
  };
};

// ==================== Analytics ====================

export const getOrdersAnalytics = async (
  vendorId: string,
  period: string
): Promise<VendorOrdersAnalytics> => {
  await delay(700);
  
  return {
    vendor_id: vendorId,
    period: period as any,
    total_orders: 328,
    total_revenue: 125680.50,
    avg_order_value: 383.29,
    avg_acknowledge_time_hours: 4.5,
    avg_ship_time_hours: 18.2,
    on_time_ship_rate: 96.3,
    return_rate: 3.2,
    total_refunds: 2450.00,
    refund_rate: 1.95,
    high_risk_orders: 8,
    fraud_blocks: 2,
    orders_over_time: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 30) + 10,
      revenue: Math.floor(Math.random() * 8000) + 2000,
    })),
    top_products: [],
    sla_compliance_rate: 94.8,
    late_orders: 12,
  };
};

// ==================== Reports ====================

export const exportOrdersReport = async (
  vendorId: string,
  filters: OrdersReportFilters,
  stepupToken: string
): Promise<{ download_url: string; expires_at: string }> => {
  await delay(1500); // CSV generation
  
  return {
    download_url: 'https://easy11.com/exports/orders-2025-11-03.csv',
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
};

// ==================== Vendor Settings ====================

export const getBankDetails = async (vendorId: string): Promise<VendorBankDetails> => {
  await delay(400);
  
  return {
    vendor_id: vendorId,
    account_holder_name: 'TechCo Electronics Pty Ltd',
    bank_name: 'Commonwealth Bank',
    bsb: '123-456',
    account_number_last4: '7890',
    account_number_encrypted: 'encrypted_data_here',
    is_verified: true,
    verified_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    kyc_status: 'approved',
    updated_at: new Date().toISOString(),
  };
};

export const updateBankDetails = async (
  vendorId: string,
  data: Partial<VendorBankDetails>,
  stepupToken: string
): Promise<VendorBankDetails> => {
  await delay(800);
  
  return {
    vendor_id: vendorId,
    account_holder_name: data.account_holder_name || '',
    bank_name: data.bank_name || '',
    bsb: data.bsb,
    account_number_last4: '****',
    account_number_encrypted: 'new_encrypted_data',
    is_verified: false, // Needs re-verification
    kyc_status: 'pending',
    updated_at: new Date().toISOString(),
  };
};

export const getRefundPolicy = async (vendorId: string): Promise<VendorRefundPolicy> => {
  await delay(300);
  
  return {
    vendor_id: vendorId,
    accepts_returns: true,
    return_window_days: 30,
    conditions: ['Original packaging', 'Unused', 'With all accessories'],
    restocking_fee_percentage: 10,
    auto_approve_defective: true,
    auto_approve_wrong_item: true,
    updated_at: new Date().toISOString(),
  };
};

// ==================== Export All ====================

const vendorOrdersAPI = {
  // Orders
  getVendorOrders,
  getOrder,
  acknowledgeOrder,
  cancelOrder,
  getOrderEvents,
  addOrderNote,
  
  // Shipping
  getShippingRates,
  createShipment,
  getShipments,
  updateShipmentTracking,
  
  // Returns
  getReturns,
  getReturn,
  approveReturn,
  denyReturn,
  
  // Refunds
  createRefund,
  
  // Payouts & Ledger
  getVendorWallet,
  getPayouts,
  getLedger,
  getPayoutStatement,
  
  // Analytics
  getOrdersAnalytics,
  
  // Reports
  exportOrdersReport,
  
  // Settings
  getBankDetails,
  updateBankDetails,
  getRefundPolicy,
};

export default vendorOrdersAPI;

