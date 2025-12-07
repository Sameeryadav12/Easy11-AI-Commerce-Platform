/**
 * Vendor Store
 * Sprint 7: Vendor Management State
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Vendor, VendorAnalytics, KYCDocument } from '../types/vendor';

interface VendorState {
  // Current vendor (for logged-in vendor users)
  currentVendor: Vendor | null;
  analytics: VendorAnalytics | null;
  kycDocuments: KYCDocument[];
  
  // Admin: List of all vendors
  vendors: Vendor[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentVendor: (vendor: Vendor | null) => void;
  updateCurrentVendor: (data: Partial<Vendor>) => void;
  setAnalytics: (analytics: VendorAnalytics | null) => void;
  setKYCDocuments: (documents: KYCDocument[]) => void;
  addKYCDocument: (document: KYCDocument) => void;
  
  // Admin actions
  setVendors: (vendors: Vendor[]) => void;
  addVendor: (vendor: Vendor) => void;
  updateVendor: (id: string, data: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVendorStore = create<VendorState>()(
  persist(
    (set, get) => ({
      currentVendor: null,
      analytics: null,
      kycDocuments: [],
      vendors: [],
      isLoading: false,
      error: null,

      setCurrentVendor: (vendor) => set({ currentVendor: vendor }),

      updateCurrentVendor: (data) =>
        set((state) => ({
          currentVendor: state.currentVendor
            ? { ...state.currentVendor, ...data }
            : null,
        })),

      setAnalytics: (analytics) => set({ analytics }),

      setKYCDocuments: (documents) => set({ kycDocuments: documents }),

      addKYCDocument: (document) =>
        set((state) => ({
          kycDocuments: [...state.kycDocuments, document],
        })),

      setVendors: (vendors) => set({ vendors }),

      addVendor: (vendor) =>
        set((state) => ({
          vendors: [...state.vendors, vendor],
        })),

      updateVendor: (id, data) =>
        set((state) => ({
          vendors: state.vendors.map((v) =>
            v.id === id ? { ...v, ...data } : v
          ),
        })),

      deleteVendor: (id) =>
        set((state) => ({
          vendors: state.vendors.filter((v) => v.id !== id),
        })),

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      reset: () =>
        set({
          currentVendor: null,
          analytics: null,
          kycDocuments: [],
          vendors: [],
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: 'easy11-vendor',
      getStorage: () => localStorage,
      partialize: (state) => ({
        currentVendor: state.currentVendor,
        // Don't persist analytics or documents (fetch fresh)
      }),
    }
  )
);

