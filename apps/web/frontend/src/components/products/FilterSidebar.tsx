import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRanger } from '@tanstack/react-ranger';
import { SlidersHorizontal, ChevronDown, ChevronUp, X, Sparkles } from 'lucide-react';
import { Badge } from '../ui';

const PRICE_MIN = 0;
const PRICE_MAX = 2000;
const PRICE_STEP = 5;

/** Clamp and validate: min <= max, both in [0..2000] */
function clampPriceRange(min: number, max: number): [number, number] {
  const m = Math.max(PRICE_MIN, Math.min(PRICE_MAX, Math.round(min / PRICE_STEP) * PRICE_STEP));
  const M = Math.max(PRICE_MIN, Math.min(PRICE_MAX, Math.round(max / PRICE_STEP) * PRICE_STEP));
  if (m > M) return [M, m];
  return [m, M];
}

/** Stable section component so inputs don't remount on parent re-render (fixes one-digit typing) */
const FilterSection: React.FC<{
  title: string;
  section: keyof ReturnType<typeof createInitialExpanded>;
  isExpanded: Record<string, boolean>;
  onToggle: (section: keyof ReturnType<typeof createInitialExpanded>) => void;
  children: React.ReactNode;
}> = ({ title, section, isExpanded, onToggle, children }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
    <button
      onClick={() => onToggle(section)}
      className="flex items-center justify-between w-full py-2 text-left group"
    >
      <h3 className="font-heading font-semibold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
        {title}
      </h3>
      {isExpanded[section] ? (
        <ChevronUp className="w-5 h-5 text-gray-500 shrink-0" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
      )}
    </button>
    <AnimatePresence initial={false}>
      {isExpanded[section] && (
        <motion.div
          initial={{ maxHeight: 0, opacity: 0 }}
          animate={{ maxHeight: 800, opacity: 1 }}
          exit={{ maxHeight: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
          style={{ contain: 'layout' }}
        >
          <div className="pt-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

function createInitialExpanded() {
  return {
    price: true,
    brand: true,
    rating: true,
    availability: true,
    delivery: false,
    attributes: false,
  };
}

export const DEFAULT_FILTERS: ProductFilters = {
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

interface FilterSidebarProps {
  filters?: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  activeFilterCount?: number;
  /** When true, used inside drawer - no sticky/rounded wrapper */
  embedded?: boolean;
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
  filters: controlledFilters,
  onFilterChange,
  activeFilterCount = 0,
  embedded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(createInitialExpanded());

  const [internalFilters, setInternalFilters] = useState<ProductFilters>(controlledFilters ?? DEFAULT_FILTERS);
  const filters = controlledFilters ?? internalFilters;

  // Sync internal state when parent passes new filters (e.g. chip removal)
  useEffect(() => {
    if (controlledFilters) {
      setInternalFilters(controlledFilters);
      const [min, max] = controlledFilters.priceRange;
      setLocalPriceMin(min);
      setLocalPriceMax(max);
      setMinPriceInputStr(String(min));
      setMaxPriceInputStr(String(max));
    }
  }, [controlledFilters]);

  // Numeric range (for slider and filter). String state lets user clear/type freely in inputs.
  const [localPriceMin, setLocalPriceMin] = useState(0);
  const [localPriceMax, setLocalPriceMax] = useState(2000);
  const [minPriceInputStr, setMinPriceInputStr] = useState('0');
  const [maxPriceInputStr, setMaxPriceInputStr] = useState('2000');
  const rangerRef = useRef<HTMLDivElement | null>(null);

  const syncNumericToInputStrings = useCallback((min: number, max: number) => {
    setLocalPriceMin(min);
    setLocalPriceMax(max);
    setMinPriceInputStr(String(min));
    setMaxPriceInputStr(String(max));
  }, []);

  // Sync local state when parent passes new filters (e.g. chip removal, clear all)
  useEffect(() => {
    if (controlledFilters) {
      const [min, max] = controlledFilters.priceRange;
      syncNumericToInputStrings(min, max);
    }
  }, [controlledFilters?.priceRange[0], controlledFilters?.priceRange[1], syncNumericToInputStrings]);

  // Parse current input strings to numbers (empty or invalid -> use bounds for slider)
  const parsedMin = (() => {
    const n = parseInt(minPriceInputStr, 10);
    if (minPriceInputStr === '' || isNaN(n)) return localPriceMin;
    return Math.max(PRICE_MIN, Math.min(PRICE_MAX, n));
  })();
  const parsedMax = (() => {
    const n = parseInt(maxPriceInputStr, 10);
    if (maxPriceInputStr === '' || isNaN(n)) return localPriceMax;
    return Math.max(PRICE_MIN, Math.min(PRICE_MAX, n));
  })();

  // Validate on blur: clamp and sync so you can't get stuck on invalid text
  const handlePriceInputBlur = useCallback(() => {
    const minNum = minPriceInputStr === '' || isNaN(parseInt(minPriceInputStr, 10))
      ? PRICE_MIN
      : Math.max(PRICE_MIN, Math.min(PRICE_MAX, parseInt(minPriceInputStr, 10)));
    const maxNum = maxPriceInputStr === '' || isNaN(parseInt(maxPriceInputStr, 10))
      ? PRICE_MAX
      : Math.max(PRICE_MIN, Math.min(PRICE_MAX, parseInt(maxPriceInputStr, 10)));
    const [min, max] = clampPriceRange(minNum, maxNum);
    syncNumericToInputStrings(min, max);
  }, [minPriceInputStr, maxPriceInputStr, syncNumericToInputStrings]);

  // Apply: parse, clamp, push to filters
  const handleApplyPrice = useCallback(() => {
    const minNum = minPriceInputStr === '' || isNaN(parseInt(minPriceInputStr, 10))
      ? PRICE_MIN
      : Math.max(PRICE_MIN, Math.min(PRICE_MAX, parseInt(minPriceInputStr, 10)));
    const maxNum = maxPriceInputStr === '' || isNaN(parseInt(maxPriceInputStr, 10))
      ? PRICE_MAX
      : Math.max(PRICE_MIN, Math.min(PRICE_MAX, parseInt(maxPriceInputStr, 10)));
    const [min, max] = clampPriceRange(minNum, maxNum);
    syncNumericToInputStrings(min, max);
    updateFilters({ priceRange: [min, max] });
  }, [minPriceInputStr, maxPriceInputStr, filters, syncNumericToInputStrings]);

  // Reset: back to default and apply
  const handleResetPrice = useCallback(() => {
    syncNumericToInputStrings(DEFAULT_FILTERS.priceRange[0], DEFAULT_FILTERS.priceRange[1]);
    updateFilters({ priceRange: DEFAULT_FILTERS.priceRange });
  }, [filters, syncNumericToInputStrings]);

  // Slider updates both numeric and input strings
  const handleSliderChange = useCallback((newMin: number, newMax: number) => {
    const [min, max] = clampPriceRange(newMin, newMax);
    syncNumericToInputStrings(min, max);
  }, [syncNumericToInputStrings]);

  const ranger = useRanger({
    getRangerElement: () => rangerRef.current,
    values: [parsedMin, parsedMax],
    min: PRICE_MIN,
    max: PRICE_MAX,
    stepSize: PRICE_STEP,
    onChange: (instance) => {
      const vals = instance.sortedValues;
      if (vals.length >= 2) {
        handleSliderChange(vals[0] as number, vals[1] as number);
      }
    },
    onDrag: (instance) => {
      // Real-time updates while dragging – keep Min/Max inputs and display in sync
      const vals = instance.sortedValues;
      if (vals.length >= 2) {
        handleSliderChange(vals[0] as number, vals[1] as number);
      }
    },
  });

  const brands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Dell', 'HP', 'Canon'];
  const deliveryOptions = ['1-Day', '2-Day', 'Standard'];

  const toggleSection = (section: keyof ReturnType<typeof createInitialExpanded>) => {
    setIsExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilters = (updates: Partial<ProductFilters>) => {
    const newFilters = { ...filters, ...updates };
    setInternalFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Option A: Slider only updates local inputs; Apply pushes to filters

  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    updateFilters({ brands: newBrands });
  };

  const clearAllFilters = () => {
    setInternalFilters(DEFAULT_FILTERS);
    setLocalPriceMin(DEFAULT_FILTERS.priceRange[0]);
    setLocalPriceMax(DEFAULT_FILTERS.priceRange[1]);
    setMinPriceInputStr(String(DEFAULT_FILTERS.priceRange[0]));
    setMaxPriceInputStr(String(DEFAULT_FILTERS.priceRange[1]));
    onFilterChange(DEFAULT_FILTERS);
  };

  const wrapperClass = embedded
    ? 'p-4'
    : 'bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24';

  return (
    <div className={wrapperClass}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
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

      {/* Clear All Filters - prominent at top when filters active */}
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        >
          <X className="w-4 h-4" />
          Clear All Filters
        </button>
      )}

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
      <FilterSection title="Price Range" section="price" isExpanded={isExpanded} onToggle={toggleSection}>
        <div className="space-y-4">
          {/* Min/Max Price Inputs */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Min Price</label>
              <input
                type="text"
                inputMode="numeric"
                aria-label="Min price"
                value={minPriceInputStr}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '' || /^\d*$/.test(v)) setMinPriceInputStr(v);
                }}
                onBlur={handlePriceInputBlur}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Max Price</label>
              <input
                type="text"
                inputMode="numeric"
                aria-label="Max price"
                value={maxPriceInputStr}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '' || /^\d*$/.test(v)) setMaxPriceInputStr(v);
                }}
                onBlur={handlePriceInputBlur}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors"
              />
            </div>
          </div>
          
          {/* Option B: TanStack Ranger - dual range slider */}
          <div className="relative py-6">
            <div
              ref={rangerRef}
              className="relative h-6 flex items-center"
              style={{ touchAction: 'none' }}
            >
              {/* Track Background */}
              <div className="absolute top-1/2 left-0 right-0 h-3 bg-gray-200 dark:bg-gray-700 rounded-full transform -translate-y-1/2" />
              {/* Active Range Fill - from Ranger getSteps */}
              {ranger.getSteps().slice(1, 2).map(({ left, width }) => (
                <div
                  key="active"
                  className="absolute top-1/2 h-3 bg-blue-500 rounded-full transform -translate-y-1/2 transition-all duration-75"
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                  }}
                />
              ))}
              {/* Handles */}
              {ranger.handles().map(({ value, onMouseDownHandler, onTouchStart, onKeyDownHandler, isActive }, i) => (
                <div
                  key={i}
                  onMouseDown={(e) => { e.preventDefault(); onMouseDownHandler(e); }}
                  onTouchStart={(e) => { e.preventDefault(); onTouchStart(e); }}
                  onKeyDown={onKeyDownHandler}
                  role="slider"
                  aria-valuemin={PRICE_MIN}
                  aria-valuemax={PRICE_MAX}
                  aria-valuenow={value}
                  tabIndex={0}
                  className={`absolute top-1/2 w-5 h-5 -ml-2.5 -mt-2.5 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800 shadow-md cursor-grab active:cursor-grabbing z-10 transition-transform ${
                    isActive ? 'scale-110 ring-2 ring-blue-300' : ''
                  }`}
                  style={{
                    left: `${ranger.getPercentageForValue(value)}%`,
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Price Display - min-width prevents layout shift when numbers change */}
          <div className="flex items-center justify-between text-sm pt-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium">$0</span>
            <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 min-w-[140px] text-center">
              <span className="font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                ${parsedMin.toLocaleString()} - ${parsedMax.toLocaleString()}
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-400 font-medium">$2,000</span>
          </div>

          {/* Apply & Reset - Option A: inputs as source of truth */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={handleApplyPrice}
              className="flex-1 py-2 px-4 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={handleResetPrice}
              className="py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brand" section="brand" isExpanded={isExpanded} onToggle={toggleSection}>
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
      <FilterSection title="Customer Rating" section="rating" isExpanded={isExpanded} onToggle={toggleSection}>
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
      <FilterSection title="Availability" section="availability" isExpanded={isExpanded} onToggle={toggleSection}>
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
      <FilterSection title="Delivery Speed" section="delivery" isExpanded={isExpanded} onToggle={toggleSection}>
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

    </div>
  );
};

export default FilterSidebar;

