/**
 * Support Tickets Store
 * Account-based persistence for support tickets (Amazon/eBay model).
 * Ticket history survives logout, refresh, and device changes.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { userScopedStorage } from './userScopedStorage';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketCategory = 'orders' | 'returns' | 'payments' | 'account' | 'technical' | 'other';
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface TicketMessage {
  id: string;
  from: 'user' | 'support';
  body: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  category: TicketCategory;
  subject: string;
  message: string;
  orderNumber?: string;
  priority: TicketPriority;
  status: TicketStatus;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

interface SupportTicketsState {
  tickets: SupportTicket[];

  addTicket: (input: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'messages'>) => SupportTicket;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  addTicketMessage: (ticketId: string, from: 'user' | 'support', body: string) => void;
  getByOrderId: (orderId: string) => SupportTicket[];
  getRecent: (limit?: number) => SupportTicket[];
  getById: (id: string) => SupportTicket | undefined;
  getByStatus: (status: TicketStatus | 'all') => SupportTicket[];
}

export const useSupportTicketsStore = create<SupportTicketsState>()(
  persist(
    (set, get) => ({
      tickets: [],

      addTicket: (input) => {
        const now = new Date().toISOString();
        const ticket: SupportTicket = {
          ...input,
          id: `tkt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          status: 'open',
          messages: [
            { id: `msg_${Date.now()}`, from: 'user', body: input.message, createdAt: now },
          ],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ tickets: [ticket, ...state.tickets] }));
        return ticket;
      },

      updateTicketStatus: (id, status) => {
        const now = new Date().toISOString();
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === id ? { ...t, status, updatedAt: now } : t
          ),
        }));
      },

      addTicketMessage: (ticketId, from, body) => {
        const now = new Date().toISOString();
        const msg: TicketMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          from,
          body,
          createdAt: now,
        };
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === ticketId
              ? { ...t, messages: [...(t.messages || []), msg], updatedAt: now }
              : t
          ),
        }));
      },

      getByOrderId: (orderId) =>
        get().tickets.filter((t) => t.orderNumber === orderId),

      getRecent: (limit = 10) =>
        get().tickets.slice(0, limit),

      getById: (id) => get().tickets.find((t) => t.id === id),

      getByStatus: (status) => {
        const tickets = get().tickets;
        if (status === 'all') return tickets;
        return tickets.filter((t) => t.status === status);
      },
    }),
    {
      name: 'easy11-support-tickets',
      version: 2,
      storage: createJSONStorage(() => userScopedStorage),
      skipHydration: true,
      migrate: (persisted: unknown, version: number) => {
        const p = persisted as { tickets?: SupportTicket[] };
        if (p?.tickets && Array.isArray(p.tickets) && version < 2) {
          p.tickets = p.tickets.map((t) => ({
            ...t,
            messages: t.messages ?? [{ id: `msg_legacy`, from: 'user' as const, body: t.message, createdAt: t.createdAt }],
            status: t.status === 'pending' ? ('in_progress' as const) : t.status,
          }));
        }
        return p;
      },
      partialize: (state) => ({ tickets: state.tickets }),
    }
  )
);
