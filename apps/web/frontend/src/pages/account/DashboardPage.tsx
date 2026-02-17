import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  TrendingUp,
  RotateCcw,
  Gift,
  MessageSquare,
  ArrowRight,
  Clock,
  CheckCircle,
  Sparkles,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useOrdersStore } from '../../store/ordersStore';
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
  const { points, tier, tierProgress, getPointsToNextTier, summary } = useRewardsStore();
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
      // In a real app, load dashboard data from backend here.
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
  const mfaEnabled = Boolean(mfaStatus?.enabled);

  const returnEligibleCount = orders.filter((order) => {
    if (order.status !== 'delivered') return false;
    const deliveredAt = new Date(order.deliveredDate || order.date).getTime();
    if (Number.isNaN(deliveredAt)) return false;
    const days = (Date.now() - deliveredAt) / (1000 * 60 * 60 * 24);
    return days <= 30;
  }).length;

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

      {/* Status & Actions (customer-focused) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
              Status & actions
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              The most important things to do right now.
            </p>
          </div>
          <Link to="/account/support">
            <Button variant="secondary" size="sm" className="whitespace-nowrap">
              Support
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* Orders status */}
          <Link
            to="/account/orders"
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-11 h-11 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Orders
              </span>
            </div>
            <div className="mt-3">
              {pendingOrders.length > 0 ? (
                <>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {pendingOrders.length} active
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Latest status: {pendingOrders[0].status.replace('_', ' ')}
                  </div>
                </>
              ) : (
                <>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    No active orders
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> Start shopping anytime
                  </div>
                </>
              )}
            </div>
          </Link>

          {/* Returns eligibility */}
          <Link
            to="/account/returns"
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-11 h-11 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Returns
              </span>
            </div>
            <div className="mt-3">
              <div className="font-semibold text-gray-900 dark:text-white">
                {returnEligibleCount > 0 ? `${returnEligibleCount} eligible` : 'No eligible returns'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                30‑day return window
              </div>
            </div>
          </Link>

          {/* Security action */}
          <Link
            to={mfaEnabled ? '/account/security' : '/auth/mfa/enroll'}
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                <Shield
                  className={`w-5 h-5 ${
                    mfaEnabled ? 'text-green-600 dark:text-green-400' : 'text-yellow-700 dark:text-yellow-300'
                  }`}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Security
              </span>
            </div>
            <div className="mt-3">
              <div className="font-semibold text-gray-900 dark:text-white">
                {mfaEnabled ? 'MFA enabled' : 'Enable MFA'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {mfaEnabled ? 'Manage devices & sessions' : 'Recommended for account safety'}
              </div>
            </div>
          </Link>

          {/* Support shortcut */}
          <Link
            to="/account/support"
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-11 h-11 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Help
              </span>
            </div>
            <div className="mt-3">
              <div className="font-semibold text-gray-900 dark:text-white">
                Get support
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Create a ticket in 30 seconds
              </div>
            </div>
          </Link>
        </div>
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

        {/* Rewards Summary (kept small & secondary) */}
        <motion.div variants={itemVariants}>
          <Link to="/account/rewards" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Gift className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-bold">
                  {tier}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rewards</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {points.toLocaleString()} pts
                {summary.pendingPoints > 0 && (
                  <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({summary.pendingPoints.toLocaleString()} pending)
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {pointsToNext > 0
                  ? `${pointsToNext} to ${tier === 'Silver' ? 'Gold' : tier === 'Gold' ? 'Platinum' : tier === 'Platinum' ? 'Diamond' : 'next'}`
                  : 'Max tier reached'}
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${tierProgress}%` }}
                />
              </div>
              <div className="mt-4">
                <Button variant="secondary" size="sm" className="w-full">
                  View rewards
                </Button>
              </div>
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

