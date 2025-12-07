/**
 * Dashboard TypeScript Types
 * Sprint 3: Customer Dashboard Core
 */

// ==================== Address Management ====================

export interface Address {
  id: string;
  user_id: string;
  nickname: string; // "Home", "Work", "Parents"
  full_name: string;
  phone: string; // E.164 format
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string; // ISO 3166-1 alpha-2
  postal_code: string;
  is_default_shipping: boolean;
  is_default_billing: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressFormData {
  nickname: string;
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_default_shipping: boolean;
  is_default_billing: boolean;
}

// ==================== Payment Methods ====================

export interface PaymentMethod {
  id: string;
  user_id: string;
  psp_token: string; // Tokenized card from Stripe/PSP
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  last4: string; // Last 4 digits
  expiry: string; // MM/YYYY
  nickname?: string; // "Personal Card", "Business Card"
  is_default: boolean;
  billing_address_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethodFormData {
  card_number: string; // For tokenization only, never stored
  expiry_month: string;
  expiry_year: string;
  cvv: string; // Never stored, for verification only
  cardholder_name: string;
  nickname?: string;
  billing_address_id?: string;
  is_default: boolean;
}

// ==================== Notifications ====================

export interface Notification {
  id: string;
  user_id: string;
  type: 'order' | 'wishlist' | 'security' | 'marketing' | 'rewards' | 'system';
  title: string;
  body: string;
  channel: 'email' | 'sms' | 'push' | 'in_app';
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  read_at: string | null;
  action_url?: string; // Deep link
  image_url?: string;
  created_at: string;
}

export interface NotificationPreference {
  type: 'marketing' | 'orders' | 'price_drops' | 'wishlist' | 'security' | 'rewards';
  label: string;
  description: string;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  can_disable: boolean; // Security notifications cannot be disabled
}

// ==================== Privacy & Data Export ====================

export interface DataExportRequest {
  id: string;
  user_id: string;
  status: 'processing' | 'completed' | 'failed';
  estimated_time_minutes: number;
  download_url?: string;
  expires_at?: string; // 24-hour link expiry
  created_at: string;
  completed_at?: string;
}

export interface AccountDeletionRequest {
  id: string;
  user_id: string;
  scheduled_deletion_date: string; // 7 days from request
  cool_down_days: number;
  cancellable_until: string;
  confirmation_code: string; // User must type this to confirm
  status: 'pending' | 'cancelled' | 'completed';
  created_at: string;
}

// ==================== Dashboard Overview ====================

export interface DashboardOverview {
  greeting: string; // "Welcome back, John!"
  user: {
    id: string;
    name: string;
    email: string;
    tier: 'silver' | 'gold' | 'platinum';
    points: number;
    points_to_next_tier: number;
    avatar_url?: string;
  };
  orders: {
    total_count: number;
    recent: any[]; // Order[] - will use existing Order type
    next_delivery: any | null; // Order with tracking
  };
  wishlist: {
    total_count: number;
    items: any[]; // WishlistItem[]
    price_drops_count: number;
  };
  notifications: {
    unread_count: number;
    recent: Notification[];
  };
  security: {
    mfa_enabled: boolean;
    devices_count: number;
    last_stepup_at: string | null;
  };
  recommendations: any[]; // Product[] - AI recommendations
}

// ==================== API Response Types ====================

export interface AddressListResponse {
  addresses: Address[];
  total_count: number;
}

export interface AddressResponse {
  address: Address;
}

export interface PaymentMethodListResponse {
  methods: PaymentMethod[];
  total_count: number;
}

export interface PaymentMethodResponse {
  method: PaymentMethod;
}

export interface NotificationListResponse {
  notifications: Notification[];
  total_count: number;
  unread_count: number;
  has_more: boolean;
}

export interface NotificationPreferencesResponse {
  preferences: NotificationPreference[];
}

// ==================== Error Types ====================

export interface DashboardError {
  code: string;
  message: string;
  field?: string;
}

