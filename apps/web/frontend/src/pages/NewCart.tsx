import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button, Card, CardBody, Badge } from '../components/ui';
import { useCartStore } from '../store/cartStore';

export const NewCart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container-custom">
          <Card className="max-w-2xl mx-auto text-center">
            <CardBody className="py-16">
              <ShoppingBag className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                Your Cart is Empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/products')}
              >
                Start Shopping
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardBody>
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-4xl">{item.image}</span>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link
                            to={`/products/${item.id}`}
                            className="text-lg font-heading font-semibold text-gray-900 dark:text-white hover:text-blue-500 transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            In Stock
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-1 font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ${item.price} each
                          </p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}

            {/* Clear Cart Button */}
            <Button
              variant="ghost"
              onClick={() => {
                if (confirm('Are you sure you want to clear your cart?')) {
                  clearCart();
                }
              }}
              className="w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardBody>
                  <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                    Order Summary
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {shipping === 0 ? (
                          <Badge variant="success" size="sm">FREE</Badge>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${tax.toFixed(2)}
                      </span>
                    </div>
                    
                    {subtotal < 100 && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Add ${(100 - subtotal).toFixed(2)} more for FREE shipping! 🚚
                        </p>
                      </div>
                    )}

                    <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                          Total
                        </span>
                        <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="success"
                    size="lg"
                    fullWidth
                    onClick={() => navigate('/checkout')}
                    className="mb-3"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => navigate('/products')}
                  >
                    Continue Shopping
                  </Button>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                      <Shield className="w-5 h-5 text-teal-500" />
                      <span>Secure checkout with SSL encryption</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                      <RotateCcw className="w-5 h-5 text-teal-500" />
                      <span>30-day hassle-free returns</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCart;

