import { useState } from 'react';
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
  trackingNumber: string;
  status: 'processing' | 'shipped' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'exception';
  estimatedDelivery: string;
  carrier: string;
  address: string;
  events: TrackingEvent[];
}

// Mock tracking data for demonstration
const mockTrackingData: Record<string, OrderTracking> = {
  'ORD-12345': {
    orderNumber: 'ORD-12345',
    trackingNumber: 'TRK-987654321',
    status: 'in-transit',
    estimatedDelivery: '2025-01-20',
    carrier: 'FedEx',
    address: '123 Main St, San Francisco, CA 94105',
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
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingData, setTrackingData] = useState<OrderTracking | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingInput.trim()) {
      toast.error('Please enter an order number or tracking number');
      return;
    }

    setIsSearching(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if we have mock data for this order
    const found = Object.values(mockTrackingData).find(
      (order) =>
        order.orderNumber.toLowerCase() === trackingInput.toLowerCase() ||
        order.trackingNumber.toLowerCase() === trackingInput.toLowerCase()
    );

    if (found) {
      setTrackingData(found);
      toast.success('Order found!');
    } else {
      toast.error('Order not found. Please check your order number or tracking number.');
      setTrackingData(null);
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
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter order number or tracking number"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  leftIcon={<Search className="w-5 h-5" />}
                  className="w-full"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSearching}
                className="whitespace-nowrap"
              >
                {isSearching ? 'Tracking...' : 'Track Order'}
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              <strong>Demo:</strong> Try tracking order <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">ORD-12345</code>
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
            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                    Order {trackingData.orderNumber}
                  </h2>
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
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{trackingData.address}</p>
                  </div>
                </div>
              </div>
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
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Contact Support
                    </a>
                    <a
                      href="/faq"
                      className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      View FAQ
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* No Results State */}
        {!trackingData && !isSearching && (
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

