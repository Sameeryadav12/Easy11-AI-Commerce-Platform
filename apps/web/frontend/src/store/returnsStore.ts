import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { userScopedStorage } from './userScopedStorage';

export type ReturnReason =
  | 'damaged'
  | 'wrong_item'
  | 'not_as_described'
  | 'missing_parts'
  | 'size_fit'
  | 'changed_mind'
  | 'other';

export type ReturnResolution = 'refund' | 'replacement' | 'store_credit';

export type ReturnStatus =
  | 'requested'
  | 'approved'
  | 'shipped'
  | 'received'
  | 'refunded'
  | 'denied';

export type ReturnRequest = {
  id: string;
  createdAt: string;
  updatedAt: string;

  orderId: string;
  orderNumber: string;

  reason: ReturnReason;
  resolution: ReturnResolution;
  notes?: string;

  status: ReturnStatus;
  refundAmount?: number;
  refundMethod?: string;
  trackingNumber?: string;
};

interface ReturnsState {
  requests: ReturnRequest[];

  createRequest: (input: Omit<ReturnRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => ReturnRequest;
  updateStatus: (id: string, status: ReturnStatus, patch?: Partial<ReturnRequest>) => void;
  removeRequest: (id: string) => void;
  reset: () => void;

  getByOrderId: (orderId: string) => ReturnRequest[];
}

export const useReturnsStore = create<ReturnsState>()(
  persist(
    (set, get) => ({
      requests: [],

      createRequest: (input) => {
        const now = new Date().toISOString();
        const req: ReturnRequest = {
          id: `ret_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          createdAt: now,
          updatedAt: now,
          status: 'requested',
          ...input,
        };
        set((state) => ({ requests: [req, ...state.requests] }));
        return req;
      },

      updateStatus: (id, status, patch = {}) => {
        const now = new Date().toISOString();
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id ? { ...r, ...patch, status, updatedAt: now } : r
          ),
        }));
      },

      removeRequest: (id) =>
        set((state) => ({ requests: state.requests.filter((r) => r.id !== id) })),

      reset: () => set({ requests: [] }),

      getByOrderId: (orderId) => get().requests.filter((r) => r.orderId === orderId),
    }),
    {
      name: 'easy11-returns',
      storage: createJSONStorage(() => userScopedStorage),
      skipHydration: true,
      partialize: (state) => ({ requests: state.requests }),
    }
  )
);

