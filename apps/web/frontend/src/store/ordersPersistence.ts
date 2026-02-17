/**
 * Account-based orders persistence.
 * Stores all users' orders in a single localStorage key: Record<userId, Order[]>.
 * Logout never deletes order data—only the login session.
 */

import type { Order } from '../types/order';

const STORAGE_KEY = 'easy11-orders-by-user';
const OLD_SCOPED_PREFIX = 'easy11-orders::';

export type OrdersByUser = Record<string, Order[]>;

/** One-time migration: copy orders from old userScopedStorage format if new store is empty */
function migrateFromOldFormat(userId: string): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const oldKey = `${OLD_SCOPED_PREFIX}${userId}`;
    const raw = window.localStorage.getItem(oldKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { state?: { orders?: Order[] }; orders?: Order[] };
    const orders = parsed?.state?.orders ?? (parsed as { orders?: Order[] }).orders;
    if (!Array.isArray(orders) || orders.length === 0) return [];
    const withUserId = orders.map((o) => ({ ...o, userId: o.userId ?? userId }));
    saveOrdersForUser(userId, withUserId);
    window.localStorage.removeItem(oldKey);
    return withUserId;
  } catch {
    return [];
  }
}

function readAll(): OrdersByUser {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as OrdersByUser;
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(data: OrdersByUser): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function getOrdersForUser(userId: string): Order[] {
  const all = readAll();
  let orders = all[userId];
  if (!Array.isArray(orders) || orders.length === 0) {
    const migrated = migrateFromOldFormat(userId);
    if (migrated.length > 0) return migrated;
    return [];
  }
  return orders.map((o) => ({ ...o, userId: o.userId ?? userId }));
}

export function saveOrdersForUser(userId: string, orders: Order[]): void {
  const all = readAll();
  all[userId] = orders;
  writeAll(all);
}

export function addOrderForUser(userId: string, order: Order): void {
  const orders = getOrdersForUser(userId);
  orders.unshift(order);
  saveOrdersForUser(userId, orders);
}

export function updateOrderForUser(userId: string, orderId: string, updates: Partial<Order>): void {
  const orders = getOrdersForUser(userId);
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx >= 0) {
    orders[idx] = { ...orders[idx], ...updates };
    saveOrdersForUser(userId, orders);
  }
}
