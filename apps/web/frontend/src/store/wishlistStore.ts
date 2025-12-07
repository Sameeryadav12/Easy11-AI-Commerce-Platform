import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      items: [
        {
          id: '101',
          name: 'Wireless Mouse Pro',
          price: 29.99,
          image: '🖱️',
          category: 'Accessories',
          inStock: true,
          addedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          priceDropPrediction: 75,
        },
        {
          id: '102',
          name: 'USB-C Hub',
          price: 49.99,
          originalPrice: 69.99,
          image: '🔌',
          category: 'Accessories',
          inStock: true,
          addedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          priceDropPrediction: 25,
        },
        {
          id: '103',
          name: 'Laptop Stand',
          price: 39.99,
          image: '💻',
          category: 'Accessories',
          inStock: false,
          addedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          priceDropPrediction: 10,
        },
      ],

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
    }
  )
);

