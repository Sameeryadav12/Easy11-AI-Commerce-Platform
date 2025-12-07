import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingCart, Heart, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge } from '../ui';
import { Product } from './ProductCard';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}

/**
 * Quick View Modal Component
 * 
 * Modal for quickly viewing product details without leaving the listing page.
 * Features image carousel, key specs, and add to cart functionality.
 */
export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const images = [product.image, product.secondaryImage || product.image, product.image];
  
  const handleAddToCart = () => {
    onAddToCart?.(product, quantity);
    // Show success feedback
  };

  const handleClose = () => {
    setQuantity(1);
    setSelectedImage(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <div className="grid md:grid-cols-2 gap-8 p-6">
              {/* Left Side - Images */}
              <div>
                {/* Main Image */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                  <span className="text-9xl">{images[selectedImage]}</span>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.badge && (
                      <Badge variant="success">{product.badge}</Badge>
                    )}
                    {product.isAiRecommended && (
                      <Badge variant="info">AI Pick</Badge>
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                        selectedImage === index
                          ? 'ring-4 ring-blue-500 bg-blue-50 dark:bg-blue-900'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span className="text-3xl">{img}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Side - Details */}
              <div className="flex flex-col">
                {/* Title & Category */}
                <div className="mb-4">
                  <Badge variant="info" size="sm" className="mb-2">
                    {product.category}
                  </Badge>
                  <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                    {product.name}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline space-x-3 mb-2">
                    <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-2xl text-gray-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <Badge variant="success">
                      Save ${(product.originalPrice - product.price).toFixed(2)} ({discountPercentage}% off)
                    </Badge>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  <Badge variant={product.stock > 20 ? 'success' : product.stock > 0 ? 'warning' : 'danger'}>
                    {product.stock > 20
                      ? 'In Stock'
                      : product.stock > 0
                      ? `Only ${product.stock} left - Order soon!`
                      : 'Out of Stock'}
                  </Badge>
                </div>

                {/* Key Features */}
                <div className="mb-6 flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Key Features:
                  </h4>
                  <ul className="space-y-2">
                    {[
                      'Premium quality materials',
                      'Fast shipping available',
                      '30-day return policy',
                      'Warranty included',
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start space-x-2 text-gray-700 dark:text-gray-300">
                        <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden w-32">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="success"
                    size="lg"
                    fullWidth
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Link to={`/products/${product.id}`} className="flex-shrink-0">
                    <Button variant="secondary" size="lg">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;

