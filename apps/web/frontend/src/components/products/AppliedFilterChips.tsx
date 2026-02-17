import React from 'react';
import { X } from 'lucide-react';
import type { ProductFilters } from './FilterSidebar';

interface AppliedFilterChipsProps {
  filters: ProductFilters;
  onRemoveFilter: (updates: Partial<ProductFilters>) => void;
  onClearAll: () => void;
}

const DEFAULT_FILTERS: ProductFilters = {
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

/**
 * Applied filter chips - Amazon/eBay style.
 * Shows active filters as removable chips above the product grid.
 */
export const AppliedFilterChips: React.FC<AppliedFilterChipsProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
}) => {
  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  // Price range (if not default)
  if (filters.priceRange[0] !== DEFAULT_FILTERS.priceRange[0] || filters.priceRange[1] !== DEFAULT_FILTERS.priceRange[1]) {
    chips.push({
      key: 'price',
      label: `Price: $${filters.priceRange[0].toLocaleString()} – $${filters.priceRange[1].toLocaleString()}`,
      onRemove: () => onRemoveFilter({ priceRange: [0, 2000] }),
    });
  }

  // Brands
  filters.brands.forEach((brand) => {
    chips.push({
      key: `brand-${brand}`,
      label: `Brand: ${brand}`,
      onRemove: () => onRemoveFilter({ brands: filters.brands.filter((b) => b !== brand) }),
    });
  });

  // Min rating (e.g. 4★ & up)
  if (filters.minRating > 0) {
    chips.push({
      key: 'rating',
      label: `${filters.minRating}★ & up`,
      onRemove: () => onRemoveFilter({ minRating: 0 }),
    });
  }

  // In stock only
  if (filters.inStockOnly) {
    chips.push({
      key: 'inStock',
      label: 'In stock',
      onRemove: () => onRemoveFilter({ inStockOnly: false }),
    });
  }

  // On sale
  if (filters.onSaleOnly) {
    chips.push({
      key: 'onSale',
      label: 'On sale',
      onRemove: () => onRemoveFilter({ onSaleOnly: false }),
    });
  }

  // AI Recommended
  if (filters.aiRecommended) {
    chips.push({
      key: 'aiRecommended',
      label: 'AI Recommended',
      onRemove: () => onRemoveFilter({ aiRecommended: false }),
    });
  }

  // Delivery speed
  filters.deliverySpeed.forEach((speed) => {
    chips.push({
      key: `delivery-${speed}`,
      label: `Delivery: ${speed}`,
      onRemove: () =>
        onRemoveFilter({
          deliverySpeed: filters.deliverySpeed.filter((s) => s !== speed),
        }),
    });
  });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 py-2">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 shrink-0">
        Active filters:
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          {chip.label}
          <X className="w-4 h-4 text-gray-500 hover:text-red-500" aria-hidden />
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline shrink-0"
      >
        Clear all
      </button>
    </div>
  );
};

export default AppliedFilterChips;
