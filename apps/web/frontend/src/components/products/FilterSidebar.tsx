import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, ChevronUp, X, Sparkles } from 'lucide-react';
import { Button, Badge } from '../ui';

interface FilterSidebarProps {
  onFilterChange: (filters: ProductFilters) => void;
  activeFilterCount?: number;
}

export interface ProductFilters {
  priceRange: [number, number];
  brands: string[];
  minRating: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  aiRecommended: boolean;
  deliverySpeed: string[];
  colors: string[];
  sizes: string[];
}

/**
 * Filter Sidebar Component
 * 
 * Comprehensive filtering system for products.
 * Collapsible filter groups with smooth animations.
 * Mobile-responsive with slide-out drawer.
 */
export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onFilterChange,
  activeFilterCount = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState({
    price: true,
    brand: true,
    rating: true,
    availability: true,
    delivery: false,
    attributes: false,
  });

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

  // Local state for smooth slider (prevents re-render during drag)
  const [localPriceMin, setLocalPriceMin] = useState(0);
  const [localPriceMax, setLocalPriceMax] = useState(2000);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);

  const brands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Dell', 'HP', 'Canon'];
  const deliveryOptions = ['1-Day', '2-Day', 'Standard'];
  const colors = ['Red', 'Blue', 'Black', 'White', 'Green', 'Yellow'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const toggleSection = (section: keyof typeof isExpanded) => {
    setIsExpanded({ ...isExpanded, [section]: !isExpanded[section] });
  };

  const updateFilters = (updates: Partial<ProductFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle min price slider change - immediate updates for smoothness
  const handleMinPriceChange = (value: number) => {
    const newMin = Math.min(value, localPriceMax - 5); // Ensure min is always less than max
    setLocalPriceMin(newMin);
    // Update filters immediately - no debounce for smooth dragging
    updateFilters({ priceRange: [newMin, localPriceMax] });
  };

  // Handle max price slider change - immediate updates for smoothness
  const handleMaxPriceChange = (value: number) => {
    const newMax = Math.max(value, localPriceMin + 5); // Ensure max is always greater than min
    setLocalPriceMax(newMax);
    // Update filters immediately - no debounce for smooth dragging
    updateFilters({ priceRange: [localPriceMin, newMax] });
  };

  // Sync local state with filters when they change externally
  useEffect(() => {
    if (!isDragging) {
      setLocalPriceMin(filters.priceRange[0]);
      setLocalPriceMax(filters.priceRange[1]);
    }
  }, [filters.priceRange, isDragging]);

  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    updateFilters({ brands: newBrands });
  };

  const clearAllFilters = () => {
    const defaultFilters: ProductFilters = {
      priceRange: [0, 2000],
      brands: [],
      minRating: 0,
      inStockOnly: false,
      onSaleOnly: false,
      aiRecommended: false,
      deliverySpeed: [],
      colors: [],
      sizes: [],
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const FilterSection: React.FC<{
    title: string;
    section: keyof typeof isExpanded;
    children: React.ReactNode;
  }> = ({ title, section, children }) => (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full py-2 text-left group"
      >
        <h3 className="font-heading font-semibold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
          {title}
        </h3>
        {isExpanded[section] ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      <AnimatePresence>
        {isExpanded[section] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
            Filters
          </h2>
        </div>
        {activeFilterCount > 0 && (
          <Badge variant="info" size="sm">
            {activeFilterCount}
          </Badge>
        )}
      </div>

      {/* AI Recommended Toggle */}
      <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.aiRecommended}
            onChange={(e) => updateFilters({ aiRecommended: e.target.checked })}
            className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
          />
          <div className="ml-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-900 dark:text-white">
                AI Recommended
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Show products picked for you
            </p>
          </div>
        </label>
      </div>

      {/* Price Range */}
      <FilterSection title="Price Range" section="price">
        <div className="space-y-4">
          {/* Min/Max Price Inputs */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Min Price</label>
              <input
                type="number"
                min="0"
                max={localPriceMax - 10}
                value={localPriceMin}
              onChange={(e) => {
                const value = Math.max(0, Math.min(parseInt(e.target.value) || 0, localPriceMax - 5));
                setLocalPriceMin(value);
                updateFilters({ priceRange: [value, localPriceMax] });
              }}
                onFocus={() => setIsDragging('min')}
                onBlur={() => setIsDragging(null)}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Max Price</label>
              <input
                type="number"
                min={localPriceMin + 10}
                max="2000"
                value={localPriceMax}
              onChange={(e) => {
                const value = Math.min(2000, Math.max(parseInt(e.target.value) || 2000, localPriceMin + 5));
                setLocalPriceMax(value);
                updateFilters({ priceRange: [localPriceMin, value] });
              }}
                onFocus={() => setIsDragging('max')}
                onBlur={() => setIsDragging(null)}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors"
              />
            </div>
          </div>
          
          {/* Dual Range Slider Container */}
          <div className="relative py-6">
            {/* Track Background */}
            <div className="absolute top-1/2 left-0 right-0 h-3 bg-gray-200 dark:bg-gray-700 rounded-full transform -translate-y-1/2" />
            
            {/* Active Range Fill */}
            <div
              className="absolute top-1/2 h-3 bg-blue-500 rounded-full transform -translate-y-1/2 transition-all duration-75"
              style={{
                left: `${(localPriceMin / 2000) * 100}%`,
                width: `${((localPriceMax - localPriceMin) / 2000) * 100}%`,
              }}
            />
            
            {/* Min Slider - Lower z-index */}
            <input
              type="range"
              min="0"
              max="2000"
              step="5"
              value={localPriceMin}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                const constrainedValue = Math.min(value, localPriceMax - 5);
                setLocalPriceMin(constrainedValue);
                updateFilters({ priceRange: [constrainedValue, localPriceMax] });
              }}
              onMouseDown={() => setIsDragging('min')}
              onMouseUp={() => setIsDragging(null)}
              onTouchStart={() => setIsDragging('min')}
              onTouchEnd={() => setIsDragging(null)}
              className="absolute top-1/2 left-0 w-full h-4 bg-transparent appearance-none cursor-pointer transform -translate-y-1/2 z-10 slider-thumb"
              style={{
                pointerEvents: 'auto',
              }}
            />
            
            {/* Max Slider - Higher z-index to be on top */}
            <input
              type="range"
              min="0"
              max="2000"
              step="5"
              value={localPriceMax}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                const constrainedValue = Math.max(value, localPriceMin + 5);
                setLocalPriceMax(constrainedValue);
                updateFilters({ priceRange: [localPriceMin, constrainedValue] });
              }}
              onMouseDown={() => setIsDragging('max')}
              onMouseUp={() => setIsDragging(null)}
              onTouchStart={() => setIsDragging('max')}
              onTouchEnd={() => setIsDragging(null)}
              className="absolute top-1/2 left-0 w-full h-4 bg-transparent appearance-none cursor-pointer transform -translate-y-1/2 z-20 slider-thumb"
              style={{
                pointerEvents: 'auto',
              }}
            />
          </div>
          
          {/* Price Display */}
          <div className="flex items-center justify-between text-sm pt-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium">$0</span>
            <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                ${localPriceMin.toLocaleString()} - ${localPriceMax.toLocaleString()}
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-400 font-medium">$2,000</span>
          </div>
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brand" section="brand">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Customer Rating" section="rating">
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <button
              key={rating}
              onClick={() => updateFilters({ minRating: rating })}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                filters.minRating === rating
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < Math.floor(rating)
                          ? 'text-yellow-500'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {rating} & up
                </span>
              </div>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" section="availability">
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => updateFilters({ inStockOnly: e.target.checked })}
              className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">In Stock Only</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onSaleOnly}
              onChange={(e) => updateFilters({ onSaleOnly: e.target.checked })}
              className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">On Sale</span>
          </label>
        </div>
      </FilterSection>

      {/* Delivery Speed */}
      <FilterSection title="Delivery Speed" section="delivery">
        <div className="space-y-2">
          {deliveryOptions.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.deliverySpeed.includes(option)}
                onChange={(e) => {
                  const newSpeeds = e.target.checked
                    ? [...filters.deliverySpeed, option]
                    : filters.deliverySpeed.filter((s) => s !== option);
                  updateFilters({ deliverySpeed: newSpeeds });
                }}
                className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">{option} Shipping</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Clear All Filters */}
      {activeFilterCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={clearAllFilters}
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default FilterSidebar;

