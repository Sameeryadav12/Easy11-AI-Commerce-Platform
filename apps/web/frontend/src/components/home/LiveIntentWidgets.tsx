import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ShoppingCart, TrendingUp, ArrowRight } from 'lucide-react';
import { useRecentlyViewedStore } from '../../store/recentlyViewedStore';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui';

/** Hours after signup during which we treat the user as "new" and hide session-based widgets (business tactics: fresh start). */
const NEW_SIGNUP_FRESH_START_HOURS = 24;

interface LiveIntentWidgetsProps {
  /** When true, render only the grid (no section/container); used inside merged "For you" area */
  embedded?: boolean;
}

export default function LiveIntentWidgets({ embedded }: LiveIntentWidgetsProps = {}) {
  const user = useAuthStore((state) => state.user);
  const recentProducts = useRecentlyViewedStore((state) => state.getRecent(4));
  const { items, getTotal, openDrawer } = useCartStore();
  const cartTotal = getTotal();

  // Business tactics: new signups get a fresh start — don't show "Because you viewed" so they aren't
  // shown pre-signup session data or an empty state that implies prior browsing.
  const isNewSignup = useMemo(() => {
    if (!user?.createdAt) return false;
    const created = new Date(user.createdAt).getTime();
    const cutoff = Date.now() - NEW_SIGNUP_FRESH_START_HOURS * 60 * 60 * 1000;
    return created >= cutoff;
  }, [user?.createdAt]);

  // Only show "Because you viewed" when logged in and not a new signup (hidden for guests and new users)
  const showBecauseYouViewed = !!user && recentProducts.length > 0 && !isNewSignup;

  // Don't show if no data (and for guests/new signups we hide "Because you viewed")
  if (!showBecauseYouViewed && items.length === 0) {
    return null;
  }

  const grid = (
    <div className="grid md:grid-cols-2 gap-6">
          {/* Recently Viewed — hidden for new signups (fresh start; business tactics) */}
          {showBecauseYouViewed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                      Because you viewed
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pick up where you left off
                    </p>
                  </div>
                </div>
                <Link
                  to="/products"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  View All →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {recentProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="text-5xl mb-3 text-center">{product.image}</div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </p>
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      ${product.price.toFixed(2)}
                    </p>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Resume Your Cart */}
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl p-6 shadow-xl text-white"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold">Resume Your Cart</h3>
                  <p className="text-sm text-white/80">
                    {items.length} item{items.length > 1 ? 's' : ''} waiting for you
                  </p>
                </div>
              </div>

              {/* Cart Preview */}
              <div className="space-y-2 mb-6">
                {items.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 bg-white/10 rounded-lg p-3"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                      {item.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.name}</p>
                      <p className="text-xs text-white/80">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {items.length > 2 && (
                  <p className="text-xs text-white/80 text-center">
                    + {items.length - 2} more item{items.length - 2 > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Total & CTA */}
              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Cart Total:</span>
                  <span className="text-2xl font-bold">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                variant="secondary"
                size="lg"
                className="w-full bg-white text-blue-600 hover:bg-gray-100"
                onClick={openDrawer}
              >
                View Cart & Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}
        </div>
  );

  if (embedded) {
    return grid;
  }
  return (
    <div className="section bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">{grid}</div>
    </div>
  );
}

