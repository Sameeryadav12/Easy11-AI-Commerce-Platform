import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { userScopedStorage } from './userScopedStorage';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
  stock: number;
  deliveryDays?: number;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  discountCode: string | null;
  discountAmount: number;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  applyDiscount: (code: string) => void;
  /** Apply a reward coupon (E11REWARD-xxx) with a dollar amount from API. */
  applyRewardCoupon: (code: string, dollarAmount: number) => void;
  removeDiscount: () => void;
  
  // Computed values
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getShipping: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      discountCode: null,
      discountAmount: 0,

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          
          const maxStock = (v: number | undefined) => (Number(v) >= 1 ? Number(v) : 999);
          if (existingItem) {
            const stock = maxStock(existingItem.stock);
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: Math.min((Number(i.quantity) || 1) + quantity, stock), stock: i.stock ?? stock }
                  : i
              ),
              isDrawerOpen: true,
            };
          } else {
            const stock = maxStock(item.stock);
            const qty = Math.min(quantity, stock);
            return {
              items: [...state.items, { ...item, quantity: Number.isFinite(qty) ? qty : 1, stock: item.stock ?? stock }],
              isDrawerOpen: true,
            };
          }
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== id) return item;
            const stock = Number(item.stock) >= 1 ? Number(item.stock) : 999;
            const qty = Math.min(Math.max(1, Number(quantity) || 1), stock);
            return { ...item, quantity: Number.isFinite(qty) ? qty : 1 };
          }),
        }));
      },

      clearCart: () => {
        set({
          items: [],
          discountCode: null,
          discountAmount: 0,
        });
      },

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      applyDiscount: (code) => {
        // Discount code logic
        const discountCodes: Record<string, number> = {
          'EASY10': 10, // 10% off
          'EASY20': 20, // 20% off
          'WELCOME': 15, // 15% off
          'SAVE50': 50, // $50 off
        };

        const discount = discountCodes[code.toUpperCase()];
        
        if (discount) {
          const subtotal = get().getSubtotal();
          const isPercentage = discount <= 100;
          const amount = isPercentage ? (subtotal * discount) / 100 : discount;
          
          set({
            discountCode: code.toUpperCase(),
            discountAmount: Math.min(amount, subtotal), // Can't exceed subtotal
          });
        }
      },

      applyRewardCoupon: (code, dollarAmount) => {
        const subtotal = get().getSubtotal();
        set({
          discountCode: code.trim().toUpperCase(),
          discountAmount: Math.min(Math.max(0, dollarAmount), subtotal),
        });
      },

      removeDiscount: () => {
        set({ discountCode: null, discountAmount: 0 });
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => {
            const price = Number(item.price) || 0;
            const qty = Number(item.quantity);
            const quantity = Number.isFinite(qty) && qty >= 0 ? qty : 1;
            return sum + price * quantity;
          },
          0
        );
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        const discountAmount = Number(get().discountAmount) || 0;
        const shipping = get().getShipping();
        return Math.max(0, (subtotal - discountAmount + shipping) * 0.1); // 10% GST
      },

      getShipping: () => {
        // Standard delivery is free by default
        return 0;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const tax = get().getTax();
        const shipping = get().getShipping();
        const discount = Number(get().discountAmount) || 0;
        const total = subtotal + tax + shipping - discount;
        return Number.isFinite(total) ? total : 0;
      },
    }),
    {
      name: 'easy11-cart-storage',
      storage: createJSONStorage(() => userScopedStorage),
      skipHydration: true,
      partialize: (state) => ({
        items: state.items,
        discountCode: state.discountCode,
        discountAmount: state.discountAmount,
      }),
    }
  )
);
