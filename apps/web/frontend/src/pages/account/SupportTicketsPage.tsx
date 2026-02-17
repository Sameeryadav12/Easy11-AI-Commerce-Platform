/**
 * My Support Tickets
 * Ticket tracking with status filters and chat thread
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  ChevronRight,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../../components/ui';
import BreadcrumbBack from '../../components/navigation/BreadcrumbBack';
import {
  useSupportTicketsStore,
  type SupportTicket,
  type TicketStatus,
} from '../../store/supportTicketsStore';
import { PRIORITY_SLA_HOURS } from '../../services/supportAPI';
import toast from 'react-hot-toast';

const STATUS_LABELS: Record<TicketStatus | 'all', string> = {
  all: 'All',
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

export default function SupportTicketsPage() {
  const tickets = useSupportTicketsStore((s) => s.tickets);
  const getByStatus = useSupportTicketsStore((s) => s.getByStatus);
  const updateTicketStatus = useSupportTicketsStore((s) => s.updateTicketStatus);
  const addTicketMessage = useSupportTicketsStore((s) => s.addTicketMessage);

  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const filtered = getByStatus(statusFilter);
  const selectedTicket = selectedTicketId
    ? tickets.find((t) => t.id === selectedTicketId)
    : null;

  const handleReply = () => {
    if (!selectedTicketId || !replyText.trim()) return;
    addTicketMessage(selectedTicketId, 'user', replyText.trim());
    setReplyText('');
    toast.success('Reply added');
  };

  return (
    <div>
      <div className="mb-4">
        <BreadcrumbBack
          parentLabel="Support"
          parentUrl="/account/support"
          currentPage="My Tickets"
        />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">
          My Support Tickets
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track status, view history, and add replies to your tickets.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Ticket list */}
        <div className="lg:w-1/3 space-y-4">
          <div className="flex flex-wrap gap-2">
            {(['all', 'open', 'in_progress', 'resolved'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No tickets found</p>
              <Link to="/account/support" className="mt-3 inline-block">
                <Button variant="primary" size="sm">
                  Create a ticket
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedTicketId === t.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white truncate">
                    {t.subject}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                    <span>{t.id}</span>
                    <span>·</span>
                    <span className="capitalize">{t.status.replace('_', ' ')}</span>
                    <span>·</span>
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ticket detail & chat */}
        <div className="lg:w-2/3">
          {selectedTicket ? (
            <TicketDetail
              ticket={selectedTicket}
              onUpdateStatus={updateTicketStatus}
              replyText={replyText}
              setReplyText={setReplyText}
              onReply={handleReply}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Select a ticket to view details and chat
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TicketDetail({
  ticket,
  onUpdateStatus,
  replyText,
  setReplyText,
  onReply,
}: {
  ticket: SupportTicket;
  onUpdateStatus: (id: string, status: TicketStatus) => void;
  replyText: string;
  setReplyText: (v: string) => void;
  onReply: () => void;
}) {
  const messages = ticket.messages ?? [];
  const slaHours = PRIORITY_SLA_HOURS[ticket.priority] ?? 24;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">
          {ticket.subject}
        </h2>
        <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>ID: {ticket.id}</span>
          <span>·</span>
          <span className="capitalize">{ticket.category}</span>
          <span>·</span>
          <span className="capitalize">{ticket.priority} (SLA: {slaHours}h)</span>
          {ticket.orderNumber && (
            <>
              <span>·</span>
              <span>Order: {ticket.orderNumber}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              ticket.status === 'resolved' || ticket.status === 'closed'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : ticket.status === 'in_progress'
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            }`}
          >
            {ticket.status === 'in_progress' ? (
              <Clock className="w-3 h-3 mr-1" />
            ) : ticket.status === 'resolved' || ticket.status === 'closed' ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <AlertCircle className="w-3 h-3 mr-1" />
            )}
            {STATUS_LABELS[ticket.status]}
          </span>
          {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onUpdateTicketStatus(ticket.id, 'in_progress')}
            >
              Mark In Progress
            </Button>
          )}
          {ticket.status !== 'resolved' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onUpdateTicketStatus(ticket.id, 'resolved')}
            >
              Mark Resolved
            </Button>
          )}
        </div>
      </div>

      {/* Chat thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[200px] max-h-[400px]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2 ${
                m.from === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{m.body}</p>
              <p className="text-xs opacity-75 mt-1">
                {m.from === 'user' ? 'You' : 'Support'} · {new Date(m.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Reply input */}
      {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Add a reply..."
              className="flex-1 min-h-[80px] px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none resize-none"
              maxLength={2000}
            />
            <Button
              variant="primary"
              onClick={onReply}
              disabled={!replyText.trim()}
              className="self-end"
            >
              <Send className="w-4 h-4 mr-1" />
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
