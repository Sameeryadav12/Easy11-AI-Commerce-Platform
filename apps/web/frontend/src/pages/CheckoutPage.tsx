import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  User,
  MapPin,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Shield,
  Truck,
  Sparkles,
  Lock,
  Mail,
  Phone,
  Home,
  Building,
  MapPinned,
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useRewardsStore } from '../store/rewardsStore';
import { Button, Loading } from '../components/ui';
import toast from 'react-hot-toast';

interface ShippingInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
  billingSame: boolean;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, getSubtotal, getTax, getShipping, getTotal, discountAmount, clearCart } = useCartStore();
  const { points, canRedeemPoints, redeemPoints } = useRewardsStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<'standard' | 'express' | 'sameday'>('standard');
  const [fraudScore, setFraudScore] = useState(95); // AI fraud detection score (0-100, higher is safer)
  const [useRewards, setUseRewards] = useState(false);
  const [rewardPointsToUse, setRewardPointsToUse] = useState(0);

  // Form state
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
    billingSame: true,
  });

  const subtotal = getSubtotal();
  const tax = getTax();
  const shippingCost = getShipping();
  const discount = discountAmount;
  const total = getTotal();

  // Delivery options
  const deliveryOptions = {
    standard: { cost: 0, days: '5-7', label: 'Standard Shipping' },
    express: { cost: 9.99, days: '2-3', label: 'Express Shipping' },
    sameday: { cost: 19.99, days: '1', label: 'Same Day Delivery' },
  };

  // Redirect if cart is empty
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  // Step navigation
  const goToStep = (step: number) => {
    if (step <= currentStep || validateStep(currentStep)) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Sign in
        return true; // Always allow proceeding (guest checkout)
      
      case 2: // Shipping
        const required = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
        const isValid = required.every((field) => shippingInfo[field as keyof ShippingInfo].trim() !== '');
        if (!isValid) {
          toast.error('Please fill in all required shipping fields');
        }
        return isValid;
      
      case 3: // Payment
        const cardValid = paymentInfo.cardNumber.replace(/\s/g, '').length === 16 &&
                          paymentInfo.cardName.trim() !== '' &&
                          paymentInfo.expiryDate.length === 5 &&
                          paymentInfo.cvv.length === 3;
        if (!cardValid) {
          toast.error('Please enter valid payment information');
        }
        return cardValid;
      
      default:
        return true;
    }
  };

  // Place Order
  const handlePlaceOrder = async () => {
    if (!validateStep(3)) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Clear cart
    clearCart();
    
    // Navigate to confirmation
    navigate('/checkout/confirmation', {
      state: {
        orderNumber: `E11-${Date.now().toString().slice(-8)}`,
        total,
        items,
        shippingInfo,
        deliveryDays: deliveryOptions[selectedDelivery].days,
      },
    });
    
    setIsProcessing(false);
  };

  // Step indicators
  const steps = [
    { number: 1, title: 'Sign In', icon: User },
    { number: 2, title: 'Shipping', icon: MapPin },
    { number: 3, title: 'Payment', icon: CreditCard },
    { number: 4, title: 'Review', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Cart</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white">
            Secure Checkout
          </h1>
        </motion.div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -z-10">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-blue-500"
              />
            </div>

            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <button
                  key={step.number}
                  onClick={() => goToStep(step.number)}
                  disabled={step.number > currentStep && !isCompleted}
                  className={`flex flex-col items-center space-y-2 ${
                    step.number > currentStep && !isCompleted
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-teal-500 text-white'
                        : isActive
                        ? 'bg-blue-500 text-white ring-4 ring-blue-200 dark:ring-blue-900'
                        : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      isActive || isCompleted
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Sign In / Guest Checkout */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                      Sign In or Continue as Guest
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Already have an account? Sign in for faster checkout.
                    </p>
                  </div>

                  {user ? (
                    <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {user.name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Welcome back, {user.name}!
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onClick={() => navigate('/login', { state: { from: '/checkout' } })}
                      >
                        <User className="w-5 h-5 mr-2" />
                        Sign In to Your Account
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">
                            OR
                          </span>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Continue as Guest
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          You can checkout without creating an account. We'll send order updates to your email.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Shield className="w-5 h-5 text-teal-500" />
                    <span>Your information is secure and encrypted</span>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="primary" size="lg" onClick={nextStep}>
                      Continue to Shipping
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Shipping Information */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                      Shipping Information
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Where should we deliver your order?
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={shippingInfo.email}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                            placeholder="your@email.com"
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={shippingInfo.phone}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                            placeholder="(555) 123-4567"
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Shipping Address
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                          placeholder="John"
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                          placeholder="Doe"
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Street Address *
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                          placeholder="123 Main Street"
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Apartment, Suite, etc. (optional)
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={shippingInfo.apartment}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, apartment: e.target.value })}
                          placeholder="Apt 4B"
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          placeholder="New York"
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          placeholder="NY"
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                          placeholder="10001"
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Speed */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Delivery Speed
                    </h3>
                    <div className="space-y-3">
                      {(Object.keys(deliveryOptions) as Array<keyof typeof deliveryOptions>).map((key) => {
                        const option = deliveryOptions[key];
                        return (
                          <label
                            key={key}
                            className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedDelivery === key
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="delivery"
                                checked={selectedDelivery === key}
                                onChange={() => setSelectedDelivery(key)}
                                className="form-radio h-5 w-5 text-blue-600"
                              />
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {option.label}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Arrives in {option.days} business days
                                </p>
                              </div>
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {option.cost === 0 ? 'FREE' : `$${option.cost}`}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="ghost" onClick={prevStep}>
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </Button>
                    <Button variant="primary" size="lg" onClick={nextStep}>
                      Continue to Payment
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment Information */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                      Payment Information
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      All transactions are secure and encrypted.
                    </p>
                  </div>

                  {/* AI Fraud Detection Score */}
                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          AI Security Check
                        </span>
                      </div>
                      <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                        {fraudScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${fraudScore}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      ✅ Safe to proceed – Low risk transaction detected
                    </p>
                  </div>

                  {/* Card Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Card Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Card Number *
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                              if (value.replace(/\s/g, '').length <= 16) {
                                setPaymentInfo({ ...paymentInfo, cardNumber: value });
                              }
                            }}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-1">
                            <span className="text-2xl">💳</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                              }
                              if (value.length <= 5) {
                                setPaymentInfo({ ...paymentInfo, expiryDate: value });
                              }
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            CVV *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={paymentInfo.cvv}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 3) {
                                  setPaymentInfo({ ...paymentInfo, cvv: value });
                                }
                              }}
                              placeholder="123"
                              maxLength={3}
                              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                            />
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Card Checkbox */}
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentInfo.saveCard}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, saveCard: e.target.checked })}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Save this card for future purchases
                    </span>
                  </label>

                  {/* Security Notice */}
                  <div className="flex items-start space-x-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <Shield className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-1">
                        PCI-DSS Compliant • 256-bit SSL Encryption
                      </p>
                      <p>
                        Your payment information is processed securely. We do not store credit card details.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="ghost" onClick={prevStep}>
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </Button>
                    <Button variant="primary" size="lg" onClick={nextStep}>
                      Review Order
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review Order */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                      Review Your Order
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Please review your order details before placing it.
                    </p>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Order Items ({items.length})
                    </h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center text-3xl">
                            {item.image}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Shipping Address
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <span className="block">{shippingInfo.firstName} {shippingInfo.lastName}</span>
                        <span className="block">{shippingInfo.address}</span>
                        {shippingInfo.apartment && <span className="block">{shippingInfo.apartment}</span>}
                        <span className="block">
                          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                        </span>
                        <span className="block">{shippingInfo.email}</span>
                      </p>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Payment Method
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <span className="block">Card ending in {paymentInfo.cardNumber.slice(-4)}</span>
                        <span className="block">{paymentInfo.cardName}</span>
                        <span className="block">Expires {paymentInfo.expiryDate}</span>
                      </p>
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Delivery */}
                  <div className="p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Truck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {deliveryOptions[selectedDelivery].label}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Estimated delivery: {deliveryOptions[selectedDelivery].days} business days
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {deliveryOptions[selectedDelivery].cost === 0 ? 'FREE' : `$${deliveryOptions[selectedDelivery].cost}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="ghost" onClick={prevStep}>
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loading size="sm" />
                          <span className="ml-2">Processing...</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-5 h-5 mr-2" />
                          Place Secure Order
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky top-24 space-y-4"
            >
              <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                Order Summary
              </h3>

              {/* Items */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 text-sm">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                      {item.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-teal-600 dark:text-teal-400">
                    <span>Discount</span>
                    <span className="font-semibold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                {/* Rewards Redemption */}
                {user && points >= 500 && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 -mx-2">
                    <label className="flex items-center space-x-2 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={useRewards}
                        onChange={(e) => {
                          setUseRewards(e.target.checked);
                          if (e.target.checked) {
                            const maxPoints = Math.min(points, Math.floor(subtotal * 100));
                            setRewardPointsToUse(Math.min(maxPoints, 5000));
                          } else {
                            setRewardPointsToUse(0);
                          }
                        }}
                        className="form-checkbox h-4 w-4 text-purple-600 rounded"
                      />
                      <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                        Use EasyPoints? ({points} available)
                      </span>
                    </label>
                    {useRewards && (
                      <div className="mt-2">
                        <input
                          type="range"
                          min="500"
                          max={Math.min(points, 5000)}
                          step="100"
                          value={rewardPointsToUse}
                          onChange={(e) => setRewardPointsToUse(parseInt(e.target.value))}
                          className="w-full h-2 bg-purple-200 dark:bg-purple-800 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-purple-700 dark:text-purple-300">
                            {rewardPointsToUse} pts
                          </span>
                          <span className="text-purple-900 dark:text-purple-100 font-bold">
                            -${(rewardPointsToUse / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {useRewards && rewardPointsToUse > 0 && (
                  <div className="flex justify-between text-purple-600 dark:text-purple-400">
                    <span>Rewards Discount</span>
                    <span className="font-semibold">-${(rewardPointsToUse / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-teal-600 dark:text-teal-400">FREE</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xl font-bold text-gray-900 dark:text-white pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                <span>Total</span>
                <span className="text-2xl text-blue-600 dark:text-blue-400">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Trust Badges */}
              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="w-4 h-4 text-teal-500" />
                  <span>SSL Secure Checkout</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span>Free Returns • 30 Days</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span>AI-Verified Safe Transaction</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

