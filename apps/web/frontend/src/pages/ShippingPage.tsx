import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Clock, MapPin, Package, Shield, DollarSign, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FREE_STANDARD_SHIPPING_LABEL } from '../utils/shippingConstants';

/**
 * Shipping & Returns Page
 * 
 * Comprehensive information about shipping options, delivery times, costs, and return policies.
 * Features:
 * - Estimated delivery calculator
 * - Shipping options and costs
 * - Return policy with accordion
 * - Refund clarification
 * - Order cancellation, damaged item policies
 * - Return status tracking
 * - International shipping with legal disclaimer
 */
export default function ShippingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [postcode, setPostcode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [freeReturnsExpanded, setFreeReturnsExpanded] = useState(false);
  const [returnStepOpen, setReturnStepOpen] = useState<number | null>(0);
  const [returnNumber, setReturnNumber] = useState('');
  const fromParam = searchParams.get('from');
  const fromSupport = fromParam === 'support' || fromParam === 'account-support';
  const supportBackUrl = fromParam === 'account-support' ? '/account/support' : '/support';

  const shippingOptions = [
    {
      name: 'Standard Shipping',
      price: '$4.99',
      freeThreshold: FREE_STANDARD_SHIPPING_LABEL,
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
      note: 'Cut-off time: 2pm local time (business days)',
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

  const handleDeliveryEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) return;
    setIsCalculating(true);
    setDeliveryEstimate(null);
    setTimeout(() => {
      const zip = postcode.trim().replace(/\D/g, '').slice(0, 5);
      const isRemote = zip.startsWith('99') || zip.length < 5;
      const baseDays = isRemote ? 8 : 6;
      const d = new Date();
      d.setDate(d.getDate() + 2 + baseDays);
      const d2 = new Date();
      d2.setDate(d2.getDate() + 2 + baseDays + 2);
      setDeliveryEstimate(`${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – ${d2.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`);
      setIsCalculating(false);
    }, 800);
  };

  const returnSteps = [
    { step: 1, title: 'Initiate Return', description: 'Log into your account, go to "Orders," and select the item you want to return. Click "Return Item" and follow the prompts.', icon: Package },
    { step: 2, title: 'Print Return Label', description: "We'll provide you with a prepaid return shipping label. Print it and attach it to your package.", icon: Package },
    { step: 3, title: 'Package Item', description: 'Place the item in its original packaging with all tags attached. Include the return form if provided.', icon: Package },
    { step: 4, title: 'Ship Back', description: 'Drop off your package at any carrier location or schedule a pickup. Keep your tracking number for reference.', icon: Truck },
    { step: 5, title: 'Receive Refund', description: "Once we receive and inspect your return, we'll process your refund within 5-7 business days.", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back to Support when opened from Support */}
      {fromSupport && (
        <div className="container-custom pt-4 pb-0">
          <Link
            to={supportBackUrl}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← Back to Support
          </Link>
        </div>
      )}
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

      {/* Top navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
        <div className="container-custom py-3">
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
            <a href="#shipping" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              Shipping
            </a>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <a href="#returns" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              Returns
            </a>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <a href="#refunds" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              Refunds
            </a>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <a href="#international" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              International
            </a>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <a href="#faqs" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              FAQs
            </a>
          </div>
        </div>
      </nav>

      <div className="container-custom py-12">
        {/* Shipping Options */}
        <section id="shipping" className="mb-16 scroll-mt-24">
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
                    {'note' in option && option.note && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {option.note}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
              Delivery times are estimates. Remote areas may take longer.
            </p>

            {/* Estimated Delivery Calculator */}
            <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Estimated Delivery</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Enter your postcode to see delivery estimate for standard shipping</p>
              <form onSubmit={handleDeliveryEstimate} className="flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="Enter postcode (e.g. 94105)"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Postcode for delivery estimate"
                />
                <button
                  type="submit"
                  disabled={isCalculating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70"
                >
                  {isCalculating ? 'Calculating…' : 'Get Estimate'}
                </button>
              </form>
              {deliveryEstimate && (
                <p className="mt-3 text-sm font-semibold text-green-700 dark:text-green-400">
                  Delivery by {deliveryEstimate}
                </p>
              )}
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

        {/* Shipping Restrictions Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-16 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Note:</strong> Some products may ship separately. Delivery times may vary during peak seasons (e.g., holidays).
            </p>
          </div>
        </motion.div>

        {/* International Shipping */}
        <section id="international" className="mb-16 scroll-mt-24">
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
              We ship worldwide! Delivery times and costs vary by region.
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
                <div className="text-sm text-amber-800 dark:text-amber-300 space-y-1">
                  <p><strong>Legal disclaimer:</strong> The customer is responsible for all customs duties, VAT, and import taxes imposed by the destination country. These charges are not included in the shipping cost.</p>
                  <p>Easy11 is not responsible for customs delays or any fees levied by customs authorities.</p>
                </div>
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

            {/* Return Status Tracking */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Track Your Return Status</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (returnNumber.trim()) navigate(`/track-order?from=shipping&order=${encodeURIComponent(returnNumber.trim())}`);
                }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="text"
                  value={returnNumber}
                  onChange={(e) => setReturnNumber(e.target.value)}
                  placeholder="Enter return number"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  aria-label="Return number for tracking"
                />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                  Track Return
                </button>
              </form>
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
        <section id="returns" className="mb-16 scroll-mt-24">
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
                const isFreeReturns = policy.title === 'Free Returns';
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
                      <div className="flex-1">
                        {isFreeReturns ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setFreeReturnsExpanded(!freeReturnsExpanded)}
                              className="flex items-center gap-2 w-full text-left font-semibold text-gray-900 dark:text-white mb-2"
                            >
                              {policy.title}
                              {freeReturnsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">{policy.description}</p>
                            <AnimatePresence>
                              {freeReturnsExpanded && (
                                <motion.ul
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1"
                                >
                                  <li>Items under $500</li>
                                  <li>Non-clearance items</li>
                                  <li>Within 30 days of delivery</li>
                                  <li>US orders only (international returns: customer pays shipping)</li>
                                </motion.ul>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{policy.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{policy.description}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Refund Method Clarification */}
        <section id="refunds" className="mb-16 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
              Refund Methods & Timing
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Refunds are issued to the original payment method, or as store credit if you select that option.</p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Credit card: 3–5 business days</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> PayPal: 1–3 business days</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Bank transfer: 5–10 business days</li>
            </ul>
          </motion.div>
        </section>

        {/* Return Exceptions */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.67 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4">Non-Returnable Items</h2>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Personalized or custom-made items</li>
              <li>• Digital downloads</li>
              <li>• Gift cards</li>
              <li>• Hygiene products (if opened)</li>
            </ul>
          </motion.div>
        </section>

        {/* Order Cancellation Policy */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.69 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4">Order Cancellation</h2>
            <p className="text-gray-600 dark:text-gray-400">Orders can be cancelled within 1 hour of placement. After processing begins, cancellation may not be possible—please contact support to check.</p>
          </motion.div>
        </section>

        {/* Damaged / Wrong Item Policy */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.71 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4">Damaged or Wrong Item</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">If your item arrives damaged or incorrect:</p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Report within 48 hours of delivery</li>
              <li>• Upload photos of the damage or wrong item</li>
              <li>• We'll provide a replacement or full refund</li>
            </ul>
            <Link to="/contact?from=support&type=wrong-item" className="inline-block mt-3 text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Report damaged or wrong item →
            </Link>
          </motion.div>
        </section>

        {/* How to Return - Accordion */}
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
            <div className="space-y-2">
              {returnSteps.map((item) => {
                const Icon = item.icon;
                const isOpen = returnStepOpen === item.step;
                return (
                  <div key={item.step} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setReturnStepOpen(isOpen ? null : item.step)}
                      className="flex items-center gap-4 w-full p-4 text-left bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white flex-1">{item.title}</span>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 pl-16 text-gray-600 dark:text-gray-400 text-sm">
                            {item.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* FAQs Section */}
        <section id="faqs" className="mb-16 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85 }}
          >
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Shipping & Returns FAQs
            </h2>
            <div className="space-y-4">
              {[
                { q: 'How long does standard shipping take?', a: 'Standard shipping typically takes 5-7 business days within the US.' },
                { q: 'Can I cancel my order?', a: 'Yes, orders can be cancelled within 1 hour of placement.' },
                { q: 'How do I track my return?', a: 'Use the return number provided in your return confirmation email to track status.' },
                { q: 'Who pays for international return shipping?', a: 'The customer pays for return shipping on international orders.' },
              ].map((faq, i) => (
                <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{faq.q}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                to="/faq?from=shipping"
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                View all FAQs →
              </Link>
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
            <Link
              to="/contact?from=shipping"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              to="/faq?from=shipping"
              className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              View FAQ
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

