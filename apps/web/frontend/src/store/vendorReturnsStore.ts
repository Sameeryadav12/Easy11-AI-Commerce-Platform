/**
 * Vendor Returns Management Store
 * Sprint 9: RMA and returns workflow state
 */

import { create } from 'zustand';
import type { Return, ReturnStatus, Refund } from '../types/vendorOrders';

interface VendorReturnsState {
  returns: Return[];
  selectedReturn: Return | null;
  refunds: Refund[];
  
  isLoading: boolean;
  error: string | null;
  
  // Stats
  stats: {
    requested: number;
    approved: number;
    in_transit: number;
    received: number;
    refunded: number;
    denied: number;
  };
  
  // Actions
  setReturns: (returns: Return[]) => void;
  addReturn: (return_: Return) => void;
  updateReturn: (id: string, updates: Partial<Return>) => void;
  updateReturnStatus: (id: string, status: ReturnStatus) => void;
  setSelectedReturn: (return_: Return | null) => void;
  
  setRefunds: (refunds: Refund[]) => void;
  addRefund: (refund: Refund) => void;
  
  recalculateStats: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVendorReturnsStore = create<VendorReturnsState>()((set, get) => ({
  returns: [],
  selectedReturn: null,
  refunds: [],
  isLoading: false,
  error: null,
  
  stats: {
    requested: 0,
    approved: 0,
    in_transit: 0,
    received: 0,
    refunded: 0,
    denied: 0,
  },
  
  setReturns: (returns) => {
    set({ returns });
    get().recalculateStats();
  },
  
  addReturn: (return_) =>
    set((state) => ({
      returns: [return_, ...state.returns],
    })),
  
  updateReturn: (id, updates) =>
    set((state) => ({
      returns: state.returns.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      selectedReturn: state.selectedReturn?.id === id ? { ...state.selectedReturn, ...updates } : state.selectedReturn,
    })),
  
  updateReturnStatus: (id, status) =>
    set((state) => ({
      returns: state.returns.map((r) => (r.id === id ? { ...r, status } : r)),
      selectedReturn: state.selectedReturn?.id === id ? { ...state.selectedReturn, status } : state.selectedReturn,
    })),
  
  setSelectedReturn: (return_) => set({ selectedReturn: return_ }),
  
  setRefunds: (refunds) => set({ refunds }),
  
  addRefund: (refund) =>
    set((state) => ({
      refunds: [refund, ...state.refunds],
    })),
  
  recalculateStats: () => {
    const state = get();
    const stats = {
      requested: state.returns.filter((r) => r.status === 'requested').length,
      approved: state.returns.filter((r) => r.status === 'approved').length,
      in_transit: state.returns.filter((r) => r.status === 'in_transit').length,
      received: state.returns.filter((r) => r.status === 'received').length,
      refunded: state.returns.filter((r) => r.status === 'refunded').length,
      denied: state.returns.filter((r) => r.status === 'denied').length,
    };
    set({ stats });
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  reset: () =>
    set({
      returns: [],
      selectedReturn: null,
      refunds: [],
      isLoading: false,
      error: null,
      stats: {
        requested: 0,
        approved: 0,
        in_transit: 0,
        received: 0,
        refunded: 0,
        denied: 0,
      },
    }),
}));

