/**
 * Vendor Orders Management Page
 * Sprint 9: Order journey orchestration, logistics & support workflows
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Clock,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  Eye,
  CreditCard,
  DollarSign,
  MapPin,
  User2,
  MessageSquare,
  Undo2,
  Loader2,
} from 'lucide-react';
import { useVendorOrderStore } from '../../store/vendorOrderStore';
import vendorAPI from '../../services/vendorAPI';
import { Button, Badge } from '../../components/ui';
import toast from 'react-hot-toast';
import type { VendorOrder, VendorOrderStatus } from '../../types/vendor';
import { OrderTimeline } from '../../components/vendor/OrderTimeline';
import { RefundSummaryCard } from '../../components/vendor/RefundSummaryCard';

const formatCurrency = (value: number, currency = 'AUD') =>
  value.toLocaleString(undefined, { style: 'currency', currency });

export default function VendorOrders() {
  const {
    orders,
    stats,
    setOrders,
    updateOrderStatus: updateStatusInStore,
    updateOrder: updateOrderInStore,
    addInternalNote,
  } = useVendorOrderStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<VendorOrderStatus>('confirmed');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [isStatusSubmitting, setIsStatusSubmitting] = useState(false);

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [isRefundSubmitting, setIsRefundSubmitting] = useState(false);

  const [noteMessage, setNoteMessage] = useState('');
  const [isNoteSubmitting, setIsNoteSubmitting] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await vendorAPI.getVendorOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedStatus !== 'all' && order.status !== selectedStatus) return false;
    if (searchTerm && !order.order_number.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      setIsStatusSubmitting(true);
      const tracking =
        newStatus === 'shipped' ? { tracking_number: trackingNumber, carrier: carrier || undefined } : undefined;
      const updatedOrder = await vendorAPI.updateVendorOrderStatus(selectedOrder.id, newStatus, tracking);
      updateStatusInStore(selectedOrder.id, newStatus);
      updateOrderInStore(selectedOrder.id, updatedOrder);
      setSelectedOrder(updatedOrder);
      toast.success(`Order ${newStatus}!`);
      setShowStatusModal(false);
      setTrackingNumber('');
      setCarrier('');
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setIsStatusSubmitting(false);
    }
  };

  const handleOpenDetail = (order: VendorOrder) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedOrder(null);
  };

  const handleSubmitRefund = async () => {
    if (!selectedOrder) return;
    const amount = Number(refundAmount);
    if (!amount || amount <= 0) {
      toast.error('Enter a valid refund amount');
      return;
    }

    try {
      setIsRefundSubmitting(true);
      const updatedOrder = await vendorAPI.issueVendorOrderRefund(selectedOrder.id, amount, refundReason);
      updateOrderInStore(updatedOrder.id, updatedOrder);
      setSelectedOrder(updatedOrder);
      toast.success('Refund initiated');
      setShowRefundModal(false);
      setRefundAmount('');
      setRefundReason('');
    } catch (error) {
      toast.error('Failed to initiate refund');
    } finally {
      setIsRefundSubmitting(false);
    }
  };

  const handleAddNote = async () => {
    if (!selectedOrder || !noteMessage.trim()) {
      toast.error('Add note details first');
      return;
    }

    try {
      setIsNoteSubmitting(true);
      const updatedOrder = await vendorAPI.addVendorOrderNote(selectedOrder.id, {
        author: { name: 'TechCo Ops', role: 'vendor' },
        message: noteMessage.trim(),
        visibility: 'internal',
      });
      updateOrderInStore(updatedOrder.id, updatedOrder);
      if (updatedOrder.internal_notes?.[0]) {
        addInternalNote(selectedOrder.id, updatedOrder.internal_notes[0]);
      }
      setSelectedOrder(updatedOrder);
      setNoteMessage('');
      toast.success('Internal note added');
    } catch (error) {
      toast.error('Could not add note');
    } finally {
      setIsNoteSubmitting(false);
    }
  };

  const getStatusIcon = (status: VendorOrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'preparing':
        return <Package className="w-5 h-5" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
      case 'refunded':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: VendorOrderStatus) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'confirmed':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'preparing':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      case 'shipped':
        return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30';
      case 'delivered':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'cancelled':
      case 'refunded':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Manage fulfillment, refunds, and support flows.</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Pending', value: stats.pending, color: 'text-yellow-600', icon: Clock },
            { label: 'Confirmed', value: stats.confirmed, color: 'text-blue-600', icon: CheckCircle },
            { label: 'Shipped', value: stats.shipped, color: 'text-indigo-600', icon: Truck },
            { label: 'Delivered', value: stats.delivered, color: 'text-green-600', icon: CheckCircle },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
              <div className="mb-2 flex items-center gap-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex flex-1 gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order number..."
                className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-blue-900/30"
              />
              <Button variant="primary">
                <Search className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {['all', 'pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium transition-colors ${
                      selectedStatus === status
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl bg-white py-16 text-center shadow-md dark:bg-gray-800">
            <Package className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{order.order_number}</h3>
                      <span
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    <div className="grid gap-3 text-sm md:grid-cols-3">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Customer</p>
                        <p className="font-medium text-gray-900 dark:text-white">{order.customer.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Total</p>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {formatCurrency(order.total, order.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Payout</p>
                        <p className="font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(order.vendor_payout, order.currency)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 text-sm">
                          <img src={item.product_image} alt={item.product_name} className="h-12 w-12 rounded-lg object-cover" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{item.product_name}</p>
                            <p className="text-gray-600 dark:text-gray-400">
                              Qty: {item.quantity} × {formatCurrency(item.unit_price, order.currency)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="secondary" onClick={() => handleOpenDetail(order)} className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      View details
                    </Button>
                    {order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'refunded' && (
                      <Button
                        variant="primary"
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(
                            order.status === 'pending'
                              ? 'confirmed'
                              : order.status === 'confirmed'
                              ? 'preparing'
                              : 'shipped'
                          );
                          setShowStatusModal(true);
                        }}
                      >
                        Update status
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Status update modal */}
        <AnimatePresence>
          {showStatusModal && selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setShowStatusModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800"
                onClick={(event) => event.stopPropagation()}
              >
                <h3 className="mb-6 text-2xl font-heading font-bold text-gray-900 dark:text-white">
                  Update Order Status
                </h3>
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      New status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as VendorOrderStatus)}
                      className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  {newStatus === 'shipped' && (
                    <>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Tracking number *
                        </label>
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="e.g., 1Z999AA10123456784"
                          className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Carrier
                        </label>
                        <input
                          type="text"
                          value={carrier}
                          onChange={(e) => setCarrier(e.target.value)}
                          placeholder="e.g., Australia Post, FedEx"
                          className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setShowStatusModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleUpdateStatus}
                    disabled={(newStatus === 'shipped' && !trackingNumber) || isStatusSubmitting}
                    className="flex flex-1 items-center justify-center gap-2"
                  >
                    {isStatusSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Update
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Detail panel */}
      <AnimatePresence>
        {isDetailOpen && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={handleCloseDetail}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-full max-w-3xl overflow-y-auto bg-white p-8 shadow-2xl dark:bg-gray-900"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-blue-500 dark:text-blue-300">
                    Order detail
                  </p>
                  <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                    {selectedOrder.order_number}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Created{' '}
                    {new Date(selectedOrder.created_at).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <Badge variant="info" className="capitalize">
                  {selectedOrder.status}
                </Badge>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
                    <DollarSign className="h-4 w-4" />
                    Financials
                  </div>
                  <p className="mt-1 text-xl font-heading font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(selectedOrder.total, selectedOrder.currency)}
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <p>Subtotal: {formatCurrency(selectedOrder.subtotal, selectedOrder.currency)}</p>
                    <p>Shipping: {formatCurrency(selectedOrder.shipping_fee, selectedOrder.currency)}</p>
                    <p>Commission: {formatCurrency(selectedOrder.commission_fee, selectedOrder.currency)}</p>
                    <p>Payout: {formatCurrency(selectedOrder.vendor_payout, selectedOrder.currency)}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
                    <CreditCard className="h-4 w-4" />
                    Payment
                  </div>
                  {selectedOrder.payment ? (
                    <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <p>
                        {selectedOrder.payment.method.toUpperCase()} · {selectedOrder.payment.processor}
                      </p>
                      <p>Status: {selectedOrder.payment.status}</p>
                      <p>Captured: {new Date(selectedOrder.payment.captured_at).toLocaleString()}</p>
                      <p>Transaction: {selectedOrder.payment.transaction_id}</p>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Payment data unavailable.</p>
                  )}
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
                    <User2 className="h-4 w-4" />
                    Customer
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedOrder.customer.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedOrder.customer.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedOrder.customer.phone}</p>
                  {selectedOrder.customer_notes && (
                    <p className="mt-3 rounded-lg bg-blue-50 p-3 text-xs text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                      Customer note: {selectedOrder.customer_notes}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Shipping
                    </div>
                    {selectedOrder.status !== 'delivered' &&
                      selectedOrder.status !== 'cancelled' &&
                      selectedOrder.status !== 'refunded' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setNewStatus(
                              selectedOrder.status === 'pending'
                                ? 'confirmed'
                                : selectedOrder.status === 'confirmed'
                                ? 'preparing'
                                : 'shipped'
                            );
                            setShowStatusModal(true);
                          }}
                        >
                          Update status
                        </Button>
                      )}
                  </div>
                  <p className="mt-2 text-sm text-gray-900 dark:text-white">
                    {selectedOrder.shipping_address.full_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedOrder.shipping_address.line1}
                    {selectedOrder.shipping_address.line2 ? `, ${selectedOrder.shipping_address.line2}` : ''}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}{' '}
                    {selectedOrder.shipping_address.postal_code}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedOrder.shipping_address.country} · {selectedOrder.shipping_address.phone}
                  </p>
                  {selectedOrder.tracking_number && (
                    <div className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      <p>Tracking: {selectedOrder.tracking_number}</p>
                      {selectedOrder.carrier && <p>Carrier: {selectedOrder.carrier}</p>}
                    </div>
                  )}
                  {selectedOrder.fulfillment_sla && (
                    <div className="mt-3 grid gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <p>
                        Dispatch by:{' '}
                        {new Date(selectedOrder.fulfillment_sla.promised_dispatch_at).toLocaleString()}
                      </p>
                      <p>
                        Deliver by:{' '}
                        {new Date(selectedOrder.fulfillment_sla.promised_delivery_at).toLocaleString()}
                      </p>
                      {selectedOrder.fulfillment_sla.breach_risk && (
                        <p>Risk level: {selectedOrder.fulfillment_sla.breach_risk}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                    Items
                  </h3>
                  <div className="mt-3 space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                        <img src={item.product_image} alt={item.product_name} className="h-12 w-12 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.product_name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SKU {item.sku} · Qty {item.quantity} × {formatCurrency(item.unit_price, selectedOrder.currency)}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(item.total_price, selectedOrder.currency)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                      Timeline
                    </h3>
                    <Badge variant="secondary" size="sm">
                      {selectedOrder.timeline?.length ?? 0} events
                    </Badge>
                  </div>
                  <OrderTimeline events={selectedOrder.timeline ?? []} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                      Refunds
                    </h3>
                    <Button variant="secondary" size="sm" onClick={() => setShowRefundModal(true)}>
                      <Undo2 className="h-4 w-4" />
                      Initiate refund
                    </Button>
                  </div>
                  <RefundSummaryCard refund={selectedOrder.refund} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                      Internal notes
                    </h3>
                    <Badge variant="secondary" size="sm">
                      {selectedOrder.internal_notes?.length ?? 0}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {selectedOrder.internal_notes?.map((note) => (
                      <div
                        key={note.id}
                        className="rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{note.author.name}</span>
                          <span>{new Date(note.created_at).toLocaleString()}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{note.message}</p>
                      </div>
                    ))}
                    <div className="rounded-xl border border-dashed border-gray-300 p-3 dark:border-gray-700">
                      <textarea
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-900 focus:border-blue focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        placeholder="Add internal note…"
                        value={noteMessage}
                        onChange={(event) => setNoteMessage(event.target.value)}
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        className="mt-2 flex items-center gap-2"
                        onClick={handleAddNote}
                        disabled={isNoteSubmitting}
                      >
                        {isNoteSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        <MessageSquare className="h-4 w-4" />
                        Save note
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refund modal */}
      <AnimatePresence>
        {showRefundModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowRefundModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white">Initiate refund</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Refunds notify the customer automatically and adjust your payout statement.
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount ({selectedOrder.currency ?? 'AUD'})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={refundAmount}
                    onChange={(event) => setRefundAmount(event.target.value)}
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reason (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={refundReason}
                    onChange={(event) => setRefundReason(event.target.value)}
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowRefundModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex flex-1 items-center justify-center gap-2"
                  onClick={handleSubmitRefund}
                  disabled={isRefundSubmitting}
                >
                  {isRefundSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Issue refund
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

