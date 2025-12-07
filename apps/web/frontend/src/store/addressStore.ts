/**
 * Address Store
 * Sprint 3: Customer Dashboard - Address Management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Address, AddressFormData } from '../types/dashboard';

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setAddresses: (addresses: Address[]) => void;
  addAddress: (address: Address) => void;
  updateAddress: (id: string, data: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultShipping: (id: string) => void;
  setDefaultBilling: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: [],
      isLoading: false,
      error: null,

      setAddresses: (addresses) => set({ addresses }),

      addAddress: (address) =>
        set((state) => ({
          addresses: [...state.addresses, address],
        })),

      updateAddress: (id, data) =>
        set((state) => ({
          addresses: state.addresses.map((addr) =>
            addr.id === id ? { ...addr, ...data } : addr
          ),
        })),

      deleteAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((addr) => addr.id !== id),
        })),

      setDefaultShipping: (id) =>
        set((state) => ({
          addresses: state.addresses.map((addr) => ({
            ...addr,
            is_default_shipping: addr.id === id,
          })),
        })),

      setDefaultBilling: (id) =>
        set((state) => ({
          addresses: state.addresses.map((addr) => ({
            ...addr,
            is_default_billing: addr.id === id,
          })),
        })),

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      reset: () =>
        set({
          addresses: [],
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: 'easy11-addresses',
      getStorage: () => localStorage,
    }
  )
);

