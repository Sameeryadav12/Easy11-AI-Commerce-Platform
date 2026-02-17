import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Download,
  Mail,
  MapPin,
  Package,
  Truck,
  Calendar,
  ArrowRight,
  Home,
  Sparkles,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../components/ui';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  // Get order data from location state
  const orderData = location.state as {
    orderNumber: string;
    total: number;
    items: any[];
    shippingInfo: any;
    deliveryDays: string;
  } | null;

  // Redirect if no order data
  useEffect(() => {
    if (!orderData) {
      navigate('/');
      return;
    }

    // Trigger confetti
    if (showConfetti) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          setShowConfetti(false);
          return;
        }

        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#1A58D3', '#52D5FF', '#31EE88'],
        });

        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#1A58D3', '#52D5FF', '#31EE88'],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [orderData, navigate, showConfetti]);

  if (!orderData) {
    return null;
  }

  const estimatedDeliveryDate = new Date();
  const daysToAdd = orderData.deliveryDays.includes('-')
    ? parseInt(orderData.deliveryDays.split('-')[1])
    : parseInt(orderData.deliveryDays);
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + daysToAdd + 2);

  // AI-powered recommendations
  const recommendedProducts = [
    { id: '201', name: 'Premium Care Package', price: 29.99, image: '📦', category: 'Services' },
    { id: '202', name: 'Extended Warranty', price: 49.99, image: '🛡️', category: 'Services' },
    { id: '203', name: 'Gift Card $50', price: 50.00, image: '🎁', category: 'Gift Cards' },
    { id: '204', name: 'Tech Accessories Bundle', price: 79.99, image: '🎧', category: 'Accessories' },
  ];

  const handleDownloadInvoice = () => {
    toast.success('Invoice download started!');
    // Implement PDF generation here
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Easy11 Order',
        text: `I just ordered from Easy11! Order #${orderData.orderNumber}`,
        url: window.location.href,
      });
    } else {
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-12">
      <div className="container-custom max-w-4xl">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-teal-500 rounded-full mb-6 shadow-2xl">
            <CheckCircle className="w-14 h-14 text-white" />
          </div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4"
          >
            Order Confirmed! 🎉
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 dark:text-gray-400 mb-2"
          >
            Thank you for your purchase!
          </motion.p>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-700 dark:text-gray-300"
          >
            Order Number:{' '}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {orderData.orderNumber}
            </span>
          </motion.p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button variant="primary" size="lg" onClick={handleDownloadInvoice}>
            <Download className="w-5 h-5 mr-2" />
            Download Invoice
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate(`/orders/${orderData.orderNumber}`)}>
            <Package className="w-5 h-5 mr-2" />
            Track Order
          </Button>
          <Button variant="ghost" size="lg" onClick={handleShareOrder}>
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-8"
        >
          {/* Delivery Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 dark:text-white text-lg">
                  Estimated Delivery
                </h3>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {estimatedDeliveryDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We'll send tracking info to your email
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-teal-200 dark:border-teal-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 dark:text-white text-lg">
                  Order Confirmation
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Sent to: <span className="font-semibold">{orderData.shippingInfo.email}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Check your inbox for order details
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-8">
            <h3 className="font-heading font-bold text-gray-900 dark:text-white text-lg mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              Shipping Address
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-900 dark:text-white font-semibold">
                {orderData.shippingInfo.firstName} {orderData.shippingInfo.lastName}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {orderData.shippingInfo.address}
              </p>
              {orderData.shippingInfo.apartment && (
                <p className="text-gray-700 dark:text-gray-300">
                  {orderData.shippingInfo.apartment}
                </p>
              )}
              <p className="text-gray-700 dark:text-gray-300">
                {orderData.shippingInfo.city}, {orderData.shippingInfo.state}{' '}
                {orderData.shippingInfo.zipCode}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-heading font-bold text-gray-900 dark:text-white text-lg mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-teal-500" />
              Order Items ({orderData.items.length})
            </h3>
            <div className="space-y-3">
              {orderData.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center text-3xl">
                    {item.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Quantity: {Number(item.quantity) || 1}
                    </p>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    ${((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center text-2xl font-bold">
              <span className="text-gray-900 dark:text-white">Order Total</span>
              <span className="text-blue-600 dark:text-blue-400">
                ${orderData.total.toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 md:p-8 border border-purple-200 dark:border-purple-800 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
              Complete Your Experience
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Customers who bought your items also loved these:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-lg transition-all group"
              >
                <div className="text-4xl text-center mb-3">{product.image}</div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white mb-2 text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {product.name}
                </p>
                <p className="text-center font-bold text-blue-600 dark:text-blue-400">
                  ${product.price}
                </p>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Continue Shopping */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center space-y-4"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/products')}
            className="mx-auto"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <div>
            <Link
              to="/"
              className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Return to Homepage</span>
            </Link>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 bg-gray-100 dark:bg-gray-800 rounded-xl p-6 text-center"
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Need Help with Your Order?
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Our support team is here to help you 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="secondary" onClick={() => navigate('/support')}>
              Contact Support
            </Button>
            <Button variant="ghost" onClick={() => navigate('/faq')}>
              View FAQs
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

