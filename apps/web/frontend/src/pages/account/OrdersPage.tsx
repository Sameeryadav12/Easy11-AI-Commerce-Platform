import { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { useOrdersStore, generateMockOrders, Order } from '../../store/ordersStore';
import { Button } from '../../components/ui';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const { orders, setOrders } = useOrdersStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Load mock orders
  useEffect(() => {
    if (orders.length === 0) {
      setOrders(generateMockOrders());
    }
  }, []);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
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

  const handleDownloadInvoice = (order: Order) => {
    toast.success(`Downloading invoice for order #${order.orderNumber}`);
  };

  const handleTrackOrder = (order: Order) => {
    toast.success(`Tracking order #${order.orderNumber}`);
  };

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
            { label: 'In Transit', value: 'shipped' },
            { label: 'Packed', value: 'packed' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Returned', value: 'returned' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value as any)}
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

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
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
                      <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-1">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Placed on {new Date(order.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
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
                      {order.onTimeProbability && order.status === 'shipped' && (
                        <p className="text-xs text-teal-600 dark:text-teal-400">
                          ✓ {order.onTimeProbability}% on-time
                        </p>
                      )}
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
                                      Qty: {item.quantity} • {item.category}
                                    </p>
                                  </div>
                                </div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  ${item.price.toFixed(2)}
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
                              <p className="font-medium">{order.shippingAddress.name}</p>
                              <p>{order.shippingAddress.address}</p>
                              <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                {order.shippingAddress.zipCode}
                              </p>
                              <p>{order.shippingAddress.country}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                              <CreditCard className="w-4 h-4 mr-2" />
                              Payment Method
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                              <p>{order.paymentMethod}</p>
                              <p className="mt-2 font-medium">Order Total: ${order.total.toFixed(2)}</p>
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

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleTrackOrder(order)}
                          >
                            <Truck className="w-4 h-4 mr-2" />
                            Track Package
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDownloadInvoice(order)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Invoice
                          </Button>
                          {order.status === 'delivered' && (
                            <Link to={`/account/returns?order=${order.id}`}>
                              <Button variant="ghost" size="sm">
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Return Item
                              </Button>
                            </Link>
                          )}
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Contact Support
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center"
        >
          <Package className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            No orders found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : "You haven't placed any orders yet"}
          </p>
          <Link to="/products">
            <Button variant="primary">Start Shopping</Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}

