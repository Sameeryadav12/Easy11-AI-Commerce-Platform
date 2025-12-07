/**
 * Vendor Analytics Page
 * Sprint 7: Complete analytics dashboard with charts
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Activity,
  BarChart3,
  Target,
} from 'lucide-react';
import { useVendorStore } from '../../store/vendorStore';
import { useVendorProductStore } from '../../store/vendorProductStore';
import { useVendorAnalyticsStore } from '../../store/vendorAnalyticsStore';
import useVendorPricingStore from '../../store/vendorPricingStore';
import vendorAPI from '../../services/vendorAPI';
import governanceAPI from '../../services/governanceAPI';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '../../components/ui';

export default function VendorAnalyticsPage() {
  const { currentVendor, analytics, setAnalytics } = useVendorStore();
  const { products } = useVendorProductStore();
  const {
    fetchForecast,
    forecastByProduct,
    isForecastLoading,
  } = useVendorPricingStore((state) => ({
    fetchForecast: state.fetchForecast,
    forecastByProduct: state.forecastByProduct,
    isForecastLoading: state.isForecastLoading,
  }));
  const {
    modelCards,
    driftStatus,
    auditLog,
    setModelCards,
    setDriftStatus,
    setAuditLog,
  } = useVendorAnalyticsStore((state) => ({
    modelCards: state.modelCards,
    driftStatus: state.driftStatus,
    auditLog: state.auditLog,
    setModelCards: state.setModelCards,
    setDriftStatus: state.setDriftStatus,
    setAuditLog: state.setAuditLog,
  }));

  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [forecastProductId, setForecastProductId] = useState<string | null>(null);
  const [isGovernanceLoading, setGovernanceLoading] = useState(false);
  const [governanceError, setGovernanceError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  useEffect(() => {
    if (!forecastProductId && products.length > 0) {
      setForecastProductId(products[0].id);
    }
  }, [products, forecastProductId]);

  useEffect(() => {
    if (forecastProductId) {
      fetchForecast(forecastProductId, 30);
    }
  }, [forecastProductId, fetchForecast]);

  useEffect(() => {
    loadGovernance();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await vendorAPI.getVendorAnalytics(selectedPeriod);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadGovernance = async () => {
    setGovernanceLoading(true);
    setGovernanceError(null);
    try {
      const [cards, drift, audits] = await Promise.all([
        governanceAPI.fetchModelCards(),
        governanceAPI.fetchDriftStatus(),
        governanceAPI.fetchAuditLog(8),
      ]);
      setModelCards(cards);
      setDriftStatus(drift);
      setAuditLog(audits);
    } catch (error) {
      console.error('Failed to load governance data:', error);
      setGovernanceError('Unable to load governance data right now.');
    } finally {
      setGovernanceLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  const COLORS = ['#1A58D3', '#31EE88', '#FFD166', '#EF476F'];
  const selectedForecast = forecastProductId ? forecastByProduct[forecastProductId] : undefined;

  const forecastChartData = selectedForecast
    ? selectedForecast.forecast.map((point) => ({
        date: point.date,
        value: point.value,
        lower: point.lower_bound,
        upper: point.upper_bound,
      }))
    : [];

  return (
    <div className="container-custom py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header with Period Selector */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Analytics & Insights
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Track your performance and growth
            </p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            {(['7d', '30d', '90d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {period === '7d' ? 'Last 7 Days' : period === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Total Revenue',
              value: `$${analytics.revenue.total.toLocaleString()}`,
              change: `+${analytics.revenue.change_percent}%`,
              icon: DollarSign,
              color: 'text-green-500',
              bgColor: 'bg-green-100 dark:bg-green-900/30',
            },
            {
              label: 'Total Orders',
              value: analytics.orders.total.toString(),
              change: `+${analytics.orders.change_percent}%`,
              icon: ShoppingCart,
              color: 'text-blue-500',
              bgColor: 'bg-blue-100 dark:bg-blue-900/30',
            },
            {
              label: 'Avg Order Value',
              value: `$${analytics.orders.avg_order_value.toFixed(2)}`,
              change: '+5.2%',
              icon: TrendingUp,
              color: 'text-purple-500',
              bgColor: 'bg-purple-100 dark:bg-purple-900/30',
            },
            {
              label: 'Products Sold',
              value: analytics.products.total.toString(),
              change: `${analytics.products.active} active`,
              icon: Package,
              color: 'text-orange-500',
              bgColor: 'bg-orange-100 dark:bg-orange-900/30',
            },
          ].map((kpi, index) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${kpi.bgColor} rounded-xl flex items-center justify-center`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {kpi.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{kpi.label}</p>
              <p className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                {kpi.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6">
            Revenue Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.revenue.chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#1A58D3" 
                strokeWidth={3}
                name="Revenue ($)"
                dot={{ fill: '#1A58D3', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Anomaly Alerts */}
        {analytics.anomaly_alerts.length > 0 && (
          <div className="mb-8 space-y-3">
            {analytics.anomaly_alerts.map((alert, index) => (
              <div
                key={`${alert.metric}-${index}`}
                className={`flex items-start gap-3 rounded-2xl border p-4 ${
                  alert.severity === 'critical'
                    ? 'border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-900/20'
                    : alert.severity === 'warning'
                    ? 'border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/20'
                    : 'border-blue-200 bg-blue-50 dark:border-blue-900/40 dark:bg-blue-900/20'
                }`}
              >
                <div className="mt-0.5">
                  <AlertTriangle
                    className={`h-5 w-5 ${
                      alert.severity === 'critical'
                        ? 'text-rose-600 dark:text-rose-300'
                        : alert.severity === 'warning'
                        ? 'text-amber-600 dark:text-amber-200'
                        : 'text-blue-600 dark:text-blue-300'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {alert.metric} · {alert.severity.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-200">{alert.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Detected {new Date(alert.detected_at).toLocaleString()}
                    {alert.action && ` · Next step: ${alert.action}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Demand Forecast Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                Demand Forecast & Restock Guidance
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                AI-generated 30-day outlook with confidence bands and scenario planning.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">Product</label>
              <select
                value={forecastProductId ?? ''}
                onChange={(e) => setForecastProductId(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-blue-700 dark:text-blue-200">
              Add your first product to unlock demand forecasting insights.
            </div>
          ) : isForecastLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : selectedForecast ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={forecastChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Forecast" stroke="#1A58D3" strokeWidth={3} dot={false} />
                    <Line
                      type="monotone"
                      dataKey="upper"
                      name="Upper bound"
                      stroke="#31EE88"
                      strokeDasharray="5 5"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="lower"
                      name="Lower bound"
                      stroke="#EF476F"
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">AI Recommendation</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    Restock {selectedForecast.recommendation.recommended_restock_units} units
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Demand next 7 days: {selectedForecast.recommendation.demand_next_7d.toFixed(0)} units
                  </p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedForecast.recommendation.action}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Scenario outlook</p>
                  <div className="space-y-2">
                    {selectedForecast.scenarios.map((scenario) => (
                      <div
                        key={scenario.delta_pct}
                        className="flex items-center justify-between rounded-lg bg-white dark:bg-gray-800 px-3 py-2 border border-gray-200 dark:border-gray-700"
                      >
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {scenario.delta_pct >= 0 ? '+' : ''}
                          {scenario.delta_pct}%
                        </span>
                        <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                          <p>Demand {scenario.projected_demand.toFixed(0)}</p>
                          <p>Revenue index {scenario.revenue_index.toFixed(0)}</p>
                          <p>Inventory {scenario.inventory_risk}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-blue-700 dark:text-blue-200">
              Forecast data is warming up. Check back shortly for the latest projection.
            </div>
          )}
        </div>

        {/* Acquisition & Inventory */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Orders Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Orders Trend
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.orders.chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="value" fill="#31EE88" name="Orders" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Products Status */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Product Status
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Active', value: analytics.products.active },
                    { name: 'Out of Stock', value: analytics.products.out_of_stock },
                    { name: 'Low Stock', value: analytics.products.low_stock },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Channel Mix */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                Channel Performance
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.traffic_sources}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="channel" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="visits" fill="#1A58D3" name="Visits" radius={[6, 6, 0, 0]} />
                <Bar dataKey="conversions" fill="#31EE88" name="Conversions" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Retention & Experiments */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-purple-500" />
              <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                Retention Cohorts
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[360px] text-left text-sm text-gray-600 dark:text-gray-300">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3">Cohort</th>
                    <th className="py-3">Retention</th>
                    <th className="py-3">Δ vs prior</th>
                    <th className="py-3">LTV</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.retention.map((cohort) => (
                    <tr key={cohort.cohort} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                      <td className="py-3 font-medium text-gray-900 dark:text-white">{cohort.cohort}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-full bg-purple-500"
                              style={{ width: `${cohort.retention_rate * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">
                            {(cohort.retention_rate * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-sm">
                        <span
                          className={`font-semibold ${
                            cohort.change_vs_prior >= 0 ? 'text-emerald-500' : 'text-rose-500'
                          }`}
                        >
                          {cohort.change_vs_prior >= 0 ? '+' : ''}
                          {(cohort.change_vs_prior * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-gray-900 dark:text-white">
                        ${cohort.lifetime_value.toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-emerald-500" />
              <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                Experiment Lab
              </h2>
            </div>
            <div className="space-y-3">
              {analytics.experiment_summary.map((experiment) => (
                <div
                  key={experiment.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{experiment.name}</p>
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                        {experiment.primary_metric}
                      </p>
                    </div>
                    <Badge
                      variant={experiment.status === 'running' ? 'info' : experiment.status === 'completed' ? 'success' : 'warning'}
                      size="sm"
                      className="capitalize"
                    >
                      {experiment.status}
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <div>
                      Uplift:{' '}
                      <span className={experiment.uplift >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                        {experiment.uplift >= 0 ? '+' : ''}
                        {(experiment.uplift * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div>Significance: {(experiment.significance * 100).toFixed(0)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6">
            Performance Metrics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Fulfillment</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.performance.avg_fulfillment_time}h
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Target: 24h</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">On-Time Delivery</p>
              <p className="text-3xl font-bold text-green-500">
                {(analytics.performance.on_time_delivery_rate * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Target: 92%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cancellation Rate</p>
              <p className="text-3xl font-bold text-orange-500">
                {(analytics.performance.cancellation_rate * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Target: &lt; 5%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Return Rate</p>
              <p className="text-3xl font-bold text-red-500">
                {(analytics.performance.return_rate * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Target: &lt; 5%</p>
            </div>
          </div>
        </div>

        {/* AI Governance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                AI Governance & Monitoring
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Model cards, drift checks, and audit history for Easy11 intelligence.
              </p>
            </div>
          </div>

          {isGovernanceLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
            </div>
          ) : governanceError ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-300">
              {governanceError}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-4">
                {modelCards.map((card) => (
                  <div
                    key={card.model_id}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/40"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                          {card.model_id}
                        </p>
                        <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                          {card.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{card.description}</p>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
                        <p>Version {card.version}</p>
                        <p>Owner: {card.owner}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-200">Key Metrics</p>
                        <ul className="mt-1 space-y-1 text-gray-600 dark:text-gray-300">
                          {Object.entries(card.metrics).map(([metric, value]) => (
                            <li key={metric}>
                              {metric.replace(/_/g, ' ')}: <span className="font-semibold">{value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-200">Fairness & Guardrails</p>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">{card.fairness_considerations}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-200">Explainability</p>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                          SHAP updated {new Date(card.explainability_assets.last_regenerated_at).toLocaleDateString()}
                        </p>
                        <p className="mt-2 text-xs text-blue-500 dark:text-blue-300">
                          <a href={card.explainability_assets.global_shap_url} target="_blank" rel="noreferrer">
                            View global SHAP values
                          </a>
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {card.notes.map((note) => (
                        <span
                          key={note}
                          className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">Drift Monitors</h3>
                  </div>
                  <div className="space-y-3">
                    {driftStatus.map((status) => (
                      <div key={status.model_id} className="text-sm text-blue-900 dark:text-blue-200">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{status.model_id}</p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              status.status === 'healthy'
                                ? 'bg-emerald-100 text-emerald-700'
                                : status.status === 'warning'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {status.status.toUpperCase()}
                          </span>
                        </div>
                        <ul className="mt-1 space-y-1">
                          {status.monitored_features.map((feature) => (
                            <li key={feature.feature} className="flex items-center justify-between text-xs">
                              <span>{feature.feature}</span>
                              <span>{(feature.p_value * 100).toFixed(1)}% (p)</span>
                            </li>
                          ))}
                        </ul>
                        {status.recommended_actions && status.recommended_actions.length > 0 && (
                          <p className="mt-2 text-xs text-blue-900/80 dark:text-blue-200/80 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {status.recommended_actions[0]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Recent Audit Trail</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    {auditLog.slice(0, 6).map((entry, index) => (
                      <li
                        key={`${entry.timestamp}-${index}`}
                        className="border-b border-gray-200 dark:border-gray-800 pb-2 last:border-b-0 last:pb-0"
                      >
                        <p className="font-semibold">
                          {entry.model_id} · {entry.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(entry.timestamp).toLocaleString()} · {entry.actor}
                        </p>
                        <p className="text-xs">{entry.reason} ({entry.outcome})</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
}

