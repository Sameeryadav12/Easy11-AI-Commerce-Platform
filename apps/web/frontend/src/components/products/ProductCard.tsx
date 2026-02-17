import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye, Star, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { Card, CardBody, Badge, Button } from '../ui';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  secondaryImage?: string;
  category: string;
  stock: number;
  badge?: string;
  brand?: string;
  deliveryDays?: number;
  isAiRecommended?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

/**
 * Product Card Component
 * 
 * Displays product information in grid or list view.
 * Features hover effects, quick actions, and AI recommendation badges.
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = 'grid',
  onQuickView,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    onQuickView?.(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToCart?.(product);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleFavorite?.(product.id);
  };

  if (viewMode === 'list') {
    return (
      <Link to={`/products/${product.id}`}>
        <Card hover className="group">
          <CardBody className="p-0">
            <div className="flex gap-4 p-4">
              {/* Image */}
              <div className="w-40 h-40 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                <span className="text-6xl">{product.image}</span>
                {product.badge && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="success" size="sm">
                      {product.badge}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.isAiRecommended && (
                      <Badge variant="info" size="sm" icon={<Sparkles className="w-3 h-3" />}>
                        AI Recommended
                      </Badge>
                    )}
                    {product.isTrending && (
                      <Badge variant="warning" size="sm" icon={<TrendingUp className="w-3 h-3" />}>
                        Trending
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge variant="info" size="sm" icon={<Zap className="w-3 h-3" />}>
                        New
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    {discountPercentage > 0 && (
                      <Badge variant="success" size="sm" className="mt-1">
                        Save {discountPercentage}%
                      </Badge>
                    )}
                  </div>
                  <Button variant="primary" onClick={handleAddToCart}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Link>
    );
  }

  // Grid View
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/products/${product.id}`}>
        <Card hover className="group h-full overflow-hidden">
          <CardBody className="p-0">
            {/* Image Container */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
              {/* Product Image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="text-8xl"
                  animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {product.image}
                </motion.span>
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.badge && (
                  <Badge variant="success" size="sm">
                    {product.badge}
                  </Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge variant="danger" size="sm">
                    -{discountPercentage}%
                  </Badge>
                )}
                {product.isAiRecommended && (
                  <Badge variant="info" size="sm" icon={<Sparkles className="w-3 h-3" />}>
                    AI Pick
                  </Badge>
                )}
              </div>

              {/* Favorite Button */}
              <button
                onClick={handleToggleFavorite}
                className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform z-10"
                aria-label="Add to favorites"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'
                  }`}
                />
              </button>

              {/* Quick Actions (appears on hover) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent"
              >
                <div className="flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    fullWidth
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                  {onQuickView && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleQuickView}
                      className="bg-white/90 hover:bg-white text-gray-900"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>

              {/* Stock Status */}
              {product.stock < 10 && product.stock > 0 && (
                <div className="absolute bottom-3 left-3">
                  <Badge variant="warning" size="sm">
                    Only {product.stock} left
                  </Badge>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-heading font-semibold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors line-clamp-2 min-h-[3.5rem]">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  ({product.reviews})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant={product.stock > 20 ? 'success' : product.stock > 0 ? 'warning' : 'danger'} size="sm">
                  {product.stock > 20 ? 'In Stock' : product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
                </Badge>
              </div>
            </div>
          </CardBody>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

