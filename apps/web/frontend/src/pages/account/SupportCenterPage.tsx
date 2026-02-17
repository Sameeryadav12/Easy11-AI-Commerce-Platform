import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Truck,
  RotateCcw,
  CreditCard,
  User,
  MessageSquare,
  BookOpen,
  Bug,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../../components/ui';
import toast from 'react-hot-toast';
import {
  createSupportTicket,
  PRIORITY_SLA_HOURS,
  type SupportTicketCategory,
  type SupportTicketPriority,
} from '../../services/supportAPI';
import { useSupportTicketsStore } from '../../store/supportTicketsStore';
import { useOrdersStore } from '../../store/ordersStore';

type SupportTopic = {
  title: string;
  description: string;
  icon: any;
  links: Array<{ label: string; to: string }>;
};

export default function SupportCenterPage() {
  const addTicket = useSupportTicketsStore((s) => s.addTicket);
  const tickets = useSupportTicketsStore((s) => s.getRecent(5));
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const [category, setCategory] = useState<SupportTicketCategory>('orders');
  const [priority, setPriority] = useState<SupportTicketPriority>('normal');
  const [subject, setSubject] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [showRecentOrders, setShowRecentOrders] = useState(false);
  const [orderNumberError, setOrderNumberError] = useState<string | null>(null);

  const recentOrders = useOrdersStore((s) => s.getRecentOrders(5));
  const orders = useOrdersStore((s) => s.orders);

  const validateOrderNumber = (value: string): boolean => {
    if (!value.trim()) {
      setOrderNumberError(null);
      return true;
    }
    const belongsToUser = orders.some(
      (o) => o.orderNumber === value.trim() || o.id === value.trim()
    );
    if (!belongsToUser) {
      setOrderNumberError('Order not found. Please enter an order that belongs to your account.');
      return false;
    }
    setOrderNumberError(null);
    return true;
  };

  useEffect(() => {
    setShowRecentOrders(category === 'orders' && recentOrders.length > 0);
  }, [category, recentOrders.length]);

  const topics: SupportTopic[] = useMemo(
    () => [
      {
        title: 'Orders & delivery',
        description: 'Track orders, delivery updates, and delivery issues.',
        icon: Truck,
        links: [
          { label: 'My Orders', to: '/account/orders?from=account-support' },
          { label: 'Track an order', to: '/track-order?from=account-support' },
          { label: 'Shipping info', to: '/shipping?from=account-support' },
        ],
      },
      {
        title: 'Returns & refunds',
        description: 'Start a return, check refund status, and policy info.',
        icon: RotateCcw,
        links: [
          { label: 'Returns & refunds', to: '/account/returns?from=account-support' },
          { label: 'FAQ: Returns', to: '/faq?from=account-support&category=returns' },
        ],
      },
      {
        title: 'Payments & billing',
        description: 'Payment methods, charges, invoices, and billing help.',
        icon: CreditCard,
        links: [
          { label: 'Payment methods', to: '/account/payments?from=account-support' },
          { label: 'FAQ: Payments', to: '/faq?from=account-support&category=payments' },
        ],
      },
      {
        title: 'Account & security',
        description: 'Password, login issues, and account safety.',
        icon: User,
        links: [
          { label: 'Security', to: '/account/security?from=account-support' },
          { label: 'Settings', to: '/account/settings?from=account-support' },
        ],
      },
      {
        title: 'Help center',
        description: 'Browse FAQs and guides.',
        icon: BookOpen,
        links: [
          { label: 'FAQ', to: '/faq?from=account-support' },
          { label: 'Contact us', to: '/contact?from=account-support' },
        ],
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter((t) =>
      [t.title, t.description, ...t.links.map((l) => l.label)].some((s) =>
        s.toLowerCase().includes(q)
      )
    );
  }, [query, topics]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
          Support
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find answers fast, or contact us for help with orders, payments, and your account.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search support topics (orders, refunds, payments, account...)"
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* My support tickets (persisted per account) */}
      {tickets.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              My support tickets
            </h2>
            <Link to="/account/support/tickets?from=account-support">
              <Button variant="secondary" size="sm" className="flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {tickets.slice(0, 5).map((t) => (
              <Link
                key={t.id}
                to="/account/support/tickets"
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{t.subject}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t.category} · {t.status.replace('_', ' ')} · {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                  {t.id}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Topic cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {filtered.map((topic) => {
          const Icon = topic.icon;
          return (
            <div key={topic.title} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                      {topic.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{topic.description}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {topic.links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{l.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create ticket */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">
          Create a support request
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-5">
          Submit a ticket and we’ll get back to you. This is saved to the server for troubleshooting.
        </p>

        {ticketId && (
          <div className="mb-5 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/40">
            <div className="font-semibold text-green-800 dark:text-green-200">
              Ticket created: {ticketId}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300 mt-1">
              Keep this ID for reference.
            </div>
          </div>
        )}

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (orderNumber.trim() && !validateOrderNumber(orderNumber)) return;
            setIsSubmitting(true);
            try {
              let ticketIdRes: string;
              try {
                const res = await createSupportTicket({
                  category,
                  priority,
                  subject: subject.trim(),
                  message: message.trim(),
                  orderNumber: orderNumber.trim() ? orderNumber.trim() : undefined,
                });
                ticketIdRes = res.ticketId;
              } catch {
                ticketIdRes = '';
              }
              const ticket = addTicket({
                category,
                priority,
                subject: subject.trim(),
                message: message.trim(),
                orderNumber: orderNumber.trim() ? orderNumber.trim() : undefined,
              });
              setTicketId(ticketIdRes || ticket.id);
              setSubject('');
              setOrderNumber('');
              setMessage('');
              toast.success('Support ticket created and saved');
            } catch (err: any) {
              const status = err?.response?.status;
              if (status === 401) {
                toast.error('Please login again and retry');
              } else {
                toast.error(err?.response?.data?.message || 'Failed to create ticket');
              }
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SupportTicketCategory)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="orders">Orders & delivery</option>
              <option value="returns">Returns & refunds</option>
              <option value="payments">Payments & billing</option>
              <option value="account">Account & security</option>
              <option value="technical">Technical issue</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as SupportTicketPriority)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="low">Low (48h response)</option>
              <option value="normal">Normal (24h response)</option>
              <option value="high">High (8h response)</option>
              <option value="urgent">Urgent (2h response)</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Target response: {PRIORITY_SLA_HOURS[priority]} hours
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="E.g. Refund not received for order #12345"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
              minLength={3}
              maxLength={120}
            />
          </div>

          {showRecentOrders && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select recent order (optional)
              </label>
              <select
                value=""
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    setOrderNumber(val);
                    setOrderNumberError(null);
                  }
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">— Choose an order —</option>
                {recentOrders.map((o) => (
                  <option key={o.id} value={o.orderNumber}>
                    {o.orderNumber} · {o.status} · {new Date(o.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Order number (optional)
            </label>
            <input
              value={orderNumber}
              onChange={(e) => {
                setOrderNumber(e.target.value);
                if (orderNumberError) setOrderNumberError(null);
              }}
              onBlur={() => orderNumber.trim() && validateOrderNumber(orderNumber)}
              placeholder="E.g. E11-12345678"
              className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                orderNumberError ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
              }`}
              maxLength={64}
            />
            {orderNumberError && (
              <p className="text-sm text-red-500 mt-1">{orderNumberError}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what happened, what you expected, and any steps to reproduce."
              className="w-full min-h-[140px] px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
              minLength={10}
              maxLength={5000}
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <Button variant="primary" disabled={isSubmitting}>
              <MessageSquare className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Submitting…' : 'Submit ticket'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setCategory('technical');
                setPriority('normal');
                setSubject('Bug report');
                setMessage('');
                toast.success('Bug report template loaded');
              }}
            >
              <Bug className="w-4 h-4 mr-2" />
              Report a bug
            </Button>
            <Link to="/contact?from=account-support">
              <Button type="button" variant="secondary">
                <BookOpen className="w-4 h-4 mr-2" />
                Open contact form
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

