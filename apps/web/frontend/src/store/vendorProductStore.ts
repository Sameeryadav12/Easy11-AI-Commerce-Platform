/**
 * Vendor Product Store
 * Sprint 7: Vendor Product Management State
 */

import { create } from 'zustand';
import type { VendorProduct } from '../types/vendor';

interface VendorProductState {
  products: VendorProduct[];
  selectedProduct: VendorProduct | null;
  isLoading: boolean;
  error: string | null;
  
  // Filters
  filters: {
    status?: string;
    category?: string;
    search?: string;
  };
  
  // Actions
  setProducts: (products: VendorProduct[]) => void;
  addProduct: (product: VendorProduct) => void;
  updateProduct: (id: string, data: Partial<VendorProduct>) => void;
  deleteProduct: (id: string) => void;
  setSelectedProduct: (product: VendorProduct | null) => void;
  setFilters: (filters: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVendorProductStore = create<VendorProductState>()((set, get) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  filters: {},

  setProducts: (products) => set({ products }),

  addProduct: (product) =>
    set((state) => ({
      products: [product, ...state.products],
    })),

  updateProduct: (id, data) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...data } : p
      ),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setFilters: (filters) => set({ filters }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  reset: () =>
    set({
      products: [],
      selectedProduct: null,
      isLoading: false,
      error: null,
      filters: {},
    }),
}));

