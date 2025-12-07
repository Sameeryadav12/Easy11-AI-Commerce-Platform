import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Search as SearchIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Loading } from '../components/ui';
import Breadcrumb from '../components/products/Breadcrumb';
import CategoryBanner from '../components/products/CategoryBanner';
import FilterSidebar, { ProductFilters } from '../components/products/FilterSidebar';
import SortingBar, { SortOption, ViewMode } from '../components/products/SortingBar';
import ProductCard, { Product } from '../components/products/ProductCard';
import QuickViewModal from '../components/products/QuickViewModal';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import usePersonalizationStore from '../store/personalizationStore';

/**
 * Products Listing Page
 * 
 * Main shop page with filters, sorting, and AI-powered product discovery.
 * Features:
 * - Dynamic category filtering
 * - AI-powered smart sort
 * - Quick view modal
 * - Infinite scroll
 * - Responsive grid/list views
 */
export const ProductsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { rerankProducts, rerankResult, error: personalizationError } = usePersonalizationStore(
    (state) => ({
      rerankProducts: state.rerankProducts,
      rerankResult: state.rerankResult,
      error: state.error,
    }),
  );

  const sessionId = useMemo(() => {
    const existing = sessionStorage.getItem('easy11-session-id');
    if (existing) return existing;
    const generated = `sess_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem('easy11-session-id', generated);
    return generated;
  }, []);

  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const saleType = searchParams.get('sale');
  const isNew = searchParams.get('new');
  const isFeatured = searchParams.get('featured');
  const searchQuery = searchParams.get('search') || '';

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [aiSortEnabled, setAiSortEnabled] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    priceRange: [0, 2000],
    brands: [],
    minRating: 0,
    inStockOnly: false,
    onSaleOnly: false,
    aiRecommended: false,
    deliverySpeed: [],
    colors: [],
    sizes: [],
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [personalizedIds, setPersonalizedIds] = useState<string[] | null>(null);

  // Sample products (will be fetched from API)
  const allProducts: Product[] = [
    { id: '1', name: 'Wireless Headphones Pro Max', price: 299.99, originalPrice: 399.99, rating: 4.8, reviews: 1234, image: '🎧', category: 'Electronics', stock: 100, badge: 'Best Seller', isAiRecommended: true, isTrending: true },
    { id: '2', name: 'Smart Watch Ultra', price: 599.99, rating: 4.9, reviews: 892, image: '⌚', category: 'Electronics', stock: 50, badge: 'New Arrival', isNew: true },
    { id: '3', name: 'Designer Backpack Premium', price: 129.99, originalPrice: 179.99, rating: 4.7, reviews: 2103, image: '🎒', category: 'Accessories', stock: 8, isTrending: true },
    { id: '4', name: 'Premium Bluetooth Speaker', price: 449.99, rating: 4.6, reviews: 567, image: '🔊', category: 'Electronics', stock: 75, isAiRecommended: true },
    { id: '5', name: 'Laptop Pro 15" MacBook Style', price: 1299.99, rating: 4.9, reviews: 745, image: '💻', category: 'Electronics', stock: 30, badge: 'Editor\'s Choice' },
    { id: '6', name: 'Fitness Tracker Band', price: 89.99, originalPrice: 129.99, rating: 4.5, reviews: 1891, image: '📊', category: 'Fitness', stock: 200 },
    { id: '7', name: 'Wireless Gaming Mouse RGB', price: 79.99, rating: 4.7, reviews: 3210, image: '🖱️', category: 'Electronics', stock: 150, isTrending: true },
    { id: '8', name: 'Premium Phone Case Leather', price: 34.99, rating: 4.6, reviews: 5432, image: '📱', category: 'Accessories', stock: 300 },
    { id: '9', name: 'Wireless Keyboard Mechanical', price: 149.99, rating: 4.8, reviews: 987, image: '⌨️', category: 'Electronics', stock: 60, isAiRecommended: true },
    { id: '10', name: 'Smart Home Camera 4K', price: 199.99, originalPrice: 249.99, rating: 4.7, reviews: 654, image: '📷', category: 'Electronics', stock: 45, badge: 'Hot Deal' },
    { id: '11', name: 'Running Shoes Pro Elite', price: 159.99, rating: 4.9, reviews: 2345, image: '👟', category: 'Clothing', stock: 120, isNew: true },
    { id: '12', name: 'Sunglasses Polarized UV400', price: 89.99, rating: 4.5, reviews: 876, image: '🕶️', category: 'Accessories', stock: 95 },
  ];

  // Filter products
  let filteredProducts = allProducts.filter((product) => {
    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const productName = product.name.toLowerCase();
      const productCategory = product.category.toLowerCase();
      const productBadge = product.badge?.toLowerCase() || '';
      
      if (!productName.includes(query) && 
          !productCategory.includes(query) && 
          !productBadge.includes(query)) {
        return false;
      }
    }

    // Category filter
    if (category !== 'all' && product.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }

    // Price filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    // Rating filter
    if (filters.minRating > 0 && product.rating < filters.minRating) {
      return false;
    }

    // Stock filter
    if (filters.inStockOnly && product.stock === 0) {
      return false;
    }

    // Sale filter
    if (filters.onSaleOnly && !product.originalPrice) {
      return false;
    }

    // AI Recommended filter
    if (filters.aiRecommended && !product.isAiRecommended) {
      return false;
    }

    return true;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating_desc':
        return b.rating - a.rating;
      case 'newest':
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      case 'trending':
        return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
      case 'relevance':
      default:
        // AI sort would go here
        if (aiSortEnabled) {
          // Prioritize AI recommended products
          return (b.isAiRecommended ? 1 : 0) - (a.isAiRecommended ? 1 : 0);
        }
        return 0;
    }
  });

  // Get category info
  const getCategoryInfo = () => {
    const categoryMap: Record<string, { name: string; description: string }> = {
      all: {
        name: 'All Products',
        description: 'Explore our complete collection of quality products, curated by AI for you.',
      },
      electronics: {
        name: 'Electronics',
        description: 'Top-rated tech gadgets and electronics curated by our AI engine.',
      },
      clothing: {
        name: 'Fashion & Clothing',
        description: 'Trendy fashion and clothing items for every style and occasion.',
      },
      accessories: {
        name: 'Accessories',
        description: 'Complete your look with our premium accessories collection.',
      },
      fitness: {
        name: 'Fitness & Wearables',
        description: 'Track your fitness journey with smart wearables and gear.',
      },
    };

    return categoryMap[category] || categoryMap.all;
  };

  const categoryInfo = getCategoryInfo();

  const productIdSignature = useMemo(
    () => sortedProducts.map((product) => product.id).join('-'),
    [sortedProducts],
  );

  useEffect(() => {
    if (sortedProducts.length === 0) {
      setPersonalizedIds(null);
      return;
    }

    rerankProducts(
      sortedProducts.map((product) => product.id),
      {
        userId: user?.id ?? 'guest',
        sessionId,
        device: window.innerWidth < 768 ? 'mobile' : 'desktop',
        category: category === 'all' ? undefined : category,
        priceBand: sortBy === 'price_desc' ? 'premium' : 'mid',
      },
    ).then((result) => {
      if (result) {
        setPersonalizedIds(result.rerankedOrder);
      } else {
        setPersonalizedIds(null);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, productIdSignature, rerankProducts, sessionId, sortBy, user?.id]);

  useEffect(() => {
    // Refresh personalization when filters toggle AI flag
    setPersonalizedIds(null);
  }, [filters.aiRecommended]);

  const personalizedProducts = useMemo(() => {
    if (!personalizedIds || personalizedIds.length === 0) {
      return sortedProducts;
    }
    const productMap = new Map(sortedProducts.map((product) => [product.id, product]));
    const deduped = personalizedIds
      .map((id) => productMap.get(id))
      .filter((product): product is Product => Boolean(product));
    // Ensure we include any items not present in reranked order (fallback)
    const remaining = sortedProducts.filter((product) => !personalizedIds.includes(product.id));
    return [...deduped, ...remaining];
  }, [personalizedIds, sortedProducts]);

  // Count active filters
  const activeFilterCount =
    (filters.brands.length > 0 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.onSaleOnly ? 1 : 0) +
    (filters.aiRecommended ? 1 : 0) +
    (filters.deliverySpeed.length > 0 ? 1 : 0) +
    (filters.priceRange[1] < 2000 ? 1 : 0);

  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const addItem = useCartStore((state) => state.addItem);
  
  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      stock: product.stock,
      deliveryDays: 2, // Default 2-day delivery
    }, 1);
    
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container-custom">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Shop', href: '/products' },
            { label: categoryInfo.name, href: `/products?category=${category}` },
          ]}
        />

        {/* Search Results Indicator */}
        {searchQuery && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SearchIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Search Results for: <span className="text-blue-600 dark:text-blue-400">"{searchQuery}"</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Found {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/products')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* Category Banner */}
        <CategoryBanner
          category={categoryInfo.name}
          description={categoryInfo.description}
          productCount={sortedProducts.length}
          activeFilters={activeFilterCount}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:col-span-1">
            <FilterSidebar
              onFilterChange={setFilters}
              activeFilterCount={activeFilterCount}
            />
          </aside>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Sorting Bar */}
            <SortingBar
              productCount={sortedProducts.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              aiSortEnabled={aiSortEnabled}
              onAiSortToggle={() => setAiSortEnabled(!aiSortEnabled)}
            />

            {/* Personalization summary */}
            {rerankResult && (
              <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900/40 dark:bg-blue-900/10 dark:text-blue-200">
                <p className="font-semibold">Personalized ranking enabled</p>
                <p className="mt-1 text-xs">
                  Boosted items based on session signals (click depth {rerankResult.sessionFeatures.recent_view_count},
                  margin target {Math.round(rerankResult.sessionFeatures.margin_target * 100)}%). Toggle
                  AI sort to revert to neutral ordering.
                </p>
              </div>
            )}
            {personalizationError && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-200">
                {personalizationError}
              </div>
            )}

            {/* Products Grid/List */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loading size="lg" text="Loading products..." />
              </div>
            ) : personalizedProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {personalizedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onQuickView={setQuickViewProduct}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favorites.has(product.id)}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button variant="primary" onClick={() => setFilters({
                  priceRange: [0, 2000],
                  brands: [],
                  minRating: 0,
                  inStockOnly: false,
                  onSaleOnly: false,
                  aiRecommended: false,
                  deliverySpeed: [],
                  colors: [],
                  sizes: [],
                })}>
                  Clear All Filters
                </Button>
              </motion.div>
            )}

            {/* Load More */}
            {personalizedProducts.length > 0 && personalizedProducts.length >= 12 && (
              <div className="text-center mt-12">
                <Button variant="secondary" size="lg">
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Category Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/20 dark:to-teal-900/20 rounded-2xl p-8 text-center border border-blue-200 dark:border-blue-800"
        >
          <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Still Exploring? Let Our AI Help!
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Our intelligent assistant can help you find exactly what you're looking for
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => {
                alert('🤖 AI Assistant Coming Soon!\n\nOur intelligent shopping assistant will help you find products through natural conversation.\n\nFeatures:\n• Natural language search\n• Product recommendations\n• Smart comparisons\n• Personalized suggestions');
              }}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Try AI Assistant
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => {
                alert('📸 Visual Search Coming Soon!\n\nUpload an image to find similar products!\n\nFeatures:\n• Image recognition\n• Style matching\n• Color detection\n• Similar product discovery');
              }}
            >
              <SearchIcon className="w-5 h-5 mr-2" />
              Visual Search
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(product, qty) => {
          console.log('Add to cart:', product, qty);
          setQuickViewProduct(null);
        }}
      />
    </div>
  );
};

export default ProductsPage;

