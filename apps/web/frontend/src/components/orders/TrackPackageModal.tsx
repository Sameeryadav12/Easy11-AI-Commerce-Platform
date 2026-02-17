/**
 * Track Package Modal - Amazon/eBay-style shipping tracking
 * Shows: status timeline, estimated delivery, carrier/tracking, events, actions
 */

import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  Package,
  MapPin,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { Modal, Button } from '../ui';
import type { Order } from '../../store/ordersStore';
import toast from 'react-hot-toast';

const TIMELINE_STEPS: { key: Order['status']; label: string }[] = [
  { key: 'pending', label: 'Ordered' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for delivery' },
  { key: 'delivered', label: 'Delivered' },
];

function getStepIndex(status: Order['status']): number {
  const idx = TIMELINE_STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

// Generate mock tracking events based on order status
function getTrackingEvents(order: Order): { date: string; status: string; location: string; description: string }[] {
  const events: { date: string; status: string; location: string; description: string }[] = [];
  const orderDate = new Date(order.date);

  events.push({
    date: orderDate.toISOString(),
    status: 'Order placed',
    location: 'Online',
    description: 'Your order was placed.',
  });

  if (['confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'].includes(order.status)) {
    events.push({
      date: new Date(orderDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      status: 'Order confirmed',
      location: 'Easy11 Warehouse',
      description: 'Payment confirmed. Preparing your order.',
    });
  }

  if (['packed', 'shipped', 'out_for_delivery', 'delivered'].includes(order.status)) {
    events.push({
      date: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'Packed',
      location: 'Easy11 Warehouse',
      description: 'Order packed and ready for dispatch.',
    });
  }

  if (['shipped', 'out_for_delivery', 'delivered'].includes(order.status)) {
    events.push({
      date: new Date(orderDate.getTime() + 36 * 60 * 60 * 1000).toISOString(),
      status: 'Shipped',
      location: 'Distribution Center',
      description: 'Picked up by carrier. In transit.',
    });
  }

  if (['out_for_delivery', 'delivered'].includes(order.status)) {
    events.push({
      date: new Date(orderDate.getTime() + 72 * 60 * 60 * 1000).toISOString(),
      status: 'Out for delivery',
      location: order.shippingAddress.city,
      description: 'Package is on the way to you.',
    });
  }

  if (order.status === 'delivered' && order.deliveredDate) {
    events.push({
      date: order.deliveredDate,
      status: 'Delivered',
      location: order.shippingAddress.address,
      description: 'Package delivered successfully.',
    });
  }

  return events.reverse(); // Most recent first
}

interface TrackPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  /** Shipment index when order has multiple shipments (1-based) */
  shipmentIndex?: number;
  /** Total shipments when order has multiple */
  totalShipments?: number;
}

export default function TrackPackageModal({
  isOpen,
  onClose,
  order,
  shipmentIndex = 1,
  totalShipments = 1,
}: TrackPackageModalProps) {
  const [copied, setCopied] = useState(false);
  const trackingNumber = order.trackingNumber || `1Z${order.orderNumber.replace(/-/g, '').slice(-12)}${Date.now().toString(36).toUpperCase().slice(-4)}`;
  const carrier = order.carrier || 'Australia Post';
  const estimatedDelivery = order.estimatedDelivery || (order.status === 'delivered' ? order.deliveredDate : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString());
  const lastUpdate = getTrackingEvents(order)[0];
  const events = getTrackingEvents(order);
  const currentStepIdx = getStepIndex(order.status);

  const handleCopyTracking = useCallback(() => {
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    toast.success('Tracking number copied');
    setTimeout(() => setCopied(false), 2000);
  }, [trackingNumber]);

  const carrierTrackingUrl = carrier === 'Australia Post'
    ? `https://auspost.com.au/mypost/track/#/details/${trackingNumber}`
    : carrier === 'UPS'
      ? `https://www.ups.com/track?tracknum=${trackingNumber}`
      : `https://www.google.com/search?q=track+${trackingNumber}`;

  // Mask street for privacy: show suburb/postcode only
  const deliveryDestination = `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Track Package" size="xl" closeOnOverlayClick>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-1">
            Order #{order.orderNumber}
          </h2>
          {totalShipments > 1 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Shipment {shipmentIndex} of {totalShipments}
            </p>
          )}
        </div>

        {/* Estimated delivery + last update */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="font-semibold text-gray-900 dark:text-white">
            {order.status === 'delivered'
              ? `Delivered ${estimatedDelivery ? new Date(estimatedDelivery).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''}`
              : `Arriving ${estimatedDelivery ? new Date(estimatedDelivery).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Soon'} • 2–5pm`}
          </p>
          {lastUpdate && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Last updated {new Date(lastUpdate.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          )}
        </div>

        {/* Status timeline — current step highlighted, past steps slightly dimmed */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Shipment status</h3>
          <div className="flex items-start justify-between gap-1 overflow-x-auto pt-4 pb-2">
            {TIMELINE_STEPS.map((step, idx) => {
              const isComplete = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const isPast = idx < currentStepIdx;
              return (
                <div
                  key={step.key}
                  className={`flex flex-col items-center shrink-0 min-w-[60px] transition-opacity ${
                    isCurrent ? '' : isPast ? 'opacity-70' : 'opacity-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCurrent
                        ? 'bg-teal-600 text-white ring-4 ring-teal-300 dark:ring-teal-700 scale-110 shadow-lg'
                        : isComplete
                          ? 'bg-teal-400 dark:bg-teal-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-500'
                    }`}
                  >
                    {isComplete ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-xs mt-2 text-center ${
                      isCurrent
                        ? 'text-gray-900 dark:text-white font-bold'
                        : isComplete
                          ? 'text-gray-700 dark:text-gray-300 font-medium'
                          : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carrier + tracking (copyable) — optional carrier branding */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {carrier === 'Australia Post' && (
                <img
                  src="/carriers/auspost.svg"
                  alt="Australia Post"
                  className="w-12 h-8 object-contain"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-white">Carrier:</span> {carrier}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span className="font-medium text-gray-900 dark:text-white">Tracking:</span>{' '}
                  <code className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded font-mono text-sm">{trackingNumber}</code>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopyTracking}>
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <a href={carrierTrackingUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open carrier tracking
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Tracking events (scan history) — ETA repeated for reassurance */}
        <div>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Tracking history</h3>
            {order.status !== 'delivered' && estimatedDelivery && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Est. delivery: {new Date(estimatedDelivery).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} (2–5 PM)
              </p>
            )}
          </div>
          <ul className="space-y-3">
            {events.map((event, idx) => (
              <li key={idx} className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-teal-500 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{event.status}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                    {new Date(event.date).toLocaleString('en-US')} • {event.location}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Delivery destination */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Delivery destination
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">{order.shippingAddress.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{deliveryDestination}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Street address hidden for privacy
          </p>
        </div>

        {/* Proof of delivery (if delivered) */}
        {order.status === 'delivered' && order.deliveredDate && (
          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Delivered at {new Date(order.deliveredDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
            </div>
            <p className="text-sm text-teal-600 dark:text-teal-400 mt-1">Package was delivered successfully.</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          {order.status !== 'delivered' && (
            <>
              <a href={carrierTrackingUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open carrier tracking
                </Button>
              </a>
              <Link to="/contact" state={{ from: 'tracking', orderId: order.id }}>
                <Button variant="secondary" size="sm" onClick={onClose}>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Report an issue
                </Button>
              </Link>
            </>
          )}
          {order.status === 'delivered' && (
            <Link to="/contact" state={{ from: 'tracking', orderId: order.id }}>
              <Button variant="secondary" size="sm" onClick={onClose}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Problem with delivery?
              </Button>
            </Link>
          )}
          <Link to="/contact">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact support
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
}
