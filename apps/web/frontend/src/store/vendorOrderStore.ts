/**
 * Vendor Order Store
 * Sprint 7: Vendor Order Management State
 */

import { create } from 'zustand';
import type {
  VendorOrder,
  VendorOrderNote,
  VendorOrderStatus,
  VendorOrderTimelineEvent,
  RefundSummary,
} from '../types/vendor';

interface VendorOrderState {
  orders: VendorOrder[];
  selectedOrder: VendorOrder | null;
  isLoading: boolean;
  error: string | null;
  
  // Filters
  filters: {
    status?: VendorOrderStatus;
    date_from?: string;
    date_to?: string;
    search?: string;
  };
  
  // Statistics
  stats: {
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
  };
  
  // Actions
  setOrders: (orders: VendorOrder[]) => void;
  addOrder: (order: VendorOrder) => void;
  updateOrder: (id: string, data: Partial<VendorOrder>) => void;
  updateOrderStatus: (id: string, status: VendorOrderStatus) => void;
  appendTimelineEvent: (id: string, event: VendorOrderTimelineEvent) => void;
  setRefund: (id: string, refund: RefundSummary) => void;
  addInternalNote: (id: string, note: VendorOrderNote) => void;
  setSelectedOrder: (order: VendorOrder | null) => void;
  setFilters: (filters: any) => void;
  setStats: (stats: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVendorOrderStore = create<VendorOrderState>()((set, get) => ({
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
  filters: {},
  stats: {
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
  },

  setOrders: (orders) => {
    // Calculate stats
    const stats = {
      pending: orders.filter((o) => o.status === 'pending').length,
      confirmed: orders.filter((o) => o.status === 'confirmed').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
    };
    set({ orders, stats });
  },

  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
      stats: {
        ...state.stats,
        [order.status]: state.stats[order.status as keyof typeof state.stats] + 1,
      },
    })),

  updateOrder: (id, data) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, ...data } : o
      ),
    })),

  updateOrderStatus: (id, status) =>
    set((state) => {
      const order = state.orders.find((o) => o.id === id);
      if (!order) return state;

      const oldStatus = order.status;
      const newOrders = state.orders.map((o) =>
        o.id === id ? { ...o, status } : o
      );

      const newStats = { ...state.stats };
      if (oldStatus in newStats) {
        newStats[oldStatus as keyof typeof newStats]--;
      }
      if (status in newStats) {
        newStats[status as keyof typeof newStats]++;
      }

      return { orders: newOrders, stats: newStats };
    }),

  appendTimelineEvent: (id, event) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id
          ? {
              ...order,
              timeline: [event, ...(order.timeline ?? [])],
            }
          : order
      ),
      selectedOrder:
        state.selectedOrder?.id === id
          ? {
              ...state.selectedOrder,
              timeline: [event, ...(state.selectedOrder.timeline ?? [])],
            }
          : state.selectedOrder,
    })),

  setRefund: (id, refund) =>
    set((state) => ({
      orders: state.orders.map((order) => (order.id === id ? { ...order, refund } : order)),
      selectedOrder:
        state.selectedOrder?.id === id ? { ...state.selectedOrder, refund } : state.selectedOrder,
    })),

  addInternalNote: (id, note) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id
          ? {
              ...order,
              internal_notes: [note, ...(order.internal_notes ?? [])],
            }
          : order
      ),
      selectedOrder:
        state.selectedOrder?.id === id
          ? {
              ...state.selectedOrder,
              internal_notes: [note, ...(state.selectedOrder.internal_notes ?? [])],
            }
          : state.selectedOrder,
    })),

  setSelectedOrder: (order) => set({ selectedOrder: order }),
  setFilters: (filters) => set({ filters }),
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  reset: () =>
    set({
      orders: [],
      selectedOrder: null,
      isLoading: false,
      error: null,
      filters: {},
      stats: {
        pending: 0,
        confirmed: 0,
        shipped: 0,
        delivered: 0,
      },
    }),
}));

