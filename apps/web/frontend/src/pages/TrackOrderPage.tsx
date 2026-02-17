import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useOrdersStore } from '../store/ordersStore';
import { motion } from 'framer-motion';
import { Package, Search, MapPin, Clock, CheckCircle, Truck, AlertCircle, Calendar } from 'lucide-react';
import { Button, Input } from '../components/ui';
import toast from 'react-hot-toast';

/**
 * Track Order Page
 * 
 * Allows users to track their orders by order number or tracking number.
 * Features:
 * - Order lookup by number
 * - Real-time tracking status
 * - Delivery timeline
 * - Estimated delivery date
 * - Delivery address
 */
interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

interface OrderTracking {
  orderNumber: string;
  orderDate: string;
  trackingNumber: string;
  status: 'processing' | 'shipped' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'exception';
  estimatedDelivery: string;
  carrier: string;
  address: string;
  items: { name: string; quantity: number }[];
  events: TrackingEvent[];
}

// Mock tracking data for demonstration
const mockTrackingData: Record<string, OrderTracking> = {
  'ORD-12345': {
    orderNumber: 'ORD-12345',
    orderDate: '2025-01-15T10:00:00',
    trackingNumber: 'TRK-987654321',
    status: 'in-transit',
    estimatedDelivery: '2025-01-20',
    carrier: 'FedEx',
    address: '123 Main St, San Francisco, CA 94105',
    items: [{ name: 'Wireless Headphones Pro', quantity: 1 }, { name: 'USB-C Cable 6ft', quantity: 2 }],
    events: [
      {
        id: '1',
        status: 'Order Placed',
        location: 'San Francisco, CA',
        timestamp: '2025-01-15T10:00:00',
        description: 'Your order has been placed',
        completed: true,
      },
      {
        id: '2',
        status: 'Processing',
        location: 'San Francisco, CA',
        timestamp: '2025-01-15T14:30:00',
        description: 'Your order is being prepared',
        completed: true,
      },
      {
        id: '3',
        status: 'Shipped',
        location: 'San Francisco, CA',
        timestamp: '2025-01-16T09:15:00',
        description: 'Your order has shipped',
        completed: true,
      },
      {
        id: '4',
        status: 'In Transit',
        location: 'Oakland, CA',
        timestamp: '2025-01-17T11:20:00',
        description: 'Package is in transit to destination',
        completed: true,
      },
      {
        id: '5',
        status: 'Out for Delivery',
        location: 'San Francisco, CA',
        timestamp: '2025-01-20T08:00:00',
        description: 'Package is out for delivery',
        completed: false,
      },
      {
        id: '6',
        status: 'Delivered',
        location: 'San Francisco, CA',
        timestamp: '',
        description: 'Package delivered',
        completed: false,
      },
    ],
  },
};

export default function TrackOrderPage() {
  const user = useAuthStore((s) => s.user);
  const recentOrders = useOrdersStore((s) => s.getRecentOrders(5));
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get('from');
  const orderParam = searchParams.get('order') || '';
  const fromSupport = fromParam === 'support' || fromParam === 'account-support';
  const supportBackUrl = fromParam === 'account-support' ? '/account/support' : '/support';
  const [trackingInput, setTrackingInput] = useState(orderParam);
  const [trackingData, setTrackingData] = useState<OrderTracking | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [emptyError, setEmptyError] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingInput.trim()) {
      setEmptyError(true);
      toast.error('Please enter a valid order or tracking number.');
      return;
    }
    setEmptyError(false);

    setIsSearching(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if we have mock data for this order
    const found = Object.values(mockTrackingData).find(
      (order) =>
        order.orderNumber.toLowerCase() === trackingInput.toLowerCase() ||
        order.trackingNumber.toLowerCase() === trackingInput.toLowerCase()
    );

    setSearchAttempted(true);
    if (found) {
      setTrackingData(found);
      toast.success('Order found!');
    } else {
      setTrackingData(null);
      toast.error('Order not found. Please check your order number or tracking number.');
    }

    setIsSearching(false);
  };

  const getStatusColor = (status: OrderTracking['status']) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'out-for-delivery':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'in-transit':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
      case 'shipped':
        return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30';
      case 'processing':
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
      case 'exception':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusIcon = (status: OrderTracking['status']) => {
    switch (status) {
      case 'delivered':
        return CheckCircle;
      case 'out-for-delivery':
      case 'in-transit':
        return Truck;
      case 'shipped':
        return Package;
      case 'processing':
        return Clock;
      case 'exception':
        return AlertCircle;
      default:
        return Package;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="container-custom pt-4 pb-0">
        <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
          <span aria-hidden>/</span>
          <Link to="/support" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Support</Link>
          <span aria-hidden>/</span>
          <span className="font-medium text-gray-900 dark:text-white">Track Order</span>
        </nav>
      </div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Package className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Track Your Order
            </h1>
            <p className="text-blue-100 text-lg">
              Enter your order number or tracking number to see the latest status and delivery updates.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <form onSubmit={handleTrack} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {user && recentOrders.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent orders</label>
                <div className="flex flex-wrap gap-2">
                  {recentOrders.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setTrackingInput(o.orderNumber)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      {o.orderNumber}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter order number or tracking number"
                  value={trackingInput}
                  onChange={(e) => {
                    setTrackingInput(e.target.value);
                    if (emptyError) setEmptyError(false);
                  }}
                  leftIcon={<Search className="w-5 h-5" />}
                  className="w-full"
                />
                {emptyError && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2" role="alert">
                    Please enter a valid order or tracking number.
                  </p>
                )}
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSearching}
                loadingLabel="Tracking..."
                className="whitespace-nowrap"
              >
                Track Order
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Example order number: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">ORD-12345</code>
            </p>
          </form>
        </motion.div>

        {/* Tracking Results */}
        {trackingData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Order Status Stepper - Amazon-style visual timeline */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-4">Order Status</h3>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 overflow-x-auto pb-2">
                {['processing', 'shipped', 'in-transit', 'out-for-delivery', 'delivered'].map((s, i) => {
                  const statusOrder = ['processing', 'shipped', 'in-transit', 'out-for-delivery', 'delivered'];
                  const idx = statusOrder.indexOf(trackingData.status);
                  const isCompleted = i < idx;
                  const isCurrent = i === idx;
                  const label = s.replace(/-/g, ' ');
                  return (
                    <div key={s} className="flex items-center gap-1 sm:gap-2">
                      <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg whitespace-nowrap ${isCompleted ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : isCurrent ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : isCurrent ? <Truck className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                        <span className="capitalize text-sm">{label}</span>
                      </div>
                      {i < 4 && <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">→</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                    Order {trackingData.orderNumber}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Order date: {trackingData.orderDate ? new Date(trackingData.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tracking: <span className="font-mono">{trackingData.trackingNumber}</span>
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg ${getStatusColor(trackingData.status)}`}>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const StatusIcon = getStatusIcon(trackingData.status);
                      return <StatusIcon className="w-5 h-5" />;
                    })()}
                    <span className="font-semibold capitalize">{trackingData.status.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Delivery</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(trackingData.estimatedDelivery).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Carrier</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{trackingData.carrier}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Address</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {trackingData.address.replace(/^(\d+)\s+(\w+)/, (_, n, s) => `${n} ${s[0]}***`)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Ordered */}
              {trackingData.items && trackingData.items.length > 0 && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Items in this order</p>
                  <ul className="space-y-1">
                    {trackingData.items.map((item, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex justify-between">
                        <span>{item.name}</span>
                        <span className="font-medium">×{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                Tracking History
              </h3>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                {/* Timeline Events */}
                <div className="space-y-6">
                  {trackingData.events.map((event, index) => (
                    <div key={event.id} className="relative flex gap-4">
                      {/* Timeline Dot */}
                      <div className="relative z-10 flex-shrink-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            event.completed
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {event.completed ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-current" />
                          )}
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="flex-1 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {event.status}
                          </h4>
                          {event.timestamp && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(event.timestamp).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {event.description}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Need Help?
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    If your order is delayed or you have questions about delivery, please contact our support team.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/contact?from=track-order"
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Contact Support
                    </Link>
                    <Link
                      to="/faq?from=track-order"
                      className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      View FAQ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error State - Order not found */}
        {searchAttempted && !trackingData && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-heading font-bold text-red-800 dark:text-red-300 mb-2">
                Order not found
              </h3>
              <p className="text-red-700 dark:text-red-400 text-sm mb-4">
                We couldn't find an order matching "{trackingInput}". Please check the order number or tracking number and try again.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Make sure you're using the format shown in your confirmation email (e.g. ORD-12345).
              </p>
            </div>
          </motion.div>
        )}

        {/* No Results State - Initial view (no search yet) */}
        {!trackingData && !isSearching && !searchAttempted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto text-center py-12"
          >
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">
              Track Your Order
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Enter your order number or tracking number above to see the latest status and delivery updates.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Where to find your order number:
              </h4>
              <ul className="text-left text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Check your order confirmation email</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Log into your account and visit "Orders"</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Look for the tracking number in shipping notifications</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

