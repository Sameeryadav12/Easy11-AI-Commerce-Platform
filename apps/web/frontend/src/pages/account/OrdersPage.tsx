import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Search,
  Download,
  RotateCcw,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  AlertCircle,
  XCircle,
  Gift,
} from 'lucide-react';
import { useOrdersStore, Order } from '../../store/ordersStore';
import { Button } from '../../components/ui';
import TrackPackageModal from '../../components/orders/TrackPackageModal';
import CancelOrderModal from '../../components/orders/CancelOrderModal';
import { downloadInvoice } from '../../components/orders/InvoicePrint';
import { getDeliveryEtaText } from '../../utils/orderUtils';
import { computeOrderPoints } from '../../utils/rewardsConstants';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const { orders, cancelOrder, isLoading } = useOrdersStore();
  const [searchQuery, setSearchQuery] = useState('');
  type FilterValue = 'all' | 'delivered' | 'in_transit' | 'cancelled' | 'returned';
  const [statusFilter, setStatusFilter] = useState<FilterValue>('all');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [cancelOrderModal, setCancelOrderModal] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      if (statusFilter === 'in_transit') matchesStatus = ['shipped', 'out_for_delivery'].includes(order.status);
      else if (statusFilter === 'delivered') matchesStatus = order.status === 'delivered';
      else if (statusFilter === 'cancelled') matchesStatus = order.status === 'cancelled';
      else if (statusFilter === 'returned') matchesStatus = order.status === 'returned';
    }
    return matchesSearch && matchesStatus;
  });

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      packed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      out_for_delivery: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      delivered: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      returned: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return colors[status];
  };

  const getStatusIcon = (status: Order['status']) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      packed: Package,
      shipped: Truck,
      out_for_delivery: MapPin,
      delivered: CheckCircle,
      cancelled: AlertCircle,
      returned: RotateCcw,
    };
    return icons[status];
  };

  /** Order lifecycle: Confirmed → Packed → Shipped → Out for delivery → Delivered */
  const LIFECYCLE_STEPS: { key: Order['status']; label: string }[] = [
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'packed', label: 'Packed' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'out_for_delivery', label: 'Out for delivery' },
    { key: 'delivered', label: 'Delivered' },
  ];
  const getLifecycleProgress = (status: Order['status']) => {
    const idx = LIFECYCLE_STEPS.findIndex((s) => s.key === status);
    if (idx === -1) return { currentIndex: -1, steps: LIFECYCLE_STEPS };
    return { currentIndex: idx, steps: LIFECYCLE_STEPS };
  };

  /** Delivery ETA: "Estimated delivery: Feb 12–14" or "Delivered on Feb 8" or "Updating soon" */
  const getDeliveryDisplayText = (order: Order): string => getDeliveryEtaText(order);

  const handleDownloadInvoice = (order: Order) => {
    downloadInvoice(order);
    toast.success(`Invoice for order #${order.orderNumber} ready to print`);
  };

  const handleTrackOrder = (order: Order) => {
    setTrackingOrder(order);
  };

  const handleOpenCancelModal = (order: Order) => {
    setCancelOrderModal(order);
  };

  const handleConfirmCancel = (opts: {
    reason: string;
    reasonOther?: string;
    cancelEntire: boolean;
    itemIds: string[];
  }) => {
    if (!cancelOrderModal) return;
    cancelOrder(cancelOrderModal.id, {
      cancellationReason: opts.reason,
      cancellationReasonOther: opts.reasonOther,
    });
    toast.success('Order cancelled');
    setCancelOrderModal(null);
  };

  /** Before shipping → Cancel. Packed/Shipped → Track. Delivered → Return. */
  const canCancel = (o: Order) => ['pending', 'confirmed', 'packed'].includes(o.status);
  const canTrack = (o: Order) => ['packed', 'shipped', 'out_for_delivery'].includes(o.status);
  const canReturn = (o: Order) => o.status === 'delivered';

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
          My Orders
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and manage all your orders in one place
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order number or product name..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'All Orders', value: 'all' },
            { label: 'Delivered', value: 'delivered' },
            { label: 'In Transit', value: 'in_transit' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Returned', value: 'returned' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value as FilterValue)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                statusFilter === filter.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="mt-3 text-gray-600 dark:text-gray-400">Loading orders…</p>
        </div>
      )}

      {/* Orders List */}
      {!isLoading && filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrders.has(order.id);
            const StatusIcon = getStatusIcon(order.status);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
              >
                {/* Order Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  onClick={() => toggleExpand(order.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Link
                        to={`/account/orders/${order.id}`}
                        className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block"
                      >
                        Order #{order.orderNumber}
                      </Link>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Placed on {new Date(order.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      {order.status === 'cancelled' ? (
                        <>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {order.cancelledAt
                              ? (() => {
                                  const d = new Date(order.cancelledAt);
                                  const dateStr = d.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  });
                                  const timeStr = d.toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                  });
                                  return `Cancelled on ${dateStr} • ${timeStr}`;
                                })()
                              : order.date
                                ? `Cancelled on ${new Date(order.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}`
                                : 'Cancelled'}
                            {order.refundInitiated ? '. Refund initiated.' : ''}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Order closed</p>
                        </>
                      ) : getDeliveryDisplayText(order) ? (
                        <p className="text-sm font-medium text-teal-600 dark:text-teal-400 mt-1">
                          {getDeliveryDisplayText(order)}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        <span className="capitalize">{order.status.replace('_', ' ')}</span>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Order Summary (Always Visible) */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Product Thumbnails */}
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xl border-2 border-white dark:border-gray-800"
                          >
                            {item.image}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs font-semibold border-2 border-white dark:border-gray-800">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ${order.total.toFixed(2)}
                      </p>
                      {(() => {
                        const pts = order.pointsEarned ?? computeOrderPoints(order.subtotal ?? 0);
                        if (pts <= 0) return null;
                        const isReversed = order.status === 'cancelled' || order.status === 'returned';
                        const isDelivered = order.status === 'delivered';
                        const label = isReversed ? `+${pts} pts → reversed` : isDelivered ? `+${pts} pts earned` : `+${pts} pts pending`;
                        return (
                          <p className={`text-xs flex items-center justify-end gap-1 ${isReversed ? 'text-rose-600 dark:text-rose-400' : isDelivered ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <Gift className="w-3.5 h-3.5" />
                            {label}
                          </p>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-6 space-y-6">
                        {/* Order Lifecycle: Confirmed → Packed → Shipped → Out for delivery → Delivered */}
                        {!['cancelled', 'returned', 'pending'].includes(order.status) && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                              Order progress
                            </h4>
                            <div className="flex items-center gap-0">
                              {getLifecycleProgress(order.status).steps.map((step, idx) => {
                                const { currentIndex } = getLifecycleProgress(order.status);
                                const isComplete = idx < currentIndex;
                                const isCurrent = idx === currentIndex;
                                return (
                                  <div key={step.key} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                      <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                                          isComplete
                                            ? 'bg-teal-500 text-white'
                                            : isCurrent
                                              ? 'bg-blue-500 text-white ring-2 ring-blue-200 dark:ring-blue-800'
                                              : 'bg-gray-200 dark:bg-gray-600 text-gray-500'
                                        }`}
                                      >
                                        {isComplete ? '✓' : idx + 1}
                                      </div>
                                      <span
                                        className={`text-xs mt-2 text-center font-medium ${
                                          isCurrent
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : isComplete
                                              ? 'text-teal-600 dark:text-teal-400'
                                              : 'text-gray-400 dark:text-gray-500'
                                        }`}
                                      >
                                        {step.label}
                                      </span>
                                    </div>
                                    {idx < LIFECYCLE_STEPS.length - 1 && (
                                      <div
                                        className={`flex-1 h-0.5 mx-1 rounded ${
                                          isComplete ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-600'
                                        }`}
                                        style={{ minWidth: 8 }}
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Cancellation & refund (cancelled orders only) */}
                        {order.status === 'cancelled' && (
                          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                              Cancellation & refund
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {order.cancelledAt
                                ? (() => {
                                    const d = new Date(order.cancelledAt);
                                    const dateStr = d.toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    });
                                    const timeStr = d.toLocaleTimeString('en-US', {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true,
                                    });
                                    return `Cancelled on ${dateStr} • ${timeStr}. Refund initiated.`;
                                  })()
                                : order.date
                                  ? (() => {
                                      const d = new Date(order.date);
                                      const dateStr = d.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                      });
                                      return `Cancelled on ${dateStr}. Refund initiated.`;
                                    })()
                                  : 'Order cancelled. Refund initiated.'}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                              Refund status: Processing (3–5 business days)
                            </p>
                            {order.paymentMethod && (
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                Refund method:{' '}
                                {(() => {
                                  const match = order.paymentMethod.match(/\s*ending in\s+(\d+)/i);
                                  if (match) {
                                    const last4 = match[1];
                                    const brand = order.paymentMethod.replace(/\s*ending in\s+\d+/i, '').trim();
                                    const name = brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : 'Card';
                                    return `${name} •••• ${last4}`;
                                  }
                                  return order.paymentMethod;
                                })()}
                              </p>
                            )}
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Refund processing: 3–5 business days
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                              You&apos;ll receive an email once the refund is completed.
                            </p>
                          </div>
                        )}

                        {/* Items List */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                            Items in this order:
                          </h4>
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                                    {item.image}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {item.name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      Qty: {Number(item.quantity) || 1} • {item.category}
                                    </p>
                                  </div>
                                </div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  ${(Number(item.price) || 0).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              Shipping Address
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                              {order.status === 'cancelled' ? (
                                <>
                                  <p className="text-gray-500 dark:text-gray-400 italic">
                                    Shipment stopped before dispatch.
                                  </p>
                                  <p className="mt-2 font-medium">{order.shippingAddress.name}</p>
                                  <p>
                                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                    •••{order.shippingAddress.zipCode?.slice(-1) ?? ''}
                                  </p>
                                  <p>{order.shippingAddress.country}</p>
                                </>
                              ) : (
                                <>
                                  <p className="font-medium">{order.shippingAddress.name}</p>
                                  <p>{order.shippingAddress.address}</p>
                                  <p>
                                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                    {order.shippingAddress.zipCode}
                                  </p>
                                  <p>{order.shippingAddress.country}</p>
                                </>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                              <CreditCard className="w-4 h-4 mr-2" />
                              Payment Method
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                              {order.status === 'cancelled' ? (
                                <>
                                  <p>
                                    {(() => {
                                      const match = order.paymentMethod?.match(/\s*ending in\s+(\d+)/i);
                                      if (match) {
                                        const last4 = match[1];
                                        const brand = order.paymentMethod!.replace(/\s*ending in\s+\d+/i, '').trim();
                                        const name = brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : 'Card';
                                        return `${name} •••• ${last4}`;
                                      }
                                      return order.paymentMethod;
                                    })()}
                                  </p>
                                  <p className="mt-2 text-gray-500 dark:text-gray-400 text-xs">
                                    Refund will go to this method.
                                  </p>
                                  <p className="mt-1 font-medium">Order Total: ${order.total.toFixed(2)}</p>
                                </>
                              ) : (
                                <>
                                  <p>{order.paymentMethod}</p>
                                  <p className="mt-2 font-medium">Order Total: ${order.total.toFixed(2)}</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Tracking Info */}
                        {(order.trackingNumber || order.estimatedDelivery) && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                              <Truck className="w-4 h-4 mr-2" />
                              Tracking Information
                            </h4>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                              {order.trackingNumber && (
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                  <span className="font-medium">Tracking Number:</span>{' '}
                                  {order.trackingNumber}
                                </p>
                              )}
                              {order.carrier && (
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                  <span className="font-medium">Carrier:</span> {order.carrier}
                                </p>
                              )}
                              {order.estimatedDelivery && (
                                <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  <span className="font-medium">Estimated Delivery:</span>{' '}
                                  {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </p>
                              )}
                              {order.deliveredDate && (
                                <p className="text-sm text-teal-700 dark:text-teal-300 flex items-center mt-2">
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  <span className="font-medium">Delivered on:</span>{' '}
                                  {new Date(order.deliveredDate).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions: View Details always; Cancel / Track / Return by status; for cancelled: View details + Contact support only */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Link to={`/account/orders/${order.id}`}>
                            <Button variant="primary" size="sm">
                              View order details
                            </Button>
                          </Link>
                          {order.status === 'cancelled' ? null : canCancel(order) ? (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleOpenCancelModal(order)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancel order
                            </Button>
                          ) : null}
                          {canTrack(order) && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleTrackOrder(order)}
                            >
                              <Truck className="w-4 h-4 mr-2" />
                              Track package
                            </Button>
                          )}
                          {canReturn(order) && (
                            <Link to={`/account/returns?order=${order.id}&from=orders`}>
                              <Button variant="secondary" size="sm">
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Return / Refund
                              </Button>
                            </Link>
                          )}
                          {order.status !== 'cancelled' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadInvoice(order)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download invoice
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadInvoice(order)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Cancelled invoice
                            </Button>
                          )}
                          <Link to="/account/support" state={{ from: 'orders', orderId: order.id }}>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Contact support
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      ) : !isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-16 text-center"
        >
          <Package className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
          <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-3">
            {searchQuery
              ? 'No orders match'
              : statusFilter !== 'all'
                ? (() => {
                    const messages: Record<string, string> = {
                      delivered: "No delivered orders yet",
                      in_transit: "No orders in transit",
                      cancelled: "No cancelled orders yet",
                      returned: "No returned orders yet",
                    };
                    return messages[statusFilter] ?? `No ${statusFilter.replace('_', ' ')} orders yet`;
                  })()
                : 'No orders yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-2">
            {searchQuery
              ? 'Try a different search term or order number.'
              : statusFilter !== 'all'
                ? (() => {
                    const subtitles: Record<string, string> = {
                      delivered: "Orders you've received will show up here.",
                      in_transit: "Orders that are on the way will appear here.",
                      cancelled: "Cancelled orders will be listed here.",
                      returned: "Returned or refunded orders will appear here.",
                    };
                    return subtitles[statusFilter] ?? `When you have ${statusFilter.replace('_', ' ')} orders, they'll appear here.`;
                  })()
                : 'Your order history will appear here after your first purchase.'}
          </p>
          {statusFilter !== 'all' && !searchQuery && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Switch to &quot;All Orders&quot; below to see everything.
            </p>
          )}
          <div className="mb-6" />
          {(searchQuery || statusFilter !== 'all') && (
            <Button
              variant="secondary"
              className="mr-3"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
            >
              Clear filters
            </Button>
          )}
          <Link to="/products">
            <Button variant="primary">Browse products</Button>
          </Link>
        </motion.div>
      ) : null}

      {/* Track Package Modal */}
      {trackingOrder && (
        <TrackPackageModal
          isOpen={!!trackingOrder}
          onClose={() => setTrackingOrder(null)}
          order={trackingOrder}
        />
      )}

      {/* Cancel Order Modal */}
      {cancelOrderModal && (
        <CancelOrderModal
          isOpen={!!cancelOrderModal}
          onClose={() => setCancelOrderModal(null)}
          order={cancelOrderModal}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
}

