import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
          
          if (existingItem) {
            // Update quantity if item exists
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) }
                  : i
              ),
              isDrawerOpen: true, // Open drawer when adding
            };
          } else {
            // Add new item
            return {
              items: [...state.items, { ...item, quantity: Math.min(quantity, item.stock) }],
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
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(Math.max(1, quantity), item.stock) }
              : item
          ),
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

      removeDiscount: () => {
        set({ discountCode: null, discountAmount: 0 });
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        const discountAmount = get().discountAmount;
        return (subtotal - discountAmount) * 0.08; // 8% tax
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        // Free shipping over $100
        if (subtotal >= 100) return 0;
        // Standard shipping
        return 9.99;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const tax = get().getTax();
        const shipping = get().getShipping();
        const discount = get().discountAmount;
        return subtotal + tax + shipping - discount;
      },
    }),
    {
      name: 'easy11-cart-storage', // localStorage key
      partialPersist: (state) => ({
        items: state.items,
        discountCode: state.discountCode,
        discountAmount: state.discountAmount,
      }),
    }
  )
);
