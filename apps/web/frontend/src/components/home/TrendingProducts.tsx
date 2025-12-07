import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, Star, Heart, ShoppingCart } from 'lucide-react';
import { Card, CardBody, Badge, Button } from '../ui';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  badgeType?: 'success' | 'warning' | 'info';
}

/**
 * Trending Products Component
 * 
 * Displays popular products with AI-powered recommendations.
 * Features horizontal scrollable carousel with hover effects.
 */
export const TrendingProducts: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Sample trending products (will be fetched from API)
  const products: Product[] = [
    {
      id: '1',
      name: 'Wireless Headphones Pro',
      price: 299.99,
      originalPrice: 399.99,
      rating: 4.8,
      reviews: 1234,
      image: '🎧',
      badge: 'Best Seller',
      badgeType: 'success',
    },
    {
      id: '2',
      name: 'Smart Watch Ultra',
      price: 599.99,
      rating: 4.9,
      reviews: 892,
      image: '⌚',
      badge: 'New Arrival',
      badgeType: 'info',
    },
    {
      id: '3',
      name: 'Designer Backpack',
      price: 129.99,
      originalPrice: 179.99,
      rating: 4.7,
      reviews: 2103,
      image: '🎒',
      badge: 'Trending',
      badgeType: 'warning',
    },
    {
      id: '4',
      name: 'Premium Speaker',
      price: 449.99,
      rating: 4.6,
      reviews: 567,
      image: '🔊',
      badge: 'Hot Deal',
      badgeType: 'success',
    },
    {
      id: '5',
      name: 'Laptop Pro 15"',
      price: 1299.99,
      rating: 4.9,
      reviews: 745,
      image: '💻',
      badge: 'Editor\'s Choice',
      badgeType: 'info',
    },
    {
      id: '6',
      name: 'Fitness Tracker',
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.5,
      reviews: 1891,
      image: '📊',
      badge: 'Great Value',
      badgeType: 'success',
    },
    {
      id: '7',
      name: 'Wireless Mouse',
      price: 49.99,
      rating: 4.7,
      reviews: 3210,
      image: '🖱️',
    },
    {
      id: '8',
      name: 'Phone Case Premium',
      price: 34.99,
      rating: 4.6,
      reviews: 5432,
      image: '📱',
    },
  ];

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  return (
    <section className="section bg-white dark:bg-gray-800" ref={ref}>
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12"
        >
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                Trending Now
              </h2>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Popular products loved by our customers
            </p>
          </div>
          <Link to="/products?sort=trending">
            <Button variant="ghost" className="mt-4 md:mt-0">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card hover className="group cursor-pointer h-full relative overflow-hidden">
                <CardBody className="p-0">
                  {/* Product Image */}
                  <div className="relative">
                    <Link to={`/products/${product.id}`}>
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden">
                        <motion.span
                          className="text-8xl"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {product.image}
                        </motion.span>
                      </div>
                    </Link>

                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-3 left-3">
                        <Badge variant={product.badgeType || 'success'} size="sm">
                          {product.badge}
                        </Badge>
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(product.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
                      aria-label="Add to favorites"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          favorites.has(product.id)
                            ? 'text-red-500 fill-red-500'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>

                    {/* Quick Add to Cart (appears on hover) */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Button
                        variant="success"
                        size="sm"
                        fullWidth
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to cart logic
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Quick Add
                      </Button>
                    </motion.div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-heading font-semibold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

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
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                        ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
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
                      {product.originalPrice && (
                        <Badge variant="success" size="sm">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/products?sort=trending">
            <Button variant="primary" size="lg">
              View All Trending Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;

