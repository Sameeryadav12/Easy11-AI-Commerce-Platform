/**
 * Payment Methods Store
 * Sprint 3: Customer Dashboard - Payment Management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PaymentMethod } from '../types/dashboard';
import { userScopedStorage } from './userScopedStorage';

interface PaymentState {
  methods: PaymentMethod[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setMethods: (methods: PaymentMethod[]) => void;
  addMethod: (method: PaymentMethod) => void;
  updateMethod: (id: string, data: Partial<PaymentMethod>) => void;
  deleteMethod: (id: string) => void;
  setDefault: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      methods: [],
      isLoading: false,
      error: null,

      setMethods: (methods) => set({ methods }),

      addMethod: (method) =>
        set((state) => ({
          methods: [...state.methods, method],
        })),

      updateMethod: (id, data) =>
        set((state) => ({
          methods: state.methods.map((method) =>
            method.id === id ? { ...method, ...data } : method
          ),
        })),

      deleteMethod: (id) =>
        set((state) => ({
          methods: state.methods.filter((method) => method.id !== id),
        })),

      setDefault: (id) =>
        set((state) => ({
          methods: state.methods.map((method) => ({
            ...method,
            is_default: method.id === id,
          })),
        })),

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      reset: () =>
        set({
          methods: [],
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: 'easy11-payments',
      storage: createJSONStorage(() => userScopedStorage),
      skipHydration: true,
      // Only persist non-sensitive data (no card numbers, CVVs)
      partialize: (state) => ({
        methods: state.methods.map((m) => ({
          id: m.id,
          brand: m.brand,
          last4: m.last4,
          expiry: m.expiry,
          nickname: m.nickname,
          is_default: m.is_default,
          created_at: m.created_at,
          // DO NOT persist: psp_token (sensitive)
        })),
      }),
    }
  )
);

