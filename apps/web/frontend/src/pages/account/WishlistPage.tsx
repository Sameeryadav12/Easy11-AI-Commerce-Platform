import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, TrendingDown, AlertCircle } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../../components/ui';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { items, removeItem, getPriceDropAlerts } = useWishlistStore();
  const { addItem } = useCartStore();

  const priceDropAlerts = getPriceDropAlerts();

  const handleAddToCart = (item: typeof items[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      category: item.category,
      stock: 100,
      deliveryDays: 2,
    }, 1);
    
    toast.success(`${item.name} added to cart!`, {
      icon: '🛒',
    });
  };

  const handleRemove = (id: string, name: string) => {
    removeItem(id);
    toast.success(`${name} removed from wishlist`);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
          My Wishlist
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {items.length} item{items.length !== 1 ? 's' : ''} saved for later
        </p>
      </div>

      {/* Price Drop Alerts */}
      {priceDropAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 mb-6"
        >
          <div className="flex items-start space-x-3">
            <TrendingDown className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-heading font-bold text-gray-900 dark:text-white mb-2">
                Price Drop Alert! 🎉
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                {priceDropAlerts.length} item{priceDropAlerts.length !== 1 ? 's' : ''} in your
                wishlist {priceDropAlerts.length !== 1 ? 'are' : 'is'} likely to drop in price soon
              </p>
              <div className="flex flex-wrap gap-2">
                {priceDropAlerts.map((item) => (
                  <span
                    key={item.id}
                    className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm font-medium"
                  >
                    {item.name} ({item.priceDropPrediction}%)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Wishlist Items */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-shadow"
            >
              {/* Product Image */}
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 h-48 flex items-center justify-center">
                <span className="text-6xl">{item.image}</span>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {item.originalPrice && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                      SALE
                    </span>
                  )}
                  {!item.inStock && (
                    <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded">
                      OUT OF STOCK
                    </span>
                  )}
                  {item.priceDropPrediction && item.priceDropPrediction >= 70 && (
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded flex items-center space-x-1">
                      <TrendingDown className="w-3 h-3" />
                      <span>PRICE DROP</span>
                    </span>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.id, item.name)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-50 dark:hover:bg-red-900/20"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link
                  to={`/products/${item.id}`}
                  className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2 block"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.category}</p>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ${item.price.toFixed(2)}
                  </span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {item.originalPrice && (
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                      OFF
                    </span>
                  )}
                </div>

                {/* Added Date */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Added{' '}
                  {new Date(item.addedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>

                {/* Actions */}
                {item.inStock ? (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" className="w-full" disabled>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Out of Stock
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center"
        >
          <Heart className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding products you love to your wishlist
          </p>
          <Link to="/products">
            <Button variant="primary">Browse Products</Button>
          </Link>
        </motion.div>
      )}

      {/* AI Recommendations */}
      {items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
        >
          <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            You might also like
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: '201', name: 'Wireless Keyboard', price: 79.99, image: '⌨️' },
              { id: '202', name: 'Monitor Stand', price: 49.99, image: '🖥️' },
              { id: '203', name: 'Desk Lamp', price: 39.99, image: '💡' },
              { id: '204', name: 'Cable Organizer', price: 19.99, image: '📎' },
            ].map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl text-center mb-2">{product.image}</div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate">
                  {product.name}
                </p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  ${product.price}
                </p>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

