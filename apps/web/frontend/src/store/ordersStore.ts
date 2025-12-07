import { create } from 'zustand';

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  category: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
  carrier?: string;
  onTimeProbability?: number; // AI prediction
}

export interface TrackingEvent {
  date: string;
  status: string;
  location: string;
  description: string;
}

interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  
  // Actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  selectOrder: (order: Order | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Computed
  getOrderById: (orderId: string) => Order | undefined;
  getPendingOrders: () => Order[];
  getDeliveredOrders: () => Order[];
  getRecentOrders: (limit?: number) => Order[];
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  selectedOrder: null,
  isLoading: false,

  setOrders: (orders) => set({ orders }),

  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),

  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    ),
  })),

  selectOrder: (order) => set({ selectedOrder: order }),

  setLoading: (loading) => set({ isLoading: loading }),

  getOrderById: (orderId) => {
    return get().orders.find((order) => order.id === orderId);
  },

  getPendingOrders: () => {
    return get().orders.filter((order) =>
      ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery'].includes(order.status)
    );
  },

  getDeliveredOrders: () => {
    return get().orders.filter((order) => order.status === 'delivered');
  },

  getRecentOrders: (limit = 3) => {
    return get().orders.slice(0, limit);
  },
}));

// Mock data generator for development
export const generateMockOrders = (): Order[] => {
  const statuses: Order['status'][] = ['delivered', 'shipped', 'out_for_delivery', 'packed'];
  
  return [
    {
      id: '1',
      orderNumber: 'E11-' + Date.now().toString().slice(-8),
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      status: 'shipped',
      items: [
        {
          id: '1',
          name: 'Wireless Headphones Pro',
          image: '🎧',
          quantity: 1,
          price: 299.99,
          category: 'Electronics',
        },
      ],
      subtotal: 299.99,
      tax: 24.00,
      shipping: 0,
      discount: 0,
      total: 323.99,
      paymentMethod: 'Credit Card ending in 4242',
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street, Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      },
      trackingNumber: '1Z999AA10123456784',
      estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      carrier: 'UPS',
      onTimeProbability: 95,
    },
    {
      id: '2',
      orderNumber: 'E11-' + (Date.now() - 1000).toString().slice(-8),
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      status: 'delivered',
      items: [
        {
          id: '2',
          name: 'Smartwatch Ultra 2',
          image: '⌚',
          quantity: 1,
          price: 449.99,
          category: 'Electronics',
        },
        {
          id: '6',
          name: 'Portable Bluetooth Speaker',
          image: '🔊',
          quantity: 1,
          price: 79.99,
          category: 'Electronics',
        },
      ],
      subtotal: 529.98,
      tax: 42.40,
      shipping: 0,
      discount: 52.99, // 10% off
      total: 519.39,
      paymentMethod: 'PayPal',
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street, Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      },
      trackingNumber: '1Z999AA10987654321',
      deliveredDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      carrier: 'FedEx',
    },
    {
      id: '3',
      orderNumber: 'E11-' + (Date.now() - 2000).toString().slice(-8),
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
      status: 'delivered',
      items: [
        {
          id: '5',
          name: 'Running Shoes Boost',
          image: '👟',
          quantity: 2,
          price: 129.99,
          category: 'Clothing',
        },
      ],
      subtotal: 259.98,
      tax: 20.80,
      shipping: 9.99,
      discount: 0,
      total: 290.77,
      paymentMethod: 'Credit Card ending in 1234',
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street, Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      },
      trackingNumber: '1Z999AA10555666777',
      deliveredDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      carrier: 'DHL',
    },
  ];
};

