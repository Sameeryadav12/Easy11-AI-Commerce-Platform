/**
 * Vendor API Service Layer
 * Sprint 7: Unified Integration & Vendor Portal
 * Mock implementations - replace with real backend calls
 */

import type {
  Vendor,
  VendorRegistrationData,
  VendorProduct,
  VendorOrder,
  VendorOrderStatus,
  VendorAnalytics,
  VendorPayout,
  KYCDocument,
  KYCSubmission,
  User,
  VendorOrderNote,
} from '../types/vendor';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ==================== Mock Data ====================

const mockVendor: Vendor = {
  id: 'vendor-123',
  business_name: 'TechCo Electronics',
  legal_name: 'TechCo Electronics Pty Ltd',
  slug: 'techco-electronics',
  status: 'active',
  tier: 'growth',
  email: 'vendor@techco.com.au',
  phone: '+61412345678',
  abn: '12 345 678 901',
  business_type: 'company',
  industry: 'Electronics',
  description: 'Premium electronics and gadgets supplier',
  logo_url: 'https://via.placeholder.com/150',
  address: {
    line1: '123 Tech Street',
    city: 'Melbourne',
    state: 'Victoria',
    country: 'AU',
    postal_code: '3000',
  },
  kyc_status: 'approved',
  kyc_approved_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  metrics: {
    products_count: 45,
    orders_count: 328,
    revenue_total: 125680.50,
    revenue_30d: 15420.00,
    avg_rating: 4.7,
    reviews_count: 142,
  },
  commission_rate: 0.15,
  payout_schedule: 'weekly',
  stripe_account_id: 'acct_1234567890',
  created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
  approved_at: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
};

const mockProducts: VendorProduct[] = [
  {
    id: 'prod-1',
    vendor_id: 'vendor-123',
    name: 'Wireless Noise-Cancelling Headphones',
    slug: 'wireless-headphones',
    description: 'Premium wireless headphones with active noise cancellation',
    category: 'Electronics',
    price: 299.99,
    compare_at_price: 399.99,
    cost_price: 180.00,
    sku: 'WH-001',
    stock_quantity: 45,
    low_stock_threshold: 10,
    allow_backorder: false,
    images: ['https://via.placeholder.com/400'],
    status: 'active',
    visibility: 'public',
    views_count: 1245,
    sales_count: 89,
    avg_rating: 4.8,
    reviews_count: 34,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockOrders: VendorOrder[] = [
  {
    id: 'order-1',
    order_number: 'ORD-12345',
    vendor_id: 'vendor-123',
    customer_id: 'cust-456',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+61412345678',
    },
    shipping_address: {
      full_name: 'John Doe',
      line1: '123 Main St',
      city: 'Sydney',
      state: 'NSW',
      country: 'AU',
      postal_code: '2000',
      phone: '+61412345678',
    },
    items: [
      {
        id: 'item-1',
        product_id: 'prod-1',
        product_name: 'Wireless Headphones',
        product_image: 'https://via.placeholder.com/100',
        sku: 'WH-001',
        quantity: 1,
        unit_price: 299.99,
        total_price: 299.99,
      },
    ],
    subtotal: 299.99,
    shipping_fee: 12.00,
    tax: 31.20,
    total: 343.19,
    commission_fee: 44.998,
    vendor_payout: 267.00,
    currency: 'AUD',
    status: 'pending',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    fulfillment_sla: {
      promised_dispatch_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      promised_delivery_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      breach_risk: 'low',
    },
    timeline: [
      {
        id: 'timeline-1',
        status: 'pending',
        title: 'Payment authorized',
        description: 'Customer placed the order and payment was authorized.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        actor: { type: 'system', name: 'Easy11 Payments' },
        metadata: { amount: '343.19', currency: 'AUD', method: 'card' },
      },
    ],
    payment: {
      method: 'card',
      processor: 'Stripe',
      transaction_id: 'pi_3N2abc1234567',
      status: 'authorized',
      amount_charged: 343.19,
      fees_total: 12.45,
      currency: 'AUD',
      captured_at: new Date(Date.now() - 1.9 * 60 * 60 * 1000).toISOString(),
      breakdown: {
        platform_fee: 6.45,
        payment_processing_fee: 4.80,
        taxes: 1.20,
      },
    },
    internal_notes: [
      {
        id: 'note-1',
        author: { name: 'Alice (Support)', role: 'support' },
        message: 'Customer requested signature on delivery.',
        created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        visibility: 'internal',
      },
    ],
    issues: [],
  },
];

// ==================== Authentication ====================

export const registerVendor = async (data: VendorRegistrationData): Promise<Vendor> => {
  await delay(800);
  
  return {
    ...mockVendor,
    id: 'vendor-' + Date.now(),
    business_name: data.business_name,
    legal_name: data.legal_name,
    email: data.email,
    phone: data.phone,
    business_type: data.business_type,
    industry: data.industry,
    abn: data.abn,
    address: data.address,
    status: 'pending', // Needs KYC
    kyc_status: 'not_started',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const loginVendor = async (email: string, password: string): Promise<{ vendor: Vendor; token: string }> => {
  await delay(600);
  
  return {
    vendor: mockVendor,
    token: 'vendor-jwt-token-' + Date.now(),
  };
};

// ==================== Vendor Profile ====================

export const getVendorProfile = async (): Promise<Vendor> => {
  await delay(400);
  return { ...mockVendor };
};

export const updateVendorProfile = async (data: Partial<Vendor>): Promise<Vendor> => {
  await delay(500);
  return {
    ...mockVendor,
    ...data,
    updated_at: new Date().toISOString(),
  };
};

// ==================== KYC ====================

export const submitKYC = async (data: KYCSubmission): Promise<{ status: string }> => {
  await delay(1000);
  
  // In real app, upload files to S3 and create KYC documents
  console.log('[Vendor API] KYC submitted:', {
    vendor_id: data.vendor_id,
    documents: Object.keys(data.documents),
    declaration: data.declaration,
  });
  
  return { status: 'submitted' };
};

export const getKYCDocuments = async (): Promise<KYCDocument[]> => {
  await delay(400);
  
  return [
    {
      id: 'kyc-1',
      vendor_id: 'vendor-123',
      type: 'government_id',
      file_url: 'https://easy11.com/uploads/kyc/gov-id.pdf',
      file_name: 'drivers-license.pdf',
      file_size: 2048576,
      status: 'approved',
      uploaded_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      reviewed_at: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

// ==================== Products ====================

export const getVendorProducts = async (filters?: any): Promise<VendorProduct[]> => {
  await delay(500);
  return [...mockProducts];
};

export const getVendorProduct = async (id: string): Promise<VendorProduct> => {
  await delay(400);
  const product = mockProducts.find((p) => p.id === id);
  if (!product) throw new Error('Product not found');
  return { ...product };
};

export const createVendorProduct = async (data: Partial<VendorProduct>): Promise<VendorProduct> => {
  await delay(600);
  
  const newProduct: VendorProduct = {
    id: 'prod-' + Date.now(),
    vendor_id: 'vendor-123',
    name: data.name || '',
    slug: data.slug || '',
    description: data.description || '',
    category: data.category || '',
    price: data.price || 0,
    sku: data.sku || '',
    stock_quantity: data.stock_quantity || 0,
    low_stock_threshold: data.low_stock_threshold || 10,
    allow_backorder: data.allow_backorder || false,
    images: data.images || [],
    status: data.status || 'draft',
    visibility: data.visibility || 'public',
    views_count: 0,
    sales_count: 0,
    avg_rating: 0,
    reviews_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  return newProduct;
};

export const updateVendorProduct = async (id: string, data: Partial<VendorProduct>): Promise<VendorProduct> => {
  await delay(500);
  
  const product = mockProducts.find((p) => p.id === id);
  if (!product) throw new Error('Product not found');
  
  return {
    ...product,
    ...data,
    updated_at: new Date().toISOString(),
  };
};

export const deleteVendorProduct = async (id: string): Promise<{ status: string }> => {
  await delay(400);
  return { status: 'ok' };
};

// ==================== Orders ====================

export const getVendorOrders = async (filters?: any): Promise<VendorOrder[]> => {
  await delay(500);
  return mockOrders.map((order) => ({ ...order, timeline: order.timeline ? [...order.timeline] : undefined, internal_notes: order.internal_notes ? [...order.internal_notes] : undefined }));
};

export const getVendorOrder = async (id: string): Promise<VendorOrder> => {
  await delay(400);
  const order = mockOrders.find((o) => o.id === id);
  if (!order) throw new Error('Order not found');
  return { ...order };
};

export const updateVendorOrderStatus = async (
  id: string,
  status: VendorOrderStatus,
  tracking?: { tracking_number?: string; carrier?: string }
): Promise<VendorOrder> => {
  await delay(500);
  
  const order = mockOrders.find((o) => o.id === id);
  if (!order) throw new Error('Order not found');
  
  return {
    ...order,
    status,
    tracking_number: tracking?.tracking_number || order.tracking_number,
    carrier: tracking?.carrier || order.carrier,
    confirmed_at: status === 'confirmed' ? new Date().toISOString() : order.confirmed_at,
    shipped_at: status === 'shipped' ? new Date().toISOString() : order.shipped_at,
    delivered_at: status === 'delivered' ? new Date().toISOString() : order.delivered_at,
    timeline: [
      {
        id: `timeline-${Date.now()}`,
        status,
        title:
          status === 'confirmed'
            ? 'Order confirmed'
            : status === 'preparing'
            ? 'Order is being prepared'
            : status === 'shipped'
            ? 'Order shipped'
            : status === 'delivered'
            ? 'Order delivered'
            : 'Status updated',
        timestamp: new Date().toISOString(),
        actor: { type: 'vendor', name: 'TechCo Operations' },
        metadata:
          status === 'shipped' && tracking?.tracking_number
            ? { tracking_number: tracking.tracking_number, carrier: tracking?.carrier ?? '' }
            : undefined,
      },
      ...(order.timeline ?? []),
    ],
  };
};

export const addVendorOrderNote = async (
  id: string,
  note: Omit<VendorOrderNote, 'id' | 'created_at'>
): Promise<VendorOrder> => {
  await delay(400);
  const order = mockOrders.find((o) => o.id === id);
  if (!order) throw new Error('Order not found');

  const newNote: VendorOrderNote = {
    ...note,
    id: `note-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  order.internal_notes = [newNote, ...(order.internal_notes ?? [])];
  return { ...order };
};

export const issueVendorOrderRefund = async (
  id: string,
  amount: number,
  reason?: string
): Promise<VendorOrder> => {
  await delay(600);
  const order = mockOrders.find((o) => o.id === id);
  if (!order) throw new Error('Order not found');

  const refund = {
    id: `refund-${Date.now()}`,
    amount,
    currency: order.currency ?? 'AUD',
    reason,
    initiated_at: new Date().toISOString(),
    status: 'pending' as const,
    actor: 'TechCo Operations',
  };

  order.refund = refund;
  order.status = amount >= order.total ? 'refunded' : order.status;
  order.timeline = [
    {
      id: `timeline-refund-${Date.now()}`,
      status: 'refunded',
      title: amount >= order.total ? 'Full refund initiated' : 'Partial refund initiated',
      description: reason,
      timestamp: refund.initiated_at,
      actor: { type: 'vendor', name: 'TechCo Operations' },
      metadata: { amount: amount.toFixed(2), currency: refund.currency },
    },
    ...(order.timeline ?? []),
  ];

  return { ...order };
};

// ==================== Analytics ====================

export const getVendorAnalytics = async (period: string): Promise<VendorAnalytics> => {
  await delay(600);
  
  return {
    vendor_id: 'vendor-123',
    period: period as any,
    revenue: {
      total: 125680.50,
      change_percent: 12.5,
      chart: [
        { date: '2025-10-01', value: 4200 },
        { date: '2025-10-08', value: 5100 },
        { date: '2025-10-15', value: 4800 },
        { date: '2025-10-22', value: 6300 },
        { date: '2025-10-29', value: 5600 },
      ],
    },
    orders: {
      total: 328,
      change_percent: 8.3,
      avg_order_value: 383.29,
      chart: [
        { date: '2025-10-01', value: 12 },
        { date: '2025-10-08', value: 15 },
        { date: '2025-10-15', value: 14 },
        { date: '2025-10-22', value: 18 },
        { date: '2025-10-29', value: 16 },
      ],
    },
    products: {
      total: 45,
      active: 42,
      out_of_stock: 2,
      low_stock: 5,
    },
    customers: {
      total: 156,
      new: 23,
      returning: 133,
      repeat_rate: 0.853,
    },
    top_products: [
      {
        product_id: 'prod-1',
        name: 'Wireless Headphones',
        sales: 89,
        revenue: 26699.11,
      },
      {
        product_id: 'prod-2',
        name: 'Smart Watch',
        sales: 67,
        revenue: 19899.33,
      },
    ],
    performance: {
      avg_fulfillment_time: 18.5,
      on_time_delivery_rate: 0.96,
      cancellation_rate: 0.02,
      return_rate: 0.03,
    },
    traffic_sources: [
      { channel: 'Organic Search', visits: 2350, conversions: 320, revenue: 46890 },
      { channel: 'Paid Search', visits: 980, conversions: 140, revenue: 18650 },
      { channel: 'Social', visits: 740, conversions: 85, revenue: 10320 },
      { channel: 'Email', visits: 420, conversions: 110, revenue: 15400 },
      { channel: 'Referral', visits: 260, conversions: 44, revenue: 7650 },
    ],
    retention: [
      { cohort: 'Jan 2025', retention_rate: 0.42, change_vs_prior: 0.04, lifetime_value: 286 },
      { cohort: 'Feb 2025', retention_rate: 0.38, change_vs_prior: -0.02, lifetime_value: 254 },
      { cohort: 'Mar 2025', retention_rate: 0.45, change_vs_prior: 0.05, lifetime_value: 301 },
      { cohort: 'Apr 2025', retention_rate: 0.33, change_vs_prior: -0.07, lifetime_value: 218 },
    ],
    experiment_summary: [
      {
        id: 'exp-001',
        name: 'Free Express Shipping Banner',
        status: 'running',
        uplift: 0.082,
        significance: 0.97,
        primary_metric: 'Conversion rate',
      },
      {
        id: 'exp-002',
        name: 'Bundle Recommendation Module',
        status: 'completed',
        uplift: 0.124,
        significance: 0.99,
        primary_metric: 'Average order value',
      },
      {
        id: 'exp-003',
        name: 'Loyalty CTA Placement',
        status: 'paused',
        uplift: -0.018,
        significance: 0.65,
        primary_metric: 'Rewards enrolment',
      },
    ],
    anomaly_alerts: [
      {
        metric: 'Return rate',
        severity: 'warning',
        message: 'Return rate is 2.1× above baseline for the “Wireless Headphones” SKU.',
        detected_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        action: 'Review QA checks and update PDP messaging.',
      },
      {
        metric: 'Paid search CPA',
        severity: 'critical',
        message: 'Paid search CPA exceeded target by 34% yesterday.',
        detected_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        action: 'Pause underperforming ad groups or increase bids on high ROAS keywords.',
      },
    ],
  };
};

// ==================== Payouts ====================

export const getVendorPayouts = async (): Promise<VendorPayout[]> => {
  await delay(500);
  
  return [
    {
      id: 'payout-1',
      vendor_id: 'vendor-123',
      period_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      period_end: new Date().toISOString(),
      gross_revenue: 5420.00,
      commission_fee: 813.00,
      refunds: 0,
      adjustments: 0,
      net_payout: 4607.00,
      status: 'pending',
      scheduled_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      payment_method: 'bank_transfer',
      orders_count: 18,
      orders_ids: ['order-1', 'order-2'],
      created_at: new Date().toISOString(),
    },
  ];
};

// ==================== Admin: Vendor Management ====================

export const getAllVendors = async (filters?: any): Promise<Vendor[]> => {
  await delay(500);
  return [mockVendor];
};

export const approveVendor = async (vendorId: string, notes?: string): Promise<Vendor> => {
  await delay(600);
  return {
    ...mockVendor,
    status: 'active',
    approved_at: new Date().toISOString(),
  };
};

export const rejectVendor = async (vendorId: string, reason: string): Promise<{ status: string }> => {
  await delay(600);
  return { status: 'rejected' };
};

export const suspendVendor = async (vendorId: string, reason: string): Promise<Vendor> => {
  await delay(500);
  return {
    ...mockVendor,
    status: 'suspended',
  };
};

// ==================== Export All ====================

const vendorAPI = {
  registerVendor,
  loginVendor,
  getVendorProfile,
  updateVendorProfile,
  submitKYC,
  getKYCDocuments,
  getVendorProducts,
  getVendorProduct,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
  getVendorOrders,
  getVendorOrder,
  updateVendorOrderStatus,
  addVendorOrderNote,
  issueVendorOrderRefund,
  getVendorAnalytics,
  getVendorPayouts,
  getAllVendors,
  approveVendor,
  rejectVendor,
  suspendVendor,
};

export default vendorAPI;

