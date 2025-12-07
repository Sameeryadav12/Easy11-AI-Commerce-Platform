import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Share2, ShoppingCart, Zap, Sparkles, TrendingUp } from 'lucide-react';
import { Button, Badge } from '../ui';
import { useCartStore } from '../../store/cartStore';

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    tagline?: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    stock: number;
    category: string;
    isAiRecommended?: boolean;
    aiRelevanceScore?: number;
  };
}

/**
 * Product Info Panel Component
 * 
 * Essential product information with add to cart functionality.
 * Features AI personalization badges and trust indicators.
 */
export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem } = useCartStore();

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const savings = product.originalPrice
    ? product.originalPrice - product.price
    : 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: '🎧', // Will use actual image
    });
    // Show success toast
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout';
  };

  return (
    <div className="space-y-6">
      {/* Category Badge */}
      <div>
        <Badge variant="info" size="sm">
          {product.category}
        </Badge>
      </div>

      {/* Title & Tagline */}
      <div>
        <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
          {product.name}
        </h1>
        {product.tagline && (
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {product.tagline}
          </p>
        )}
      </div>

      {/* AI Personalization Badge */}
      {product.isAiRecommended && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-heading font-semibold text-gray-900 dark:text-white mb-1">
                Great Match for You!
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Our AI estimates <span className="font-bold text-blue-600 dark:text-blue-400">
                  {product.aiRelevanceScore || 90}% relevance
                </span> to your interests based on your browsing and purchase patterns.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Rating */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 ${
                i < Math.floor(product.rating)
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
        </div>
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          {product.rating}
        </span>
        <button className="text-blue-500 hover:text-blue-600 underline text-sm">
          ({product.reviews.toLocaleString()} reviews)
        </button>
      </div>

      {/* Price Block */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-baseline space-x-4 mb-3">
          <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-2xl text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {savings > 0 && (
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="success" size="lg">
              Save ${savings.toFixed(2)} ({discountPercentage}% OFF)
            </Badge>
            <button className="text-sm text-blue-500 hover:text-blue-600 underline">
              See price history →
            </button>
          </div>
        )}

        {/* Stock Indicator */}
        <div className="flex items-center space-x-2 py-3 border-t border-gray-200 dark:border-gray-700">
          {product.stock > 20 ? (
            <>
              <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse" />
              <span className="text-teal-700 dark:text-teal-300 font-semibold">
                In Stock - Ships in 1 day
              </span>
            </>
          ) : product.stock > 0 ? (
            <>
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-orange-700 dark:text-orange-300 font-semibold">
                Only {product.stock} left - Order soon!
              </span>
            </>
          ) : (
            <>
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-red-700 dark:text-red-300 font-semibold">
                Out of Stock
              </span>
            </>
          )}
        </div>
      </div>

      {/* Quantity Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quantity
        </label>
        <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden w-40">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-lg font-semibold"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="flex-1 text-center font-semibold text-lg border-0 focus:outline-none bg-transparent"
            min="1"
            max={product.stock}
          />
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-lg font-semibold"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="success"
          size="lg"
          fullWidth
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="group"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
          <motion.span
            className="ml-2"
            animate={{ x: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
        </Button>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleBuyNow}
          disabled={product.stock === 0}
        >
          <Zap className="w-5 h-5 mr-2" />
          Buy Now - Fast Checkout
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="ghost"
            onClick={() => setIsFavorite(!isFavorite)}
            className="justify-center"
          >
            <Heart
              className={`w-5 h-5 mr-2 transition-colors ${
                isFavorite ? 'text-red-500 fill-red-500' : ''
              }`}
            />
            {isFavorite ? 'Saved' : 'Save'}
          </Button>
          <Button variant="ghost" className="justify-center">
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Payment Icons */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Secure payment with:
        </p>
        <div className="flex items-center space-x-4 flex-wrap">
          {['💳', '🅿️', '🍎'].map((icon, i) => (
            <div
              key={i}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-2xl"
            >
              {icon}
            </div>
          ))}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Visa, Mastercard, PayPal, Apple Pay
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;

