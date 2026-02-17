import { create } from 'zustand';
import {
  getOrdersForUser,
  addOrderForUser,
  updateOrderForUser,
  saveOrdersForUser,
} from './ordersPersistence';
import { fetchOrders, cancelOrderOnBackend } from '../services/ordersAPI';
import { useRewardsStore } from './rewardsStore';
import { invalidateRewardCoupon, convertLedgerPending, reverseLedger, notifyOrderDelivered } from '../services/rewardsAPI';
import type { Order, OrderItem } from '../types/order';

export type { Order, OrderItem };

export interface TrackingEvent {
  date: string;
  status: string;
  location: string;
  description: string;
}

interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  /** Current user ID whose orders are displayed (set by loadOrdersForUser) */
  _currentUserId: string | null;

  // Actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order, userId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  cancelOrder: (
    orderId: string,
    updates: { cancellationReason?: string; cancellationReasonOther?: string }
  ) => void;
  selectOrder: (order: Order | null) => void;
  setLoading: (loading: boolean) => void;
  /** Load orders for the given user. Call on login. Pass null on logout to clear view. */
  loadOrdersForUser: (userId: string | null) => void;

  // Computed
  getOrderById: (orderId: string) => Order | undefined;
  getPendingOrders: () => Order[];
  getDeliveredOrders: () => Order[];
  getRecentOrders: (limit?: number) => Order[];
}

export const useOrdersStore = create<OrdersState>()((set, get) => ({
  orders: [],
  selectedOrder: null,
  isLoading: false,
  _currentUserId: null,

  setOrders: (orders) => set({ orders }),

  addOrder: (order, userId) => {
    addOrderForUser(userId, order);
    if (get()._currentUserId === userId) {
      set((state) => ({ orders: [order, ...state.orders] }));
    }
  },

  updateOrderStatus: (orderId, status) => {
    const { _currentUserId, orders } = get();
    if (!_currentUserId) return;
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const updates: Partial<Order> = { status };
    if (status === 'delivered') {
      updates.deliveredDate = new Date().toISOString();
      useRewardsStore.getState().convertPendingToAvailable(orderId);
      convertLedgerPending(orderId).catch((e) => console.warn('[Orders] Failed to convert points:', e));
      notifyOrderDelivered().catch((e) => console.warn('[Orders] Failed to process referral:', e));
    }
    if (status === 'returned') {
      useRewardsStore.getState().reversePoints(orderId, 'returned');
      reverseLedger(orderId, 'returned').catch((e) => console.warn('[Orders] Failed to reverse points:', e));
    }
    updateOrderForUser(_currentUserId, orderId, updates);
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, ...updates } : o)),
    }));
  },

  /** Cancel order with metadata (reason, timestamp, refund flag). Reverses pending points; syncs to backend when logged in. */
  cancelOrder: (orderId, updates) => {
    const { _currentUserId, orders } = get();
    if (!_currentUserId) return;
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const payload = {
      status: 'cancelled' as const,
      cancelledAt: new Date().toISOString(),
      refundInitiated: true,
      ...updates,
    };
    updateOrderForUser(_currentUserId, orderId, payload);
    useRewardsStore.getState().reversePoints(orderId, 'cancelled');
    reverseLedger(orderId, 'cancelled').catch((e) => console.warn('[Orders] Failed to reverse points:', e));
    cancelOrderOnBackend(orderId).catch((e) => console.warn('[Orders] Failed to cancel on backend:', e));
    if (order.rewardCouponCode) {
      invalidateRewardCoupon(order.rewardCouponCode).catch(() => {});
    }
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, ...payload } : o
      ),
    }));
  },

  selectOrder: (order) => set({ selectedOrder: order }),

  setLoading: (loading) => set({ isLoading: loading }),

  loadOrdersForUser: async (userId) => {
    if (!userId) {
      set({ orders: [], selectedOrder: null, _currentUserId: null, isLoading: false });
      return;
    }
    set({ isLoading: true });
    try {
      const orders = await fetchOrders();
      set({ orders, selectedOrder: null, _currentUserId: userId });
      saveOrdersForUser(userId, orders);
      try {
        useRewardsStore.getState().syncFromOrders(orders);
      } catch {
        // rewards store might not be initialised yet; ignore
      }
    } catch {
      // Fall back to persisted orders (e.g. offline or API down)
      const orders = getOrdersForUser(userId);
      set({ orders, selectedOrder: null, _currentUserId: userId });
      try {
        useRewardsStore.getState().syncFromOrders(orders);
      } catch {}
    } finally {
      set({ isLoading: false });
    }
  },

  getOrderById: (orderId) => {
    return get().orders.find((order) => order.id === orderId);
  },

  getPendingOrders: () => {
    return get().orders.filter((order) =>
      ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery'].includes(order.status)
    );
  },

  getDeliveredOrders: () => {
    return get().orders.filter((order) => order.status === 'delivered');
  },

  getRecentOrders: (limit = 3) => {
    return get().orders.slice(0, limit);
  },
}));

// Mock data generator for development (includes userId for compatibility)
export const generateMockOrders = (userId: string): Order[] => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  return [
    {
      id: '1',
      orderNumber: 'E11-' + now.toString().slice(-8),
      date: new Date(now - 2 * day).toISOString(),
      status: 'packed',
      userId,
      shippingMethod: 'Standard Shipping',
      items: [
        { id: '1', name: 'Wireless Headphones Pro', image: '🎧', quantity: 1, price: 299.99, category: 'Electronics' },
      ],
      subtotal: 299.99,
      tax: 24.0,
      shipping: 0,
      discount: 0,
      total: 323.99,
      paymentMethod: 'Credit Card ending in 4242',
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street, Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      },
      trackingNumber: '1Z999AA10123456784',
      estimatedDelivery: new Date(now + 3 * day).toISOString(),
      estimatedDeliveryStart: new Date(now + 3 * day).toISOString(),
      estimatedDeliveryEnd: new Date(now + 5 * day).toISOString(),
      carrier: 'UPS',
      onTimeProbability: 95,
      pointsEarned: 324,
    },
    {
      id: '1b',
      orderNumber: 'E11-' + (now - 500).toString().slice(-8),
      date: new Date(now - 2 * day).toISOString(),
      status: 'shipped',
      userId,
      shippingMethod: 'Standard Shipping',
      items: [
        { id: '1', name: 'Wireless Headphones Pro', image: '🎧', quantity: 1, price: 299.99, category: 'Electronics' },
      ],
      subtotal: 299.99,
      tax: 24.0,
      shipping: 0,
      discount: 0,
      total: 323.99,
      paymentMethod: 'Credit Card ending in 4242',
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street, Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      },
      trackingNumber: '1Z999AA10123456784',
      estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      carrier: 'UPS',
      onTimeProbability: 95,
      pointsEarned: 324,
    },
    {
      id: '2',
      orderNumber: 'E11-' + (Date.now() - 1000).toString().slice(-8),
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'delivered',
      userId,
      shippingMethod: 'Express Shipping',
      items: [
        { id: '2', name: 'Smartwatch Ultra 2', image: '⌚', quantity: 1, price: 449.99, category: 'Electronics' },
        { id: '6', name: 'Portable Bluetooth Speaker', image: '🔊', quantity: 1, price: 79.99, category: 'Electronics' },
      ],
      subtotal: 529.98,
      tax: 42.4,
      shipping: 0,
      discount: 52.99,
      total: 519.39,
      paymentMethod: 'PayPal',
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street, Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      },
      trackingNumber: '1Z999AA10987654321',
      deliveredDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      carrier: 'FedEx',
      pointsEarned: 519,
    },
    {
      id: '3',
      orderNumber: 'E11-' + (Date.now() - 2000).toString().slice(-8),
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'delivered',
      userId,
      shippingMethod: 'Standard Shipping',
      items: [
        { id: '5', name: 'Running Shoes Boost', image: '👟', quantity: 2, price: 129.99, category: 'Clothing' },
      ],
      subtotal: 259.98,
      tax: 20.8,
      shipping: 9.99,
      discount: 0,
      total: 290.77,
      paymentMethod: 'Credit Card ending in 1234',
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street, Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      },
      trackingNumber: '1Z999AA10555666777',
      deliveredDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      carrier: 'DHL',
      pointsEarned: 291,
    },
  ];
};
