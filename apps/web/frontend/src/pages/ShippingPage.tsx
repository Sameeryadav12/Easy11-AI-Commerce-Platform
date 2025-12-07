import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, Package, Shield, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Shipping & Returns Page
 * 
 * Comprehensive information about shipping options, delivery times, costs, and return policies.
 * Features:
 * - Shipping options and costs
 * - Delivery timeframes
 * - International shipping
 * - Order tracking
 * - Return policy
 * - FAQ section
 */
export default function ShippingPage() {
  const shippingOptions = [
    {
      name: 'Standard Shipping',
      price: '$4.99',
      freeThreshold: 'Free on orders over $50',
      deliveryTime: '5-7 business days',
      description: 'Our most economical shipping option. Perfect for non-urgent orders.',
      icon: Package,
      color: 'blue',
    },
    {
      name: 'Express Shipping',
      price: '$9.99',
      freeThreshold: 'Free on orders over $100',
      deliveryTime: '2-3 business days',
      description: 'Get your order faster with our express shipping option.',
      icon: Truck,
      color: 'green',
    },
    {
      name: 'Overnight Shipping',
      price: '$19.99',
      freeThreshold: 'Not available for free shipping',
      deliveryTime: 'Next business day',
      description: 'Need it tomorrow? Overnight shipping ensures next-day delivery.',
      icon: Clock,
      color: 'purple',
    },
  ];

  const returnPolicy = [
    {
      title: '30-Day Return Window',
      description: 'You have 30 days from the delivery date to return most items for a full refund.',
      icon: Clock,
    },
    {
      title: 'Original Condition Required',
      description: 'Items must be unused, in original packaging, and with all tags attached.',
      icon: Package,
    },
    {
      title: 'Free Returns',
      description: 'We provide free return shipping labels for eligible returns within the US.',
      icon: DollarSign,
    },
    {
      title: 'Refund Processing',
      description: 'Refunds are processed within 5-7 business days after we receive your return.',
      icon: CheckCircle,
    },
  ];

  const internationalShipping = [
    {
      region: 'Canada & Mexico',
      deliveryTime: '7-10 business days',
      cost: 'Starting at $14.99',
    },
    {
      region: 'Europe',
      deliveryTime: '10-14 business days',
      cost: 'Starting at $24.99',
    },
    {
      region: 'Asia Pacific',
      deliveryTime: '14-21 business days',
      cost: 'Starting at $29.99',
    },
    {
      region: 'Other Regions',
      deliveryTime: '14-28 business days',
      cost: 'Varies by location',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Truck className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Shipping & Returns
            </h1>
            <p className="text-blue-100 text-lg">
              Fast, reliable shipping options and hassle-free returns. We've got you covered.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Shipping Options */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8 text-center">
              Shipping Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {shippingOptions.map((option, index) => {
                const Icon = option.icon;
                const colorClasses = {
                  blue: {
                    bg: 'bg-blue-100 dark:bg-blue-900/30',
                    text: 'text-blue-600 dark:text-blue-400',
                  },
                  green: {
                    bg: 'bg-green-100 dark:bg-green-900/30',
                    text: 'text-green-600 dark:text-green-400',
                  },
                  purple: {
                    bg: 'bg-purple-100 dark:bg-purple-900/30',
                    text: 'text-purple-600 dark:text-purple-400',
                  },
                };
                const colors = colorClasses[option.color as keyof typeof colorClasses] || colorClasses.blue;
                return (
                  <motion.div
                    key={option.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className={`p-3 ${colors.bg} rounded-lg w-fit mb-4`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                      {option.name}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {option.price}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {option.freeThreshold}
                      </p>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {option.deliveryTime}
                      </p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {option.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8 text-center">
              How Shipping Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Place Order', description: 'Add items to cart and checkout securely' },
                { step: '2', title: 'Processing', description: 'We prepare your order (1-2 business days)' },
                { step: '3', title: 'Shipping', description: 'Your order ships with tracking information' },
                { step: '4', title: 'Delivery', description: 'Receive your order at your doorstep' },
              ].map((item, index) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* International Shipping */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                International Shipping
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We ship worldwide! Delivery times and costs vary by region. Additional customs fees and import taxes may apply depending on your country's regulations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {internationalShipping.map((region) => (
                <div
                  key={region.region}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {region.region}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <strong>Delivery:</strong> {region.deliveryTime}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Cost:</strong> {region.cost}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>Note:</strong> International orders may be subject to customs duties, taxes, and fees imposed by the destination country. These charges are the responsibility of the customer and are not included in the shipping cost.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Order Tracking */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                Track Your Order
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  How to Track
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Check your email for tracking information after your order ships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Log into your account and visit the "Orders" section</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Use the tracking number provided to track on the carrier's website</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Delivery Updates
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Receive email notifications at each shipping milestone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>SMS updates available for express and overnight orders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Estimated delivery date provided at checkout</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Return Policy */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                Return Policy
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {returnPolicy.map((policy, index) => {
                const Icon = policy.icon;
                return (
                  <motion.div
                    key={policy.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {policy.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {policy.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* How to Return */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              How to Return an Item
            </h2>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Initiate Return', description: 'Log into your account, go to "Orders," and select the item you want to return. Click "Return Item" and follow the prompts.' },
                { step: '2', title: 'Print Return Label', description: 'We\'ll provide you with a prepaid return shipping label. Print it and attach it to your package.' },
                { step: '3', title: 'Package Item', description: 'Place the item in its original packaging with all tags attached. Include the return form if provided.' },
                { step: '4', title: 'Ship Back', description: 'Drop off your package at any carrier location or schedule a pickup. Keep your tracking number for reference.' },
                { step: '5', title: 'Receive Refund', description: 'Once we receive and inspect your return, we\'ll process your refund within 5-7 business days.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Need Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-xl border border-blue-200 dark:border-blue-800 text-center"
        >
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            Questions About Shipping or Returns?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Our support team is here to help with any shipping or return questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/faq"
              className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              View FAQ
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

