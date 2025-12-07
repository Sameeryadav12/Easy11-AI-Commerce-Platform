import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import { Badge } from '../ui';

interface CategoryBannerProps {
  category: string;
  description: string;
  productCount: number;
  activeFilters?: number;
  bannerImage?: string;
}

/**
 * Category Banner Component
 * 
 * Marketing hero section for each product category.
 * Shows category info, description, and active filters.
 * Admin-controllable content with AI-driven messaging.
 * 
 * @example
 * ```tsx
 * <CategoryBanner
 *   category="Electronics"
 *   description="Top-rated tech gadgets curated by our AI"
 *   productCount={245}
 *   activeFilters={3}
 * />
 * ```
 */
export const CategoryBanner: React.FC<CategoryBannerProps> = ({
  category,
  description,
  productCount,
  activeFilters = 0,
  bannerImage,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-navy-600 text-white mb-8"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
          className="w-full h-full"
        />
      </div>

      {/* Background Image (if provided) */}
      {bannerImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${bannerImage})` }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 p-8 lg:p-12">
        <div className="max-w-4xl">
          {/* Category Title */}
          <div className="flex items-center space-x-3 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
            <h1 className="text-4xl lg:text-5xl font-heading font-bold">
              {category}
            </h1>
          </div>

          {/* Description */}
          <p className="text-xl text-blue-100 mb-6 max-w-2xl">
            {description}
          </p>

          {/* Stats & Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Product Count */}
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">
                {productCount.toLocaleString()} products
              </span>
            </div>

            {/* Active Filters */}
            {activeFilters > 0 && (
              <Badge variant="success" className="bg-teal-500 text-white">
                {activeFilters} {activeFilters === 1 ? 'filter' : 'filters'} active
              </Badge>
            )}

            {/* AI Badge */}
            <div className="flex items-center space-x-2 bg-teal-500/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-teal-400/30">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span className="text-sm font-medium text-teal-100">
                AI-Powered Ranking
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl" />
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl" />
    </motion.div>
  );
};

export default CategoryBanner;

