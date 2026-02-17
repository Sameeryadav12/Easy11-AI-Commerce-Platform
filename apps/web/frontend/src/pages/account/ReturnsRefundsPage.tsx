import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Search,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Modal, ModalFooter } from '../../components/ui';
import { useOrdersStore, type Order } from '../../store/ordersStore';
import { useReturnsStore, type ReturnReason, type ReturnResolution, type ReturnRequest } from '../../store/returnsStore';

const RETURN_WINDOW_DAYS = 30;

function isEligibleForReturn(order: Order) {
  if (order.status !== 'delivered') return false;
  const delivered = order.deliveredDate ? new Date(order.deliveredDate).getTime() : new Date(order.date).getTime();
  const days = (Date.now() - delivered) / (1000 * 60 * 60 * 24);
  return days <= RETURN_WINDOW_DAYS;
}

function statusMeta(status: ReturnRequest['status']) {
  switch (status) {
    case 'requested':
      return { label: 'Requested', icon: Clock, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' };
    case 'approved':
      return { label: 'Approved', icon: BadgeCheck, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
    case 'shipped':
      return { label: 'Shipped', icon: Truck, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' };
    case 'received':
      return { label: 'Received', icon: Package, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' };
    case 'refunded':
      return { label: 'Refunded', icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' };
    case 'denied':
      return { label: 'Denied', icon: XCircle, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' };
  }
}

export default function ReturnsRefundsPage() {
  const orders = useOrdersStore((s) => s.orders);
  const requests = useReturnsStore((s) => s.requests);
  const createRequest = useReturnsStore((s) => s.createRequest);
  const updateStatus = useReturnsStore((s) => s.updateStatus);

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reason, setReason] = useState<ReturnReason>('not_as_described');
  const [resolution, setResolution] = useState<ReturnResolution>('refund');
  const [notes, setNotes] = useState('');

  const eligibleOrders = useMemo(() => orders.filter(isEligibleForReturn), [orders]);

  const filteredRequests = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter((r) => r.orderNumber.toLowerCase().includes(q) || r.status.toLowerCase().includes(q));
  }, [requests, search]);

  const openStartReturn = (order: Order) => {
    setSelectedOrder(order);
    setReason('not_as_described');
    setResolution('refund');
    setNotes('');
    setOpen(true);
  };

  const submitReturn = () => {
    if (!selectedOrder) return;
    const created = createRequest({
      orderId: selectedOrder.id,
      orderNumber: selectedOrder.orderNumber,
      reason,
      resolution,
      notes: notes.trim() ? notes.trim() : undefined,
      refundAmount: selectedOrder.total,
      refundMethod: selectedOrder.paymentMethod,
    });
    setOpen(false);
    toast.success(`Return requested for order #${selectedOrder.orderNumber}`);

    // UX: simulate an “accepted/approved” state like marketplaces after review.
    window.setTimeout(() => {
      updateStatus(created.id, 'approved');
    }, 800);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
          Returns & Refunds
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Start a return, track return status, and check refund timelines.
        </p>
      </div>

      {/* Start return */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
              Start a return
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Items are typically eligible within {RETURN_WINDOW_DAYS} days of delivery.
            </p>
          </div>
          <Link to="/account/orders">
            <Button variant="secondary">View orders</Button>
          </Link>
        </div>

        <div className="mt-4">
          {eligibleOrders.length === 0 ? (
            <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 mt-0.5 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="font-semibold">No eligible orders found</div>
                  <div className="text-sm mt-1">
                    When you have delivered orders, you’ll be able to start a return here.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eligibleOrders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        Order #{order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Delivered: {new Date(order.deliveredDate || order.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total: ${order.total.toFixed(2)} • {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => openStartReturn(order)}
                      className="whitespace-nowrap"
                    >
                      Start return
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Track returns */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
              Track returns
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Similar to Amazon/eBay: request → approval → ship back → refund.
            </p>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number or status..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-10 rounded-xl bg-gray-50 dark:bg-gray-700/40">
            <RotateCcw className="w-14 h-14 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <div className="font-semibold text-gray-900 dark:text-white">No return requests yet</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Start a return above to see tracking here.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((r) => {
              const meta = statusMeta(r.status);
              const Icon = meta.icon;
              return (
                <div
                  key={r.id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          Return for Order #{r.orderNumber}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${meta.color}`}>
                          <span className="inline-flex items-center gap-1">
                            <Icon className="w-3.5 h-3.5" />
                            {meta.label}
                          </span>
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Requested on {new Date(r.createdAt).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Refund method: {r.refundMethod || '—'} • Est. amount: {typeof r.refundAmount === 'number' ? `$${r.refundAmount.toFixed(2)}` : '—'}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {r.status === 'approved' && (
                        <Button
                          variant="secondary"
                          onClick={() => {
                            updateStatus(r.id, 'shipped', { trackingNumber: 'TRK-' + Math.random().toString(36).slice(2, 10).toUpperCase() });
                            toast.success('Marked as shipped');
                          }}
                        >
                          Mark shipped
                        </Button>
                      )}
                      {r.status === 'shipped' && (
                        <Button
                          variant="secondary"
                          onClick={() => {
                            updateStatus(r.id, 'received');
                            window.setTimeout(() => updateStatus(r.id, 'refunded'), 800);
                            toast.success('Return received (refund processing)');
                          }}
                        >
                          Mark received
                        </Button>
                      )}
                      {r.status === 'requested' && (
                        <Button
                          variant="secondary"
                          onClick={() => {
                            updateStatus(r.id, 'approved');
                            toast.success('Approved');
                          }}
                        >
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {r.trackingNumber && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 text-sm text-gray-700 dark:text-gray-300"
                      >
                        Tracking: <span className="font-semibold">{r.trackingNumber}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Refund timeline (inspired by Amazon help docs) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-2">
          Refund timeline (typical)
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          After we receive and process your return, the time to see the refund depends on your payment method.
          (See Amazon’s refund timelines for reference.)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Credit card', value: '3–5 business days' },
            { title: 'Debit card', value: 'up to 10 business days' },
            { title: 'Store credit', value: 'same day' },
          ].map((x) => (
            <div key={x.title} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40">
              <div className="font-semibold text-gray-900 dark:text-white">{x.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{x.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Tip: Some marketplaces issue faster refunds once the carrier first scans your return.
        </div>
        <div className="mt-4">
          <Link to="/support" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium">
            Need help with a return? Contact support <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={selectedOrder ? `Start return for order #${selectedOrder.orderNumber}` : 'Start return'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReturnReason)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="damaged">Item arrived damaged</option>
              <option value="wrong_item">Wrong item received</option>
              <option value="not_as_described">Not as described</option>
              <option value="missing_parts">Missing parts/accessories</option>
              <option value="size_fit">Size/fit issue</option>
              <option value="changed_mind">Changed my mind</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Resolution
            </label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value as ReturnResolution)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="refund">Refund</option>
              <option value="replacement">Replacement</option>
              <option value="store_credit">Store credit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[110px] px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Add details (damage description, missing items, etc.)"
              maxLength={5000}
            />
          </div>
        </div>

        <ModalFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitReturn}>
            Submit return request
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

