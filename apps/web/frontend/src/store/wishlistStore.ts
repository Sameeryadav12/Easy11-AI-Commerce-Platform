import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { userScopedStorage } from './userScopedStorage';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  addedDate: string;
  priceDropPrediction?: number; // AI prediction: probability of price drop (0-100)
}

interface WishlistState {
  items: WishlistItem[];
  
  // Actions
  addItem: (item: Omit<WishlistItem, 'addedDate'>) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: Omit<WishlistItem, 'addedDate'>) => boolean; // Returns true if added, false if removed
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  
  // Computed
  getTotalItems: () => number;
  getInStockItems: () => WishlistItem[];
  getPriceDropAlerts: () => WishlistItem[];
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        if (get().isInWishlist(item.id)) return;

        const newItem: WishlistItem = {
          ...item,
          addedDate: new Date().toISOString(),
        };

        set((state) => ({
          items: [newItem, ...state.items],
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      toggleItem: (item) => {
        const exists = get().isInWishlist(item.id);
        
        if (exists) {
          get().removeItem(item.id);
          return false;
        } else {
          get().addItem(item);
          return true;
        }
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },

      clearWishlist: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.length;
      },

      getInStockItems: () => {
        return get().items.filter((item) => item.inStock);
      },

      getPriceDropAlerts: () => {
        return get().items.filter((item) => (item.priceDropPrediction || 0) >= 70);
      },
    }),
    {
      name: 'easy11-wishlist-storage',
      storage: createJSONStorage(() => userScopedStorage),
      skipHydration: true,
    }
  )
);

