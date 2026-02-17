/**
 * Orders API — create and fetch orders from backend (source of truth for logged-in users).
 */
import api from './api';
import type { Order, OrderItem } from '../types/order';

/** Backend order item with product. */
interface BackendOrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: { id: string; name: string; image?: string | null; category: string };
}

/** Backend order shape. */
interface BackendOrder {
  id: string;
  userId: string;
  total: number;
  status: string;
  shippingAddress: Record<string, unknown>;
  createdAt: string;
  items: BackendOrderItem[];
}

function mapBackendOrderToFrontend(b: BackendOrder): Order {
  const addr = (b.shippingAddress || {}) as Record<string, string>;
  return {
    id: b.id,
    orderNumber: 'E11-' + b.id.slice(-8),
    date: b.createdAt,
    status: (b.status?.toLowerCase?.() ?? 'pending') as Order['status'],
    userId: b.userId,
    items: b.items.map((i) => ({
      id: i.id,
      name: i.product?.name ?? 'Product',
      image: i.product?.image ?? '',
      quantity: i.quantity,
      price: i.price,
      category: i.product?.category ?? '',
    })),
    subtotal: b.total,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: b.total,
    paymentMethod: 'Card',
    shippingAddress: {
      name: addr.name ?? '',
      address: addr.street ?? addr.address ?? '',
      city: addr.city ?? '',
      state: addr.state ?? '',
      zipCode: addr.zip ?? addr.zipCode ?? '',
      country: addr.country ?? '',
    },
  };
}

/** Create order on backend (auth required). Returns created order in frontend shape. */
export async function createOrder(params: {
  items: Array<{ productId: string; quantity: number; price: number }>;
  shippingAddress: { name?: string; address: string; city: string; state: string; zipCode: string; country: string };
}): Promise<Order> {
  const { data } = await api.post<{ order: BackendOrder }>('/orders', {
    items: params.items,
    shippingAddress: {
      street: params.shippingAddress.address,
      city: params.shippingAddress.city,
      state: params.shippingAddress.state,
      zip: params.shippingAddress.zipCode,
      country: params.shippingAddress.country,
    },
  });
  return mapBackendOrderToFrontend(data.order);
}

/** Fetch current user's orders from backend. */
export async function fetchOrders(params?: { page?: number; limit?: number }): Promise<Order[]> {
  const { data } = await api.get<{ orders: BackendOrder[] }>('/orders', {
    params: { page: params?.page ?? 1, limit: params?.limit ?? 100 },
  });
  return (data.orders || []).map(mapBackendOrderToFrontend);
}

/** Cancel order on backend (updates status and reverses points). */
export async function cancelOrderOnBackend(orderId: string): Promise<void> {
  await api.patch(`/orders/${orderId}/cancel`);
}
