import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RecentlyViewedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  viewedAt: string;
}

interface RecentlyViewedState {
  products: RecentlyViewedProduct[];
  
  // Actions
  addProduct: (product: Omit<RecentlyViewedProduct, 'viewedAt'>) => void;
  clearHistory: () => void;
  getRecent: (limit?: number) => RecentlyViewedProduct[];
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (product) => {
        set((state) => {
          // Remove if already exists
          const filtered = state.products.filter((p) => p.id !== product.id);
          
          // Add to front with timestamp
          const newProduct: RecentlyViewedProduct = {
            ...product,
            viewedAt: new Date().toISOString(),
          };
          
          // Keep only last 20
          const updated = [newProduct, ...filtered].slice(0, 20);
          
          return { products: updated };
        });
      },

      clearHistory: () => set({ products: [] }),

      getRecent: (limit = 4) => {
        return get().products.slice(0, limit);
      },
    }),
    {
      name: 'easy11-recently-viewed',
    }
  )
);

