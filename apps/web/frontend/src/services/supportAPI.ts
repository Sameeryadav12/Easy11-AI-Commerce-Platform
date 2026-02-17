import api from './api';

export type SupportTicketCategory = 'orders' | 'returns' | 'payments' | 'account' | 'technical' | 'other';
export type SupportTicketPriority = 'low' | 'normal' | 'high' | 'urgent';

/** SLA response time by priority */
export const PRIORITY_SLA_HOURS: Record<SupportTicketPriority, number> = {
  low: 48,
  normal: 24,
  high: 8,
  urgent: 2,
};

export type CreateSupportTicketInput = {
  category: SupportTicketCategory;
  subject: string;
  message: string;
  orderNumber?: string;
  priority?: SupportTicketPriority;
};

export async function createSupportTicket(input: CreateSupportTicketInput): Promise<{ ticketId: string }> {
  const res = await api.post<{ ticketId: string }>('/support/tickets', input);
  return res.data;
}

