import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  TrendingUp,
  Gift,
  MessageSquare,
  ArrowRight,
  Clock,
  CheckCircle,
  Sparkles,
  Bell,
  MapPin,
  CreditCard,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useOrdersStore, generateMockOrders } from '../../store/ordersStore';
import { useRewardsStore } from '../../store/rewardsStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useAddressStore } from '../../store/addressStore';
import { usePaymentStore } from '../../store/paymentStore';
import { useMFAStore } from '../../store/mfaStore';
import dashboardAPI from '../../services/dashboardAPI';
import { Button } from '../../components/ui';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { orders, setOrders, getRecentOrders, getPendingOrders } = useOrdersStore();
  const { points, tier, tierProgress, getPointsToNextTier } = useRewardsStore();
  const { items: wishlistItems, getPriceDropAlerts } = useWishlistStore();
  const { unreadCount } = useNotificationStore();
  const { addresses } = useAddressStore();
  const { methods: paymentMethods } = usePaymentStore();
  const { status: mfaStatus } = useMFAStore();
  
  const [isLoading, setIsLoading] = useState(true);

  // Load all dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load orders if not already loaded
      if (orders.length === 0) {
        setOrders(generateMockOrders());
      }
      // In a real app, load other data here
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const recentOrders = getRecentOrders(3);
  const pendingOrders = getPendingOrders();
  const priceDropAlerts = getPriceDropAlerts();
  const pointsToNext = getPointsToNextTier();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div>
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-8 text-white mb-8 shadow-lg"
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="text-blue-100 text-lg">
          Your personalized shopping command center
        </p>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {/* Notifications Quick Action */}
        <motion.div variants={itemVariants}>
          <Link to="/account/notifications" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-500" />
                </div>
                {unreadCount > 0 && (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Notifications</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {unreadCount > 0 ? `${unreadCount} New` : 'All Read'}
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Addresses Quick Action */}
        <motion.div variants={itemVariants}>
          <Link to="/account/addresses" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-teal-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Addresses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {addresses.length} Saved
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Payments Quick Action */}
        <motion.div variants={itemVariants}>
          <Link to="/account/payments" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment Methods</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {paymentMethods.length} Cards
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Security Quick Action */}
        <motion.div variants={itemVariants}>
          <Link to="/account/security" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
                {mfaStatus && (
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    mfaStatus.is_enabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                  }`}>
                    {mfaStatus.is_enabled ? 'ON' : 'OFF'}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Security</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mfaStatus?.is_enabled ? 'Protected' : 'Basic'}
              </p>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Main Widgets Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {/* Recent Orders Widget */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                  Recent Orders
                </h2>
              </div>
              <Link
                to="/account/orders"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                View All →
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/account/orders/${order.id}`}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                        {order.items[0]?.image}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          Order #{order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''} • $
                          {order.total.toFixed(2)}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {order.status === 'delivered' ? (
                            <CheckCircle className="w-4 h-4 text-teal-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-blue-500" />
                          )}
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      Track
                    </Button>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No orders yet</p>
                <Link to="/products" className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2 inline-block">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Rewards Widget */}
        <motion.div variants={itemVariants}>
          <Link to="/account/rewards">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-md p-6 text-white hover:shadow-lg transition-shadow h-full">
              <div className="flex items-center justify-between mb-4">
                <Gift className="w-8 h-8" />
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                  {tier}
                </span>
              </div>
              <h3 className="text-2xl font-heading font-bold mb-2">
                {points.toLocaleString()} Points
              </h3>
              <p className="text-purple-100 text-sm mb-4">
                {pointsToNext > 0
                  ? `${pointsToNext} points to ${tier === 'Silver' ? 'Gold' : 'Platinum'}`
                  : 'Max tier reached!'}
              </p>
              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${tierProgress}%` }}
                />
              </div>
              <button className="text-white font-semibold text-sm flex items-center hover:underline">
                Redeem Points <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </Link>
        </motion.div>

        {/* AI Suggestions Widget */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                AI Picks for You
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: '1', name: 'Premium Headphones', price: 299.99, image: '🎧' },
                { id: '2', name: 'Smart Watch', price: 449.99, image: '⌚' },
                { id: '3', name: 'Laptop Stand', price: 39.99, image: '💻' },
                { id: '4', name: 'Wireless Mouse', price: 29.99, image: '🖱️' },
              ].map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="text-4xl mb-2 text-center">{product.image}</div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {product.name}
                  </p>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    ${product.price}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Support Status Widget */}
        <motion.div variants={itemVariants}>
          <Link to="/account/support">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow h-full">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                  Support
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Need help with an order or have a question?
              </p>
              <Button variant="secondary" size="sm" className="w-full">
                Get Help
              </Button>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Link
          to="/account/orders"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all group"
        >
          <Package className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
          <p className="font-semibold text-gray-900 dark:text-white mb-1">My Orders</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {pendingOrders.length} active
          </p>
        </Link>

        <Link
          to="/account/wishlist"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all group"
        >
          <div className="relative">
            <TrendingUp className="w-8 h-8 text-teal-600 dark:text-teal-400 mb-3" />
            {priceDropAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                {priceDropAlerts.length}
              </span>
            )}
          </div>
          <p className="font-semibold text-gray-900 dark:text-white mb-1">Wishlist</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {wishlistItems.length} items
          </p>
        </Link>

        <Link
          to="/account/returns"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all group"
        >
          <Package className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-3" />
          <p className="font-semibold text-gray-900 dark:text-white mb-1">Returns</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage returns</p>
        </Link>

        <Link
          to="/account/profile"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all group"
        >
          <Package className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
          <p className="font-semibold text-gray-900 dark:text-white mb-1">Profile</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Edit details</p>
        </Link>
      </motion.div>
    </div>
  );
}

