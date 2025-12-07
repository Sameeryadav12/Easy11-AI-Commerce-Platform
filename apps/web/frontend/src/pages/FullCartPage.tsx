import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Shield, Truck, ArrowLeft, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui';
import { useCartStore } from '../store/cartStore';
import { useState } from 'react';

export default function FullCartPage() {
  const navigate = useNavigate();
  const {
    items,
    removeItem,
    updateQuantity,
    discountCode,
    applyDiscount,
    removeDiscount,
    getTotalItems,
    getSubtotal,
    getTax,
    getShipping,
    getTotal,
  } = useCartStore();

  const [discountInput, setDiscountInput] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const subtotal = getSubtotal();
  const tax = getTax();
  const shipping = getShipping();
  const discount = useCartStore((state) => state.discountAmount);
  const total = getTotal();

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast.success(`${name} removed from cart`, {
      icon: '🗑️',
    });
  };

  const handleApplyDiscount = () => {
    if (!discountInput.trim()) {
      toast.error('Please enter a discount code');
      return;
    }

    setIsApplyingDiscount(true);
    setTimeout(() => {
      applyDiscount(discountInput);
      const newDiscount = useCartStore.getState().discountCode;
      
      if (newDiscount) {
        toast.success('Discount code applied!', {
          icon: '🎉',
        });
        setDiscountInput('');
      } else {
        toast.error('Invalid discount code');
      }
      setIsApplyingDiscount(false);
    }, 500);
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  // AI-powered product recommendations based on cart
  const recommendedProducts = [
    { id: '101', name: 'Wireless Mouse Pro', price: 29.99, image: '🖱️', category: 'Accessories' },
    { id: '102', name: 'USB-C Hub', price: 49.99, image: '🔌', category: 'Accessories' },
    { id: '103', name: 'Laptop Stand', price: 39.99, image: '💻', category: 'Accessories' },
    { id: '104', name: 'Webcam HD', price: 79.99, image: '📷', category: 'Electronics' },
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ShoppingBag className="w-24 h-24 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Start shopping to find amazing deals!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/')}>
                Go to Homepage
              </Button>
            </div>
          </motion.div>

          {/* Show recommendations even with empty cart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Popular Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="text-5xl text-center mb-3">{product.image}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                    {product.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-bold">
                    ${product.price.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-5xl md:text-6xl">{item.image}</span>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link
                          to={`/products/${item.id}`}
                          className="font-semibold text-lg text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {item.category}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                      </button>
                    </div>

                    {/* Price & Stock */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {item.stock <= 5 && (
                        <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                          Only {item.stock} left!
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                        <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                      </div>

                      {/* Item Subtotal */}
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Subtotal</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    {item.deliveryDays && (
                      <div className="flex items-center space-x-2 mt-3 text-sm text-teal-600 dark:text-teal-400">
                        <Truck className="w-4 h-4" />
                        <span>Arrives in {item.deliveryDays} days</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-heading font-bold text-gray-900 dark:text-white">
                  Complete Your Setup
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Customers who bought these items also added:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {recommendedProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="bg-white dark:bg-gray-800 rounded-lg p-3 hover:shadow-md transition-shadow group"
                  >
                    <div className="text-3xl text-center mb-2">{product.image}</div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white mb-1 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      ${product.price}
                    </p>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky top-24 space-y-6"
            >
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                Order Summary
              </h2>

              {/* Discount Code */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Discount Code
                </label>
                {discountCode ? (
                  <div className="flex items-center justify-between bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-3">
                    <span className="font-semibold text-teal-700 dark:text-teal-300">
                      {discountCode}
                    </span>
                    <button
                      onClick={removeDiscount}
                      className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={discountInput}
                      onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
                    />
                    <Button
                      variant="secondary"
                      onClick={handleApplyDiscount}
                      disabled={isApplyingDiscount}
                    >
                      {isApplyingDiscount ? 'Applying...' : 'Apply'}
                    </Button>
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Try: EASY10, EASY20, WELCOME, SAVE50
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-teal-600 dark:text-teal-400">
                    <span>Discount</span>
                    <span className="font-semibold">-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-teal-600 dark:text-teal-400">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Tax (8%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center text-xl font-bold text-gray-900 dark:text-white pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                <span>Total</span>
                <span className="text-2xl text-blue-600 dark:text-blue-400">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {/* Trust Badges */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="w-5 h-5 text-teal-500" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <span>Free shipping on orders over $100</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">We accept:</p>
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold">
                    💳 VISA
                  </div>
                  <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold">
                    💳 MC
                  </div>
                  <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold">
                    🅿️ PayPal
                  </div>
                  <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold">
                    🍎 Pay
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

