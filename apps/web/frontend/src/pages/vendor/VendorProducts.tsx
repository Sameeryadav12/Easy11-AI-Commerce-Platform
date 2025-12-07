/**
 * Vendor Products Management Page
 * Sprint 7: Product catalog management with filters & bulk actions
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit2, Trash2, Eye, EyeOff, Package, Image as ImageIcon } from 'lucide-react';
import { useVendorProductStore } from '../../store/vendorProductStore';
import { useVendorStore } from '../../store/vendorStore';
import useVendorPricingStore from '../../store/vendorPricingStore';
import vendorAPI from '../../services/vendorAPI';
import { Button } from '../../components/ui';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import type { VendorProduct } from '../../types/vendor';

export default function VendorProducts() {
  const { products, filters, setProducts, deleteProduct: deleteFromStore, setFilters, updateProduct } = useVendorProductStore();
  const { currentVendor } = useVendorStore();
  const {
    recommendations,
    isLoading: isPricingLoading,
    error: pricingError,
    lastUpdated: pricingLastUpdated,
    fetchRecommendations,
  } = useVendorPricingStore((state) => ({
    recommendations: state.recommendations,
    isLoading: state.isLoading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    fetchRecommendations: state.fetchRecommendations,
  }));

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (!products.length) return;
    fetchRecommendations(products, currentVendor?.id ?? undefined, 'balanced');
  }, [products, currentVendor?.id, fetchRecommendations]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await vendorAPI.getVendorProducts(filters);
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm });
    loadProducts();
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setFilters({ ...filters, status: status === 'all' ? undefined : status });
    loadProducts();
  };

  const handleToggleVisibility = async (product: VendorProduct) => {
    try {
      const newVisibility = product.visibility === 'public' ? 'hidden' : 'public';
      await vendorAPI.updateVendorProduct(product.id, { visibility: newVisibility });
      updateProduct(product.id, { visibility: newVisibility });
      toast.success(`Product ${newVisibility === 'public' ? 'shown' : 'hidden'}`);
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await vendorAPI.deleteVendorProduct(id);
      deleteFromStore(id);
      toast.success('Product deleted successfully');
      setDeleteTarget(null);
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === 'active').length,
    draft: products.filter((p) => p.status === 'draft').length,
    outOfStock: products.filter((p) => p.status === 'out_of_stock').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Products
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your product catalog
            </p>
          </div>
          <Link to="/vendor/products/new">
            <Button variant="primary" className="flex items-center gap-2 mt-4 md:mt-0">
              <Plus className="w-5 h-5" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Pricing Recommendations */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white rounded-2xl shadow-xl p-6 mb-8 border border-blue-800/40">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-200 mb-2">AI Pricing Copilot</p>
              <h2 className="text-2xl font-heading font-bold">Smart Pricing Opportunities</h2>
              <p className="text-blue-200/80 max-w-2xl mt-2">
                Dynamic recommendations tuned to your conversion performance, stock velocity, and return signals.
              </p>
            </div>
            <div className="text-sm text-blue-200/80">
              {pricingLastUpdated ? (
                <span>Updated {new Date(pricingLastUpdated).toLocaleTimeString()}</span>
              ) : (
                <span>Calculating…</span>
              )}
            </div>
          </div>

          {pricingError && (
            <div className="bg-white/10 border border-red-400/40 text-red-100 rounded-xl p-4 mb-4">
              {pricingError} We&apos;ll use default merchandising rules until the pricing engine is back.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {(isPricingLoading && recommendations.length === 0
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={`pricing-skeleton-${idx}`}
                    className="animate-pulse bg-white/5 border border-white/10 rounded-xl p-5 space-y-4"
                  >
                    <div className="h-4 bg-white/10 rounded w-1/3" />
                    <div className="h-6 bg-white/10 rounded w-2/3" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                    <div className="h-3 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/10 rounded w-1/3" />
                  </div>
                ))
              : recommendations.slice(0, 6).map((rec) => (
                  <div
                    key={rec.product_id}
                    className="bg-white/10 border border-white/20 rounded-2xl p-5 flex flex-col justify-between hover:border-teal-200/60 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold">{products.find((p) => p.id === rec.product_id)?.name ?? 'Product'}</h3>
                      <span className="text-xs bg-teal-400/20 text-teal-100 px-2 py-1 rounded-full font-semibold">
                        {rec.strategy.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-200/80">Recommended price</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat(undefined, { style: 'currency', currency: rec.currency }).format(
                            rec.recommended_price
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-200/80">Adjustment</span>
                        <span className={rec.suggested_adjustment_pct >= 0 ? 'text-emerald-300 font-semibold' : 'text-amber-300 font-semibold'}>
                          {rec.suggested_adjustment_pct >= 0 ? '+' : ''}
                          {rec.suggested_adjustment_pct}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-200/80">Revenue impact</span>
                        <span className={rec.expected_revenue_change_pct >= 0 ? 'text-emerald-300 font-semibold' : 'text-amber-300 font-semibold'}>
                          {rec.expected_revenue_change_pct >= 0 ? '+' : ''}
                          {rec.expected_revenue_change_pct}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-blue-200/70">
                        <span>Confidence</span>
                        <span>{Math.round(rec.confidence * 100)}%</span>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-blue-100/80 leading-relaxed">
                      {rec.explanation}
                    </div>
                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-widest text-blue-200/70 mb-1">Suggested action</p>
                      <p className="text-sm text-blue-100/90">
                        {rec.recommended_actions[0]}
                      </p>
                    </div>
                  </div>
                )))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'text-gray-600' },
            { label: 'Active', value: stats.active, color: 'text-green-600' },
            { label: 'Draft', value: stats.draft, color: 'text-yellow-600' },
            { label: 'Out of Stock', value: stats.outOfStock, color: 'text-red-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color} dark:opacity-90`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
              />
              <Button onClick={handleSearch} variant="primary">
                <Search className="w-5 h-5" />
              </Button>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto">
              {['all', 'active', 'draft', 'out_of_stock'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedStatus === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No products found</p>
            <Link to="/vendor/products/new">
              <Button variant="primary">Add Your First Product</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : product.status === 'draft'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      }`}
                    >
                      {product.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Visibility Toggle */}
                  <button
                    onClick={() => handleToggleVisibility(product)}
                    className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title={product.visibility === 'public' ? 'Hide product' : 'Show product'}
                  >
                    {product.visibility === 'public' ? (
                      <Eye className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-heading font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${product.price.toFixed(2)}
                      </p>
                      {product.compare_at_price && (
                        <p className="text-sm text-gray-500 line-through">
                          ${product.compare_at_price.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Stock</p>
                      <p className={`font-bold ${product.stock_quantity < product.low_stock_threshold ? 'text-red-500' : 'text-green-500'}`}>
                        {product.stock_quantity}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                      <p className="text-gray-600 dark:text-gray-400">Views</p>
                      <p className="font-bold text-gray-900 dark:text-white">{product.views_count}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                      <p className="text-gray-600 dark:text-gray-400">Sales</p>
                      <p className="font-bold text-gray-900 dark:text-white">{product.sales_count}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                      <p className="text-gray-600 dark:text-gray-400">Rating</p>
                      <p className="font-bold text-gray-900 dark:text-white">{product.avg_rating.toFixed(1)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link to={`/vendor/products/${product.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(product.id)}
                      className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setDeleteTarget(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                  Delete Product?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete this product? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setDeleteTarget(null)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleDelete(deleteTarget)}
                    className="flex-1 bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

