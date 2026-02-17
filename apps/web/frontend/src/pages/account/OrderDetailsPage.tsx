/**
 * Order Details Page
 * Single order view: tracking, invoice, address, payment, support
 */

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Truck,
  Download,
  MapPin,
  CreditCard,
  MessageSquare,
  Package,
  Calendar,
  CheckCircle,
  RotateCcw,
  XCircle,
  Gift,
  FileText,
  Clock,
} from 'lucide-react';
import { useOrdersStore } from '../../store/ordersStore';
import { Button } from '../../components/ui';
import BreadcrumbBack from '../../components/navigation/BreadcrumbBack';
import TrackPackageModal from '../../components/orders/TrackPackageModal';
import CancelOrderModal from '../../components/orders/CancelOrderModal';
import { downloadInvoice } from '../../components/orders/InvoicePrint';
import { getDeliveryEtaText } from '../../utils/orderUtils';
import { computeOrderPoints } from '../../utils/rewardsConstants';
import toast from 'react-hot-toast';

const LIFECYCLE_STEPS: { key: string; label: string }[] = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const getOrderById = useOrdersStore((s) => s.getOrderById);
  const cancelOrder = useOrdersStore((s) => s.cancelOrder);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const order = orderId ? getOrderById(orderId) : null;

  const getDeliveryDisplayText = () => (order ? getDeliveryEtaText(order) : '');

  const getLifecycleProgress = () => {
    if (!order) return { currentIndex: -1 };
    const idx = LIFECYCLE_STEPS.findIndex((s) => s.key === order.status);
    return { currentIndex: idx >= 0 ? idx : -1 };
  };

  if (!order) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Order not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Link to="/account/orders">
          <Button variant="primary">Back to My Orders</Button>
        </Link>
      </div>
    );
  }

  const deliveryText = getDeliveryDisplayText();
  const { currentIndex } = getLifecycleProgress();
  const canCancel = ['pending', 'confirmed', 'packed'].includes(order.status);
  const canTrack = ['packed', 'shipped', 'out_for_delivery'].includes(order.status);
  const canReturn = order.status === 'delivered';

  /** Return window: e.g. 30 days after delivery */
  const returnEligibilityEnd =
    order.status === 'delivered' && order.deliveredDate
      ? new Date(order.deliveredDate)
      : null;
  if (returnEligibilityEnd) returnEligibilityEnd.setDate(returnEligibilityEnd.getDate() + 30);

  const handleConfirmCancel = (opts: {
    reason: string;
    reasonOther?: string;
    cancelEntire: boolean;
    itemIds: string[];
  }) => {
    cancelOrder(order.id, {
      cancellationReason: opts.reason,
      cancellationReasonOther: opts.reasonOther,
    });
    toast.success('Order cancelled');
    setShowCancelModal(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <BreadcrumbBack
          parentLabel="Orders"
          parentUrl="/account/orders"
          currentPage={`Order #${order.orderNumber}`}
          className="mb-4"
        />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Placed on {new Date(order.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            {order.status === 'cancelled' ? (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
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
            ) : deliveryText ? (
              <p className="text-teal-600 dark:text-teal-400 font-medium mt-2">{deliveryText}</p>
            ) : null}
            {(() => {
              const pts = order.pointsEarned ?? computeOrderPoints(order.subtotal ?? 0);
              if (pts <= 0) return null;
              const isReversed = order.status === 'cancelled' || order.status === 'returned';
              const isDelivered = order.status === 'delivered';
              const label = isReversed ? `+${pts} pts → reversed` : isDelivered ? `+${pts} reward points earned` : `+${pts} pts pending`;
              return (
                <p className={`text-sm mt-1 flex items-center gap-1 ${isReversed ? 'text-rose-600 dark:text-rose-400' : isDelivered ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  <Gift className="w-4 h-4" />
                  {label}
                </p>
              );
            })()}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Lifecycle */}
          {!['cancelled', 'returned', 'pending'].includes(order.status) && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Order progress</h2>
              <div className="flex items-center gap-0">
                {LIFECYCLE_STEPS.map((step, idx) => {
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Cancellation & refund</h2>
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

          {/* Full timeline (key dates) */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Order timeline
            </h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="text-gray-500 dark:text-gray-400 w-28 shrink-0">
                  {new Date(order.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-gray-700 dark:text-gray-300">Order placed</span>
              </li>
              {!['pending'].includes(order.status) && (
                <li className="flex items-center gap-3">
                  <span className="text-gray-500 dark:text-gray-400 w-28 shrink-0">
                    {new Date(order.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">Confirmed</span>
                </li>
              )}
              {order.status === 'delivered' && order.deliveredDate && (
                <li className="flex items-center gap-3">
                  <span className="text-gray-500 dark:text-gray-400 w-28 shrink-0">
                    {new Date(order.deliveredDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-teal-600 dark:text-teal-400 font-medium">Delivered</span>
                </li>
              )}
              {order.status === 'cancelled' && order.cancelledAt && (
                <li className="flex items-center gap-3">
                  <span className="text-gray-500 dark:text-gray-400 w-28 shrink-0">
                    {new Date(order.cancelledAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-red-600 dark:text-red-400 font-medium">Cancelled</span>
                </li>
              )}
              {order.status === 'returned' && (
                <li className="flex items-center gap-3">
                  <span className="text-gray-500 dark:text-gray-400 w-28 shrink-0">—</span>
                  <span className="text-gray-700 dark:text-gray-300">Returned</span>
                </li>
              )}
            </ul>
          </div>

          {/* Invoice preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Invoice summary
            </h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-600">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => {
                downloadInvoice(order);
                toast.success(
                  order.status === 'cancelled'
                    ? `Cancelled invoice for order #${order.orderNumber} ready to print`
                    : `Invoice for order #${order.orderNumber} ready to print`
                );
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              {order.status === 'cancelled' ? 'View cancelled invoice' : 'Download invoice'}
            </Button>
          </div>

          {/* Items */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Items in this order</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                      {item.image}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Qty: {Number(item.quantity) || 1} • {item.category}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${((Number(item.quantity) || 1) * (Number(item.price) || 0)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tracking */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-blue-500" />
              Tracking
            </h2>
            {(order.trackingNumber || order.estimatedDelivery || order.carrier) ? (
              <div className="space-y-3">
                {order.carrier && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Carrier:</span> {order.carrier}
                  </p>
                )}
                {order.trackingNumber && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Tracking #:</span> {order.trackingNumber}
                  </p>
                )}
                {order.estimatedDelivery && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Est. delivery:{' '}
                    {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                )}
                {order.deliveredDate && (
                  <p className="text-sm text-teal-600 dark:text-teal-400 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Delivered:{' '}
                    {new Date(order.deliveredDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}
                {canTrack && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => setShowTrackModal(true)}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Track package
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tracking will be available once your order ships.
              </p>
            )}
          </div>

          {/* Address */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              Shipping address
            </h2>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              {order.status === 'cancelled' ? (
                <>
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    Shipment stopped before dispatch.
                  </p>
                  <p className="font-medium">{order.shippingAddress.name}</p>
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

          {/* Payment */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-blue-500" />
              Payment
            </h2>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              {order.status === 'cancelled' ? (
                <>
                  <p>
                    {order.paymentMethod && (() => {
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
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    Refund will go to this method.
                  </p>
                  <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>
                </>
              ) : (
                <>
                  <p>{order.paymentMethod}</p>
                  <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>
                </>
              )}
            </div>
          </div>

          {/* Return eligibility */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <RotateCcw className="w-5 h-5 mr-2 text-blue-500" />
              Return eligibility
            </h2>
            {order.status === 'delivered' && returnEligibilityEnd ? (
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Eligible for return until{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  {returnEligibilityEnd.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </p>
            ) : order.status === 'returned' ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">This order was returned.</p>
            ) : order.status === 'cancelled' ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Not eligible (order cancelled).</p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Return available after delivery.
              </p>
            )}
            {canReturn && (
              <Link to={`/account/returns?order=${order.id}`} className="block mt-2">
                <Button variant="secondary" size="sm" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Start a return
                </Button>
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-3">
            {canCancel && (
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => setShowCancelModal(true)}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel order
              </Button>
            )}
            {canTrack && (
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => setShowTrackModal(true)}
              >
                <Truck className="w-4 h-4 mr-2" />
                Track package
              </Button>
            )}
            {canReturn && (
              <Link to={`/account/returns?order=${order.id}`} className="block">
                <Button variant="secondary" size="sm" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Return / Refund
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                downloadInvoice(order);
                toast.success(
                  order.status === 'cancelled'
                    ? `Cancelled invoice for order #${order.orderNumber} ready to print`
                    : `Invoice for order #${order.orderNumber} ready to print`
                );
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              {order.status === 'cancelled' ? 'Cancelled invoice' : 'Download invoice'}
            </Button>
            <Link to="/account/support" state={{ from: 'order', orderId: order.id }} className="block">
              <Button variant="ghost" size="sm" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact support
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {showTrackModal && (
        <TrackPackageModal
          isOpen
          onClose={() => setShowTrackModal(false)}
          order={order}
        />
      )}

      {showCancelModal && (
        <CancelOrderModal
          isOpen
          onClose={() => setShowCancelModal(false)}
          order={order}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
}
