/**
 * Vendor Orders Management Store
 * Sprint 9: Complete order operations state management
 */

import { create } from 'zustand';
import type {
  VendorOrder,
  OrderStatus,
  OrderEvent,
  OrdersReportFilters,
  VendorOrdersAnalytics,
} from '../types/vendorOrders';

interface VendorOrdersManagementState {
  // Orders List
  orders: VendorOrder[];
  selectedOrder: VendorOrder | null;
  orderEvents: OrderEvent[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Filters & Pagination
  filters: OrdersReportFilters;
  pagination: {
    page: number;
    per_page: number;
    total_count: number;
    has_more: boolean;
  };
  
  // Counts by Status
  statusCounts: Record<OrderStatus, number>;
  
  // Analytics
  analytics: VendorOrdersAnalytics | null;
  
  // Actions - Orders
  setOrders: (orders: VendorOrder[]) => void;
  addOrder: (order: VendorOrder) => void;
  updateOrder: (id: string, updates: Partial<VendorOrder>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  setSelectedOrder: (order: VendorOrder | null) => void;
  
  // Actions - Events
  setOrderEvents: (events: OrderEvent[]) => void;
  addOrderEvent: (event: OrderEvent) => void;
  
  // Actions - Filters
  setFilters: (filters: Partial<OrdersReportFilters>) => void;
  resetFilters: () => void;
  
  // Actions - Pagination
  setPagination: (pagination: any) => void;
  nextPage: () => void;
  prevPage: () => void;
  
  // Actions - Status Counts
  setStatusCounts: (counts: Record<OrderStatus, number>) => void;
  recalculateStatusCounts: () => void;
  
  // Actions - Analytics
  setAnalytics: (analytics: VendorOrdersAnalytics | null) => void;
  
  // Actions - UI State
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVendorOrdersManagementStore = create<VendorOrdersManagementState>()((set, get) => ({
  // Initial State
  orders: [],
  selectedOrder: null,
  orderEvents: [],
  isLoading: false,
  error: null,
  
  filters: {},
  pagination: {
    page: 1,
    per_page: 20,
    total_count: 0,
    has_more: false,
  },
  
  statusCounts: {
    new: 0,
    acknowledged: 0,
    packing: 0,
    shipped: 0,
    delivered: 0,
    exception: 0,
    canceled: 0,
  },
  
  analytics: null,
  
  // Orders Actions
  setOrders: (orders) => {
    set({ orders });
    get().recalculateStatusCounts();
  },
  
  addOrder: (order) =>
    set((state) => {
      const newOrders = [order, ...state.orders];
      const newCounts = { ...state.statusCounts };
      newCounts[order.status]++;
      return { orders: newOrders, statusCounts: newCounts };
    }),
  
  updateOrder: (id, updates) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
      selectedOrder: state.selectedOrder?.id === id ? { ...state.selectedOrder, ...updates } : state.selectedOrder,
    })),
  
  updateOrderStatus: (id, status) =>
    set((state) => {
      const order = state.orders.find((o) => o.id === id);
      if (!order) return state;
      
      const oldStatus = order.status;
      const newOrders = state.orders.map((o) => (o.id === id ? { ...o, status } : o));
      
      const newCounts = { ...state.statusCounts };
      newCounts[oldStatus]--;
      newCounts[status]++;
      
      return {
        orders: newOrders,
        statusCounts: newCounts,
        selectedOrder: state.selectedOrder?.id === id ? { ...state.selectedOrder, status } : state.selectedOrder,
      };
    }),
  
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  
  // Events Actions
  setOrderEvents: (events) => set({ orderEvents: events }),
  
  addOrderEvent: (event) =>
    set((state) => ({
      orderEvents: [event, ...state.orderEvents],
    })),
  
  // Filter Actions
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 },
    })),
  
  resetFilters: () =>
    set({
      filters: {},
      pagination: { page: 1, per_page: 20, total_count: 0, has_more: false },
    }),
  
  // Pagination Actions
  setPagination: (pagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    })),
  
  nextPage: () =>
    set((state) => ({
      pagination: { ...state.pagination, page: state.pagination.page + 1 },
    })),
  
  prevPage: () =>
    set((state) => ({
      pagination: { ...state.pagination, page: Math.max(1, state.pagination.page - 1) },
    })),
  
  // Status Counts Actions
  setStatusCounts: (counts) => set({ statusCounts: counts }),
  
  recalculateStatusCounts: () => {
    const state = get();
    const counts: Record<OrderStatus, number> = {
      new: 0,
      acknowledged: 0,
      packing: 0,
      shipped: 0,
      delivered: 0,
      exception: 0,
      canceled: 0,
    };
    
    state.orders.forEach((order) => {
      counts[order.status]++;
    });
    
    set({ statusCounts: counts });
  },
  
  // Analytics Actions
  setAnalytics: (analytics) => set({ analytics }),
  
  // UI State Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  reset: () =>
    set({
      orders: [],
      selectedOrder: null,
      orderEvents: [],
      isLoading: false,
      error: null,
      filters: {},
      pagination: { page: 1, per_page: 20, total_count: 0, has_more: false },
      statusCounts: {
        new: 0,
        acknowledged: 0,
        packing: 0,
        shipped: 0,
        delivered: 0,
        exception: 0,
        canceled: 0,
      },
      analytics: null,
    }),
}));

