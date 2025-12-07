import { Grid, List, Sparkles, TrendingUp, DollarSign, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export type SortOption =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'newest'
  | 'trending';

export type ViewMode = 'grid' | 'list';

interface SortingBarProps {
  productCount: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  aiSortEnabled?: boolean;
  onAiSortToggle?: () => void;
}

/**
 * Sorting Bar Component
 * 
 * Toolbar for sorting products and toggling view modes.
 * Features AI-powered "Smart Sort" with visual indicators.
 */
export const SortingBar: React.FC<SortingBarProps> = ({
  productCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  aiSortEnabled = false,
  onAiSortToggle,
}) => {
  const sortOptions = [
    { value: 'relevance' as SortOption, label: 'Relevance', icon: <Sparkles className="w-4 h-4" /> },
    { value: 'price_asc' as SortOption, label: 'Price: Low to High', icon: <DollarSign className="w-4 h-4" /> },
    { value: 'price_desc' as SortOption, label: 'Price: High to Low', icon: <DollarSign className="w-4 h-4" /> },
    { value: 'rating_desc' as SortOption, label: 'Highest Rated', icon: <Star className="w-4 h-4" /> },
    { value: 'newest' as SortOption, label: 'Newest First', icon: <Clock className="w-4 h-4" /> },
    { value: 'trending' as SortOption, label: 'Trending', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const currentSort = sortOptions.find((opt) => opt.value === sortBy);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      {/* Left Side - Product Count & AI Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Product Count */}
        <p className="text-gray-600 dark:text-gray-400">
          Showing{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {productCount.toLocaleString()}
          </span>{' '}
          products
        </p>

        {/* AI Smart Sort Toggle */}
        {onAiSortToggle && (
          <motion.button
            onClick={onAiSortToggle}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              aiSortEnabled
                ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">
              {aiSortEnabled ? 'AI Sort Active' : 'Enable AI Sort'}
            </span>
          </motion.button>
        )}
      </div>

      {/* Right Side - Sort & View Controls */}
      <div className="flex items-center space-x-4 w-full sm:w-auto">
        {/* Sort Dropdown */}
        <div className="flex-1 sm:flex-none">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full sm:w-auto px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2.5 transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            aria-label="Grid view"
            title="Grid view"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2.5 transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            aria-label="List view"
            title="List view"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortingBar;

