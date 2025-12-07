/**
 * Vendor Dashboard Overview
 * Sprint 7: Vendor Portal - Main dashboard with metrics
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  Star,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useVendorStore } from '../../store/vendorStore';
import { useVendorOrderStore } from '../../store/vendorOrderStore';
import vendorAPI from '../../services/vendorAPI';
import { Link } from 'react-router-dom';

export default function VendorDashboard() {
  const { currentVendor, analytics, setAnalytics } = useVendorStore();
  const { stats: orderStats } = useVendorOrderStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const analyticsData = await vendorAPI.getVendorAnalytics('30d');
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentVendor || !analytics) {
    return <div>No vendor data available</div>;
  }

  const metrics = [
    {
      label: 'Revenue (30d)',
      value: `$${analytics.revenue.total.toLocaleString()}`,
      change: `+${analytics.revenue.change_percent}%`,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Orders',
      value: analytics.orders.total.toString(),
      change: `+${analytics.orders.change_percent}%`,
      icon: ShoppingCart,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Products',
      value: analytics.products.total.toString(),
      change: `${analytics.products.active} active`,
      icon: Package,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      label: 'Avg Rating',
      value: currentVendor.metrics.avg_rating.toFixed(1),
      change: `${currentVendor.metrics.reviews_count} reviews`,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
  ];

  return (
    <div className="container-custom py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Vendor Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Welcome back, {currentVendor.business_name}!
          </p>
        </div>

        {/* KYC Alert */}
        {currentVendor.kyc_status !== 'approved' && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                  KYC Verification Required
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-3">
                  Complete your KYC verification to start selling on Easy11.
                </p>
                <Link
                  to="/vendor/kyc"
                  className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  Complete Verification
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {metric.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.label}</p>
              <p className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                {metric.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                Recent Orders
              </h2>
              <Link
                to="/vendor/orders"
                className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {orderStats.pending > 0 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {orderStats.pending} Pending Orders
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Requires your confirmation
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/vendor/orders?status=pending"
                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Review
                  </Link>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-blue-500">{orderStats.confirmed}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Confirmed</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-purple-500">{orderStats.shipped}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Shipped</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-green-500">{orderStats.delivered}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Delivered</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                Top Products
              </h2>
              <Link
                to="/vendor/products"
                className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {analytics.top_products.map((product) => (
                <div
                  key={product.product_id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {product.sales} sales
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      ${product.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6">
            Performance Metrics
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Fulfillment</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.performance.avg_fulfillment_time}h
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">On-Time Delivery</p>
              <p className="text-2xl font-bold text-green-500">
                {(analytics.performance.on_time_delivery_rate * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cancellation Rate</p>
              <p className="text-2xl font-bold text-orange-500">
                {(analytics.performance.cancellation_rate * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Return Rate</p>
              <p className="text-2xl font-bold text-red-500">
                {(analytics.performance.return_rate * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* AI Studio CTA */}
        <div className="mt-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-2xl shadow-xl p-6 border border-blue-800/40 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-heading font-bold">Launch campaigns in minutes</h2>
              <p className="text-blue-100/80 mt-2 max-w-2xl">
                Generate long-form copy, SEO metadata, and multichannel messaging with the new AI Marketing Studio.
                Ship email, SMS, and social variants that stay on brand automatically.
              </p>
            </div>
            <Link
              to="/vendor/marketing/ai"
              className="inline-flex items-center gap-2 px-4 py-3 bg-white text-blue-800 font-semibold rounded-lg shadow-sm hover:bg-blue-50 transition-colors"
            >
              Open AI Studio
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* Marketing Command Center CTA */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                Orchestrate your launch
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Track campaigns, attribution, and launch phases from the new Marketing Command Center.
              </p>
            </div>
            <Link
              to="/vendor/marketing/launch"
              className="inline-flex items-center gap-2 rounded-lg border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-900/20"
            >
              Open command center
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* Growth Ops CTA */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                Run growth experiments
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Monitor referral loops, experiments, and feedback from the Growth Ops command center.
              </p>
            </div>
            <Link
              to="/vendor/growth"
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
            >
              Open growth ops
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* Mobile Ops CTA */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                Align mobile ecosystem
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Track feature parity, offline sync, and release readiness inside the Mobile Ops hub.
              </p>
            </div>
            <Link
              to="/vendor/mobile"
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-500 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-900/20"
            >
              Open mobile ops
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

