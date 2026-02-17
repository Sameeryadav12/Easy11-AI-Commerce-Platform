/**
 * Dashboard API Service Layer
 * Sprint 3: Customer Dashboard Core
 * Mock implementations - replace with real backend calls
 */

import type {
  Address,
  AddressFormData,
  PaymentMethod,
  Notification,
  NotificationPreference,
  DataExportRequest,
  AccountDeletionRequest,
  DashboardOverview,
} from '../types/dashboard';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ==================== Dashboard Overview ====================

export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  await delay(600);

  return {
    greeting: 'Welcome back, John!',
    user: {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      tier: 'gold',
      points: 2450,
      points_to_next_tier: 2550,
    },
    orders: {
      total_count: 15,
      recent: [],
      next_delivery: null,
    },
    wishlist: {
      total_count: 12,
      items: [],
      price_drops_count: 2,
    },
    notifications: {
      unread_count: 3,
      recent: [],
    },
    security: {
      mfa_enabled: false,
      devices_count: 2,
      last_stepup_at: null,
    },
    recommendations: [],
  };
};

// ==================== Addresses ====================

const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    user_id: 'user-123',
    nickname: 'Home',
    full_name: 'John Doe',
    phone: '+61412345678',
    line1: '123 Main Street',
    line2: 'Apt 4B',
    city: 'Melbourne',
    state: 'Victoria',
    country: 'AU',
    postal_code: '3000',
    is_default_shipping: true,
    is_default_billing: true,
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'addr-2',
    user_id: 'user-123',
    nickname: 'Work',
    full_name: 'John Doe',
    phone: '+61412345678',
    line1: '456 Office Boulevard',
    city: 'Sydney',
    state: 'New South Wales',
    country: 'AU',
    postal_code: '2000',
    is_default_shipping: false,
    is_default_billing: false,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const getAddresses = async (): Promise<Address[]> => {
  await delay(400);
  return [...mockAddresses];
};

export const createAddress = async (data: AddressFormData): Promise<Address> => {
  await delay(500);

  const newAddress: Address = {
    id: 'addr-' + Date.now(),
    user_id: 'user-123',
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  mockAddresses.push(newAddress);
  return newAddress;
};

export const updateAddress = async (id: string, data: Partial<AddressFormData>): Promise<Address> => {
  await delay(400);

  const index = mockAddresses.findIndex((a) => a.id === id);
  if (index === -1) throw new Error('Address not found');

  mockAddresses[index] = {
    ...mockAddresses[index],
    ...data,
    updated_at: new Date().toISOString(),
  };

  return mockAddresses[index];
};

export const deleteAddress = async (id: string): Promise<{ status: string }> => {
  await delay(400);

  const index = mockAddresses.findIndex((a) => a.id === id);
  if (index !== -1) {
    mockAddresses.splice(index, 1);
  }

  return { status: 'ok' };
};

// ==================== Payment Methods ====================

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    user_id: 'user-123',
    psp_token: 'tok_visa1234',
    brand: 'visa',
    last4: '1234',
    expiry: '12/2025',
    nickname: 'Personal Card',
    is_default: true,
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pm-2',
    user_id: 'user-123',
    psp_token: 'tok_mastercard5678',
    brand: 'mastercard',
    last4: '5678',
    expiry: '06/2026',
    is_default: false,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  await delay(400);
  return [...mockPaymentMethods];
};

export const addPaymentMethod = async (
  pspToken: string,
  nickname?: string,
  isDefault = false,
  metadata?: { last4: string; brand: string; expiry: string }
): Promise<PaymentMethod> => {
  await delay(600);

  // In real app, pspToken comes from Stripe/PSP tokenization; metadata from PSP response
  const newMethod: PaymentMethod = {
    id: 'pm-' + Date.now(),
    user_id: 'user-123',
    psp_token: pspToken,
    brand: (metadata?.brand ?? 'visa') as PaymentMethod['brand'],
    last4: metadata?.last4 ?? '9999',
    expiry: metadata?.expiry ?? '12/2026',
    nickname,
    is_default: isDefault,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  mockPaymentMethods.push(newMethod);
  return newMethod;
};

export const deletePaymentMethod = async (id: string): Promise<{ status: string }> => {
  await delay(400);

  const index = mockPaymentMethods.findIndex((m) => m.id === id);
  if (index !== -1) {
    mockPaymentMethods.splice(index, 1);
  }

  return { status: 'ok' };
};

// ==================== Notifications ====================

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'user-123',
    type: 'order',
    title: 'Your order #12345 has shipped',
    body: 'Track your delivery in real-time',
    channel: 'in_app',
    status: 'delivered',
    read_at: null,
    action_url: '/account/orders/12345',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    user_id: 'user-123',
    type: 'wishlist',
    title: 'Price drop on "AirPods Pro"',
    body: 'Now $249 (was $299). Save 17%!',
    channel: 'in_app',
    status: 'delivered',
    read_at: null,
    action_url: '/products/airpods-pro',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    user_id: 'user-123',
    type: 'rewards',
    title: 'New tier unlocked: Gold!',
    body: 'You\'re now earning 5% back on all purchases',
    channel: 'in_app',
    status: 'delivered',
    read_at: null,
    action_url: '/account/rewards',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-4',
    user_id: 'user-123',
    type: 'order',
    title: 'Order #12344 delivered',
    body: 'Hope you enjoy your new purchase!',
    channel: 'in_app',
    status: 'delivered',
    read_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    action_url: '/account/orders/12344',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const getNotifications = async (limit = 20, offset = 0): Promise<{
  notifications: Notification[];
  total_count: number;
  unread_count: number;
  has_more: boolean;
}> => {
  await delay(400);

  const unread = mockNotifications.filter((n) => !n.read_at).length;

  return {
    notifications: mockNotifications.slice(offset, offset + limit),
    total_count: mockNotifications.length,
    unread_count: unread,
    has_more: mockNotifications.length > offset + limit,
  };
};

export const markNotificationAsRead = async (id: string): Promise<Notification> => {
  await delay(200);

  const notification = mockNotifications.find((n) => n.id === id);
  if (!notification) throw new Error('Notification not found');

  notification.read_at = new Date().toISOString();
  return notification;
};

export const getNotificationPreferences = async (): Promise<NotificationPreference[]> => {
  await delay(300);

  return [
    {
      type: 'marketing',
      label: 'Marketing Updates',
      description: 'Promotions, sales, and new product announcements',
      channels: { email: true, sms: true, push: false },
      can_disable: true,
    },
    {
      type: 'orders',
      label: 'Order Updates',
      description: 'Shipping confirmations, delivery updates, and order status',
      channels: { email: true, sms: true, push: true },
      can_disable: true,
    },
    {
      type: 'price_drops',
      label: 'Price Drop Alerts',
      description: 'Notifications when wishlist items go on sale',
      channels: { email: true, sms: false, push: true },
      can_disable: true,
    },
    {
      type: 'wishlist',
      label: 'Wishlist Updates',
      description: 'Back-in-stock and price change notifications',
      channels: { email: true, sms: false, push: true },
      can_disable: true,
    },
    {
      type: 'security',
      label: 'Security Alerts',
      description: 'Login attempts, device changes, and MFA updates',
      channels: { email: true, sms: true, push: true },
      can_disable: false, // Cannot disable security notifications
    },
    {
      type: 'rewards',
      label: 'Rewards & Loyalty',
      description: 'Points earned, tier changes, and referral updates',
      channels: { email: true, sms: false, push: true },
      can_disable: true,
    },
  ];
};

export const updateNotificationPreferences = async (
  type: string,
  channels: any
): Promise<{ status: string }> => {
  await delay(300);
  console.log(`[Dashboard API] Updating preferences for ${type}:`, channels);
  return { status: 'ok' };
};

// ==================== Privacy ====================

export const requestDataExport = async (): Promise<DataExportRequest> => {
  await delay(800);

  return {
    id: 'export-' + Date.now(),
    user_id: 'user-123',
    status: 'processing',
    estimated_time_minutes: 5,
    created_at: new Date().toISOString(),
  };
};

export const getDataExportStatus = async (requestId: string): Promise<DataExportRequest> => {
  await delay(400);

  // Mock: simulate processing → completed
  return {
    id: requestId,
    user_id: 'user-123',
    status: 'completed',
    estimated_time_minutes: 5,
    download_url: 'https://easy11.com/exports/mock-user-data.zip',
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    completed_at: new Date().toISOString(),
  };
};

export const requestAccountDeletion = async (confirmation: string): Promise<AccountDeletionRequest> => {
  await delay(600);

  if (confirmation !== 'DELETE MY ACCOUNT') {
    throw new Error('Confirmation text does not match');
  }

  return {
    id: 'deletion-' + Date.now(),
    user_id: 'user-123',
    scheduled_deletion_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    cool_down_days: 7,
    cancellable_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    confirmation_code: confirmation,
    status: 'pending',
    created_at: new Date().toISOString(),
  };
};

export const cancelAccountDeletion = async (requestId: string): Promise<{ status: string }> => {
  await delay(400);
  return { status: 'ok' };
};

// ==================== Export All ====================

const dashboardAPI = {
  getDashboardOverview,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  getNotifications,
  markNotificationAsRead,
  getNotificationPreferences,
  updateNotificationPreferences,
  requestDataExport,
  getDataExportStatus,
  requestAccountDeletion,
  cancelAccountDeletion,
};

export default dashboardAPI;

