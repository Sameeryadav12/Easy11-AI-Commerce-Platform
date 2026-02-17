import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import FilterSidebar, { ProductFilters } from './FilterSidebar';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  activeFilterCount: number;
}

/**
 * Filter Drawer - slide-out panel for mobile.
 * Filters slide in from the left on mobile; desktop uses sidebar.
 */
export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  activeFilterCount,
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
        {/* Drawer - slides from left */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed left-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col lg:hidden"
          aria-modal
          aria-label="Filters"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
              Filters
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close filters"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <FilterSidebar
              filters={filters}
              onFilterChange={onFilterChange}
              activeFilterCount={activeFilterCount}
              embedded
            />
          </div>
          {/* Done button for easy close on mobile */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default FilterDrawer;
