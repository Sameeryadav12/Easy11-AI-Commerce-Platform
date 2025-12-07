/**
 * Vendor Payouts & Ledger Management Store
 * Sprint 9: Financial operations state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  VendorWallet,
  Payout,
  PayoutStatus,
  LedgerEntry,
  PayoutStatement,
} from '../types/vendorOrders';

interface VendorPayoutsState {
  // Wallet
  wallet: VendorWallet | null;
  
  // Payouts
  payouts: Payout[];
  upcomingPayout: Payout | null;
  selectedPayout: Payout | null;
  
  // Ledger
  ledgerEntries: LedgerEntry[];
  
  // Statements
  statements: PayoutStatement[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Pagination (for ledger)
  pagination: {
    page: number;
    per_page: number;
    total_count: number;
  };
  
  // Actions - Wallet
  setWallet: (wallet: VendorWallet) => void;
  updateWalletBalance: (balance: number, holdBalance?: number, pendingBalance?: number) => void;
  
  // Actions - Payouts
  setPayouts: (payouts: Payout[]) => void;
  setUpcomingPayout: (payout: Payout | null) => void;
  addPayout: (payout: Payout) => void;
  updatePayout: (id: string, updates: Partial<Payout>) => void;
  setSelectedPayout: (payout: Payout | null) => void;
  
  // Actions - Ledger
  setLedgerEntries: (entries: LedgerEntry[]) => void;
  addLedgerEntry: (entry: LedgerEntry) => void;
  
  // Actions - Statements
  setStatements: (statements: PayoutStatement[]) => void;
  addStatement: (statement: PayoutStatement) => void;
  
  // Actions - Pagination
  setPagination: (pagination: any) => void;
  
  // Actions - UI State
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVendorPayoutsStore = create<VendorPayoutsState>()(
  persist(
    (set, get) => ({
      // Initial State
      wallet: null,
      payouts: [],
      upcomingPayout: null,
      selectedPayout: null,
      ledgerEntries: [],
      statements: [],
      isLoading: false,
      error: null,
      
      pagination: {
        page: 1,
        per_page: 50,
        total_count: 0,
      },
      
      // Wallet Actions
      setWallet: (wallet) => set({ wallet }),
      
      updateWalletBalance: (balance, holdBalance, pendingBalance) =>
        set((state) => ({
          wallet: state.wallet
            ? {
                ...state.wallet,
                balance,
                hold_balance: holdBalance ?? state.wallet.hold_balance,
                pending_balance: pendingBalance ?? state.wallet.pending_balance,
                total_balance: balance + (holdBalance ?? state.wallet.hold_balance) + (pendingBalance ?? state.wallet.pending_balance),
                updated_at: new Date().toISOString(),
              }
            : null,
        })),
      
      // Payouts Actions
      setPayouts: (payouts) => set({ payouts }),
      setUpcomingPayout: (payout) => set({ upcomingPayout: payout }),
      
      addPayout: (payout) =>
        set((state) => ({
          payouts: [payout, ...state.payouts],
        })),
      
      updatePayout: (id, updates) =>
        set((state) => ({
          payouts: state.payouts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
          selectedPayout: state.selectedPayout?.id === id ? { ...state.selectedPayout, ...updates } : state.selectedPayout,
        })),
      
      setSelectedPayout: (payout) => set({ selectedPayout: payout }),
      
      // Ledger Actions
      setLedgerEntries: (entries) => set({ ledgerEntries: entries }),
      
      addLedgerEntry: (entry) =>
        set((state) => ({
          ledgerEntries: [entry, ...state.ledgerEntries],
        })),
      
      // Statements Actions
      setStatements: (statements) => set({ statements }),
      
      addStatement: (statement) =>
        set((state) => ({
          statements: [statement, ...state.statements],
        })),
      
      // Pagination Actions
      setPagination: (pagination) =>
        set((state) => ({
          pagination: { ...state.pagination, ...pagination },
        })),
      
      // UI State Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      reset: () =>
        set({
          wallet: null,
          payouts: [],
          upcomingPayout: null,
          selectedPayout: null,
          ledgerEntries: [],
          statements: [],
          isLoading: false,
          error: null,
          pagination: { page: 1, per_page: 50, total_count: 0 },
        }),
    }),
    {
      name: 'easy11-vendor-payouts',
      getStorage: () => localStorage,
      partialize: (state) => ({
        wallet: state.wallet,
        // Don't persist sensitive payout/ledger data
      }),
    }
  )
);

