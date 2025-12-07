/**
 * Vendor Product Management Store
 * Sprint 8: Complete product management state
 */

import { create } from 'zustand';
import type {
  VendorProductFull,
  ProductVariant,
  AIValidationResult,
  ProductMetrics,
  LowStockAlert,
  ProductWizardStep1,
  ProductWizardStep2,
  ProductWizardStep3,
  ProductWizardStep4,
} from '../types/vendorProduct';

interface ProductManagementState {
  // Product List
  products: VendorProductFull[];
  selectedProduct: VendorProductFull | null;
  isLoading: boolean;
  error: string | null;
  
  // Filters & Pagination
  filters: {
    status?: string;
    category?: string;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  };
  pagination: {
    page: number;
    per_page: number;
    total_count: number;
    has_more: boolean;
  };
  
  // Product Wizard State
  wizardStep: 1 | 2 | 3 | 4;
  wizardData: {
    step1?: ProductWizardStep1;
    step2?: ProductWizardStep2;
    step3?: ProductWizardStep3;
    step4?: ProductWizardStep4;
  };
  
  // AI Validation
  currentValidation: AIValidationResult | null;
  isValidating: boolean;
  
  // Low Stock Alerts
  lowStockAlerts: LowStockAlert[];
  
  // Actions - Product List
  setProducts: (products: VendorProductFull[]) => void;
  addProduct: (product: VendorProductFull) => void;
  updateProduct: (id: string, updates: Partial<VendorProductFull>) => void;
  deleteProduct: (id: string) => void;
  setSelectedProduct: (product: VendorProductFull | null) => void;
  
  // Actions - Filters
  setFilters: (filters: any) => void;
  resetFilters: () => void;
  
  // Actions - Pagination
  setPagination: (pagination: any) => void;
  nextPage: () => void;
  prevPage: () => void;
  
  // Actions - Wizard
  setWizardStep: (step: 1 | 2 | 3 | 4) => void;
  setWizardData: (step: 1 | 2 | 3 | 4, data: any) => void;
  resetWizard: () => void;
  
  // Actions - AI Validation
  setValidation: (validation: AIValidationResult | null) => void;
  setIsValidating: (validating: boolean) => void;
  
  // Actions - Low Stock
  setLowStockAlerts: (alerts: LowStockAlert[]) => void;
  
  // Actions - UI State
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useProductManagementStore = create<ProductManagementState>()((set, get) => ({
  // Initial State
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  
  filters: {},
  pagination: {
    page: 1,
    per_page: 20,
    total_count: 0,
    has_more: false,
  },
  
  wizardStep: 1,
  wizardData: {},
  
  currentValidation: null,
  isValidating: false,
  
  lowStockAlerts: [],
  
  // Product List Actions
  setProducts: (products) => set({ products }),
  
  addProduct: (product) =>
    set((state) => ({
      products: [product, ...state.products],
    })),
  
  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
      selectedProduct:
        state.selectedProduct?.id === id
          ? { ...state.selectedProduct, ...updates }
          : state.selectedProduct,
    })),
  
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
      selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct,
    })),
  
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  
  // Filter Actions
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 }, // Reset to page 1 on filter change
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
      pagination: {
        ...state.pagination,
        page: Math.max(1, state.pagination.page - 1),
      },
    })),
  
  // Wizard Actions
  setWizardStep: (step) => set({ wizardStep: step }),
  
  setWizardData: (step, data) =>
    set((state) => ({
      wizardData: {
        ...state.wizardData,
        [`step${step}`]: data,
      },
    })),
  
  resetWizard: () =>
    set({
      wizardStep: 1,
      wizardData: {},
    }),
  
  // AI Validation Actions
  setValidation: (validation) => set({ currentValidation: validation }),
  setIsValidating: (validating) => set({ isValidating: validating }),
  
  // Low Stock Actions
  setLowStockAlerts: (alerts) => set({ lowStockAlerts: alerts }),
  
  // UI State Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  reset: () =>
    set({
      products: [],
      selectedProduct: null,
      isLoading: false,
      error: null,
      filters: {},
      pagination: { page: 1, per_page: 20, total_count: 0, has_more: false },
      wizardStep: 1,
      wizardData: {},
      currentValidation: null,
      isValidating: false,
      lowStockAlerts: [],
    }),
}));

