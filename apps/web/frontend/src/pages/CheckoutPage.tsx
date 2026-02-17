import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
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
import { useOrdersStore, type Order } from '../store/ordersStore';
import { useAddressStore } from '../store/addressStore';
import { usePaymentStore } from '../store/paymentStore';
import { Button, Loading } from '../components/ui';
import toast from 'react-hot-toast';
import type { Address } from '../types/dashboard';
import {
  validateCardNumber,
  validateCardholderName,
  validateExpiry,
  validateCVV,
  detectCardBrand,
  cvvLengthForBrand,
  type CardBrand,
} from '../utils/cardValidation';
import { validateShippingForm } from '../utils/checkoutValidation';
import { computeOrderPoints } from '../utils/rewardsConstants';
import { createOrder as createOrderAPI } from '../services/ordersAPI';
import { FREE_STANDARD_SHIPPING_THRESHOLD } from '../utils/shippingConstants';
import { TIER_POINTS_MULTIPLIER } from '../store/rewardsStore';

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
  const { items, getSubtotal, discountAmount, discountCode, clearCart } = useCartStore();
  const { points, canRedeemPoints, redeemPoints, addPendingPoints, tier } = useRewardsStore();
  const addOrder = useOrdersStore((s) => s.addOrder);
  const orders = useOrdersStore((s) => s.orders);
  const addAddress = useAddressStore((s) => s.addAddress);
  const addresses = useAddressStore((s) => s.addresses);
  const paymentMethods = usePaymentStore((s) => s.methods);
  const addPaymentMethod = usePaymentStore((s) => s.addMethod);

  // Selected saved address (null = use form / new address)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const hasPrefilledStep2 = useRef(false);
  
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

  // selectedPaymentMethodId: null = enter new card; string = use saved card; undefined = use computed default
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null | undefined>(undefined);

  // Compute default: default card, else newest, else null (Enter new card)
  const defaultPaymentMethodId =
    paymentMethods.length > 0
      ? (paymentMethods.find((m) => m.is_default) ||
          [...paymentMethods].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0])?.id ?? null
      : null;
  const effectivePaymentMethodId = selectedPaymentMethodId ?? defaultPaymentMethodId;
  const [cardErrors, setCardErrors] = useState<{ cardNumber?: string; cardName?: string; expiryDate?: string; cvv?: string }>({});
  const [shippingErrors, setShippingErrors] = useState<Partial<Record<string, string>>>({});
  const lastSubmitTime = useRef(0);
  const SUBMIT_COOLDOWN_MS = 3000;

  const subtotal = Math.max(0, Number(getSubtotal()) || 0);
  const discount = Math.max(0, Number(discountAmount) || 0);

  // Delivery options - customer chooses; shipping cost comes from selection
  const deliveryOptions = {
    standard: { cost: 0, days: '5-7', label: 'Standard Shipping' },
    express: { cost: 9.99, days: '2-3', label: 'Express Shipping' },
    sameday: { cost: 19.99, days: '1', label: 'Same Day Delivery' },
  };

  // Shipping cost from customer's chosen delivery option (free standard over threshold)
  const selectedOption = deliveryOptions[selectedDelivery] ?? deliveryOptions.standard;
  const shippingCost =
    selectedDelivery === 'standard' && subtotal >= FREE_STANDARD_SHIPPING_THRESHOLD ? 0 : selectedOption.cost;

  // Australia GST: 10% on (subtotal - discount + shipping) — product and shipping are taxable
  const taxableAmount = Math.max(0, subtotal - discount + shippingCost);
  const tax = Math.round(taxableAmount * 0.1 * 100) / 100;
  const total = Math.max(0, subtotal - discount + shippingCost + tax);

  // Redirect if cart is empty
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  // Pre-fill with default saved address only when first entering step 2 (don't overwrite "Enter new address")
  useEffect(() => {
    if (currentStep === 2 && addresses.length > 0 && !hasPrefilledStep2.current) {
      hasPrefilledStep2.current = true;
      const defaultAddr = addresses.find((a) => a.is_default_shipping) || addresses[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        const [firstName, ...rest] = defaultAddr.full_name.split(' ');
        const lastName = rest.join(' ') || '';
        setShippingInfo((prev) => ({
          ...prev,
          firstName: firstName || prev.firstName,
          lastName,
          phone: defaultAddr.phone || prev.phone,
          address: defaultAddr.line1,
          apartment: defaultAddr.line2 || '',
          city: defaultAddr.city,
          state: defaultAddr.state,
          zipCode: defaultAddr.postal_code,
          country: defaultAddr.country || prev.country,
        }));
      }
    }
    if (currentStep !== 2) {
      hasPrefilledStep2.current = false;
    }
  }, [currentStep, addresses]);

  // Populate shipping form from a saved address
  const applyAddressToForm = (addr: Address) => {
    const [firstName, ...rest] = addr.full_name.split(' ');
    const lastName = rest.join(' ') || '';
    setShippingInfo((prev) => ({
      ...prev,
      firstName: firstName || prev.firstName,
      lastName,
      phone: addr.phone || prev.phone,
      address: addr.line1,
      apartment: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      zipCode: addr.postal_code,
      country: addr.country || prev.country,
    }));
  };

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
        const result = validateShippingForm(shippingInfo);
        setShippingErrors(result.errors);
        if (result.valid) {
          setShippingInfo((prev) => ({ ...prev, ...result.sanitized }));
          setShippingErrors({});
        } else {
          const firstErr = Object.values(result.errors)[0];
          toast.error(firstErr || 'Please fix the highlighted fields');
        }
        return result.valid;
      
      case 3: // Payment
        if (effectivePaymentMethodId) {
          // Using saved card - no form validation
          return true;
        }
        const vCard = validateCardNumber(paymentInfo.cardNumber);
        const vName = validateCardholderName(paymentInfo.cardName);
        const vExp = validateExpiry(paymentInfo.expiryDate);
        const vCvv = validateCVV(paymentInfo.cvv, vCard.brand);
        setCardErrors({
          cardNumber: vCard.error,
          cardName: vName.error,
          expiryDate: vExp.error,
          cvv: vCvv.error,
        });
        if (!vCard.valid || !vName.valid || !vExp.valid || !vCvv.valid) {
          toast.error(vCard.error || vName.error || vExp.error || vCvv.error || 'Please enter valid payment information');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  // Place Order (rate-limited, validate step 2 & 3)
  const handlePlaceOrder = async () => {
    const now = Date.now();
    if (now - lastSubmitTime.current < SUBMIT_COOLDOWN_MS) {
      toast.error('Please wait a moment before submitting again');
      return;
    }
    if (!validateStep(2) || !validateStep(3)) return;
    lastSubmitTime.current = now;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const shippingAddressForApi = {
      name: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
      address: [shippingInfo.address, shippingInfo.apartment].filter(Boolean).join(', '),
      city: shippingInfo.city,
      state: shippingInfo.state,
      zipCode: shippingInfo.zipCode,
      country: shippingInfo.country,
    };

    const orderUserId = user?.id ?? 'guest';
    let newOrder: Order;

    if (user?.id) {
      try {
        const created = await createOrderAPI({
          items: items.map((item) => ({
            productId: item.id,
            quantity: Number(item.quantity) || 1,
            price: Number(item.price) || 0,
          })),
          shippingAddress: shippingAddressForApi,
        });
        const daysParts = selectedOption.days.match(/\d+/g);
        const startDays = daysParts ? parseInt(daysParts[0], 10) : 5;
        const endDays = daysParts && daysParts.length > 1 ? parseInt(daysParts[1], 10) : startDays + 2;
        const estEnd = new Date();
        estEnd.setDate(estEnd.getDate() + endDays);
        const pointsEarned = computeOrderPoints(Math.max(0, Number(getSubtotal()) || 0), TIER_POINTS_MULTIPLIER[tier]);
        newOrder = {
          ...created,
          status: 'confirmed',
          shippingMethod: selectedOption.label,
          tax,
          shipping: shippingCost,
          discount: discountAmount,
          paymentMethod: (() => {
            const pm = effectivePaymentMethodId ? paymentMethods.find((m) => m.id === effectivePaymentMethodId) : null;
            return pm ? `${pm.brand} ending in ${pm.last4}` : (paymentInfo.cardNumber ? `${detectCardBrand(paymentInfo.cardNumber.replace(/\s/g, ''))} ending in ${paymentInfo.cardNumber.replace(/\s/g, '').slice(-4)}` : 'Credit Card');
          })(),
          estimatedDelivery: estEnd.toISOString(),
          estimatedDeliveryStart: new Date(estEnd.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDeliveryEnd: estEnd.toISOString(),
          pointsEarned,
          carrier: 'Easy11 Shipping',
          trackingNumber: `EZ11${created.orderNumber.replace(/-/g, '').slice(-10)}`,
          ...(discountCode && discountCode.toUpperCase().startsWith('E11REWARD') ? { rewardCouponCode: discountCode } : {}),
        };
        addOrder(newOrder, orderUserId);
      } catch (err: unknown) {
        toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create order. Please try again.');
        setIsProcessing(false);
        return;
      }
    } else {
      const orderNumber = `E11-${Date.now().toString().slice(-8)}`;
      const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const daysParts = selectedOption.days.match(/\d+/g);
      const startDays = daysParts ? parseInt(daysParts[0], 10) : 5;
      const endDays = daysParts && daysParts.length > 1 ? parseInt(daysParts[1], 10) : startDays + 2;
      const estStart = new Date();
      estStart.setDate(estStart.getDate() + startDays);
      const estEnd = new Date();
      estEnd.setDate(estEnd.getDate() + endDays);
      newOrder = {
        id: orderId,
        orderNumber,
        date: new Date().toISOString(),
        status: 'confirmed',
        userId: orderUserId,
        shippingMethod: selectedOption.label,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
          category: item.category,
        })),
        subtotal: getSubtotal(),
        tax,
        shipping: shippingCost,
        discount: discountAmount,
        total,
        paymentMethod: (() => {
            const pm = effectivePaymentMethodId ? paymentMethods.find((m) => m.id === effectivePaymentMethodId) : null;
            return pm ? `${pm.brand} ending in ${pm.last4}` : (paymentInfo.cardNumber ? `${detectCardBrand(paymentInfo.cardNumber.replace(/\s/g, ''))} ending in ${paymentInfo.cardNumber.replace(/\s/g, '').slice(-4)}` : 'Credit Card');
          })(),
        shippingAddress: shippingAddressForApi,
        estimatedDelivery: estEnd.toISOString(),
        estimatedDeliveryStart: estStart.toISOString(),
        estimatedDeliveryEnd: estEnd.toISOString(),
        pointsEarned: computeOrderPoints(Math.max(0, Number(getSubtotal()) || 0), TIER_POINTS_MULTIPLIER[tier]),
        carrier: 'Easy11 Shipping',
        trackingNumber: `EZ11${orderNumber.replace(/-/g, '').slice(-10)}`,
        ...(discountCode && discountCode.toUpperCase().startsWith('E11REWARD') ? { rewardCouponCode: discountCode } : {}),
      };
      addOrder(newOrder, orderUserId);
    }

    const orderId = newOrder.id;
    const orderNumber = newOrder.orderNumber;

    if (user?.id && newOrder.rewardCouponCode) {
      const { useRewardCoupon } = await import('../services/rewardsAPI');
      useRewardCoupon(newOrder.rewardCouponCode, orderId).catch(() => {});
    }

    const pointsEarned = newOrder.pointsEarned ?? 0;
    if (pointsEarned > 0) {
      addPendingPoints(orderId, pointsEarned, `Order #${orderNumber} – Pending`);
      if (user?.id) {
        const { addLedgerEarned } = await import('../services/rewardsAPI');
        addLedgerEarned(orderId, pointsEarned).catch((err) =>
          console.warn('[Checkout] Failed to sync points to backend:', err)
        );
      }
    }

    // Save card for future use (tokenized: last4 + brand only; never store full number or CVV)
    if (user?.id && paymentInfo.saveCard && !effectivePaymentMethodId) {
      const digits = paymentInfo.cardNumber.replace(/\s/g, '');
      const brand = detectCardBrand(digits);
      addPaymentMethod({
        id: `pm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        user_id: user.id,
        psp_token: 'tok_mock_' + Date.now(),
        brand: brand === 'other' ? 'visa' : brand,
        last4: digits.slice(-4),
        expiry: paymentInfo.expiryDate.length === 5
          ? `${paymentInfo.expiryDate.slice(0, 2)}/20${paymentInfo.expiryDate.slice(3)}`
          : paymentInfo.expiryDate,
        is_default: paymentMethods.length === 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // Save shipping address for logged-in users when using a new address (not from saved list)
    if (user?.id && !selectedAddressId) {
      const newAddress: Address = {
        id: `addr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        user_id: user.id,
        nickname: 'Shipping address',
        full_name: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
        phone: shippingInfo.phone || '',
        line1: shippingInfo.address,
        line2: shippingInfo.apartment || undefined,
        city: shippingInfo.city,
        state: shippingInfo.state,
        country: shippingInfo.country,
        postal_code: shippingInfo.zipCode,
        is_default_shipping: true,
        is_default_billing: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      addAddress(newAddress);
    }

    // Clear cart
    clearCart();

    // Navigate to confirmation
    navigate('/checkout/confirmation', {
      state: {
        orderNumber,
        total,
        items,
        shippingInfo,
        deliveryDays: selectedOption.days,
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

                  {/* Saved addresses (logged-in users) */}
                  {user && addresses.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Use a saved address
                        </h3>
                        <Link
                          to="/account/addresses"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Manage addresses
                        </Link>
                      </div>
                      <div className="space-y-2">
                        {addresses.map((addr) => (
                          <label
                            key={addr.id}
                            className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                              selectedAddressId === addr.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                          >
                            <input
                              type="radio"
                              name="saved-address"
                              checked={selectedAddressId === addr.id}
                              onChange={() => {
                                setSelectedAddressId(addr.id);
                                applyAddressToForm(addr);
                                setShippingErrors({});
                              }}
                              className="mt-1"
                            />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {addr.nickname} · {addr.full_name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {addr.line1}
                                {addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} {addr.postal_code}
                                {addr.country ? `, ${addr.country}` : ''}
                              </p>
                              {addr.phone && (
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{addr.phone}</p>
                              )}
                            </div>
                          </label>
                        ))}
                        <label
                          className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                            selectedAddressId === null
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <input
                            type="radio"
                            name="saved-address"
                            checked={selectedAddressId === null}
                            onChange={() => {
                              setSelectedAddressId(null);
                              setShippingInfo((prev) => ({
                                ...prev,
                                firstName: user?.name?.split(' ')[0] || '',
                                lastName: user?.name?.split(' ').slice(1).join(' ') || '',
                                phone: '',
                                address: '',
                                apartment: '',
                                city: '',
                                state: '',
                                zipCode: '',
                                country: prev.country,
                              }));
                              setShippingErrors({});
                            }}
                            className="mt-1"
                          />
                          <span className="font-medium text-gray-900 dark:text-white">Enter new address</span>
                        </label>
                      </div>
                    </div>
                  )}

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
                            onChange={(e) => {
                              setShippingInfo({ ...shippingInfo, email: e.target.value.trim() });
                              if (shippingErrors.email) setShippingErrors((p) => ({ ...p, email: undefined }));
                            }}
                            placeholder="your@email.com"
                            maxLength={254}
                            className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                              shippingErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                            }`}
                          />
                        </div>
                        {shippingErrors.email && <p className="text-sm text-red-500 mt-1">{shippingErrors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={shippingInfo.phone}
                            onChange={(e) => {
                              setShippingInfo({ ...shippingInfo, phone: e.target.value });
                              if (shippingErrors.phone) setShippingErrors((p) => ({ ...p, phone: undefined }));
                            }}
                            placeholder="+1 555 123 4567"
                            className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                              shippingErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                            }`}
                          />
                        </div>
                        {shippingErrors.phone && <p className="text-sm text-red-500 mt-1">{shippingErrors.phone}</p>}
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
                          onChange={(e) => {
                            setShippingInfo({ ...shippingInfo, firstName: e.target.value.trim() });
                            if (shippingErrors.firstName) setShippingErrors((p) => ({ ...p, firstName: undefined }));
                          }}
                          placeholder="John"
                          maxLength={80}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                            shippingErrors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                          }`}
                        />
                        {shippingErrors.firstName && <p className="text-sm text-red-500 mt-1">{shippingErrors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.lastName}
                          onChange={(e) => {
                            setShippingInfo({ ...shippingInfo, lastName: e.target.value.trim() });
                            if (shippingErrors.lastName) setShippingErrors((p) => ({ ...p, lastName: undefined }));
                          }}
                          placeholder="Doe"
                          maxLength={80}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                            shippingErrors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                          }`}
                        />
                        {shippingErrors.lastName && <p className="text-sm text-red-500 mt-1">{shippingErrors.lastName}</p>}
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
                          onChange={(e) => {
                            setShippingInfo({ ...shippingInfo, address: e.target.value });
                            if (shippingErrors.address) setShippingErrors((p) => ({ ...p, address: undefined }));
                          }}
                          placeholder="123 Main Street"
                          maxLength={200}
                          className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                            shippingErrors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                          }`}
                        />
                      </div>
                      {shippingErrors.address && <p className="text-sm text-red-500 mt-1">{shippingErrors.address}</p>}
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
                          onChange={(e) => {
                            setShippingInfo({ ...shippingInfo, apartment: e.target.value });
                            if (shippingErrors.apartment) setShippingErrors((p) => ({ ...p, apartment: undefined }));
                          }}
                          placeholder="Apt 4B, #12B"
                          maxLength={50}
                          className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                            shippingErrors.apartment ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                          }`}
                        />
                      </div>
                      {shippingErrors.apartment && <p className="text-sm text-red-500 mt-1">{shippingErrors.apartment}</p>}
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country *
                      </label>
                      <select
                        value={shippingInfo.country}
                        onChange={(e) => {
                          setShippingInfo({ ...shippingInfo, country: e.target.value });
                          if (shippingErrors.zipCode) setShippingErrors((p) => ({ ...p, zipCode: undefined }));
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="United States">United States</option>
                        <option value="AU">Australia</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                      </select>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) => {
                            setShippingInfo({ ...shippingInfo, city: e.target.value.trim() });
                            if (shippingErrors.city) setShippingErrors((p) => ({ ...p, city: undefined }));
                          }}
                          placeholder="New York"
                          maxLength={100}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                            shippingErrors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                          }`}
                        />
                        {shippingErrors.city && <p className="text-sm text-red-500 mt-1">{shippingErrors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.state}
                          onChange={(e) => {
                            setShippingInfo({ ...shippingInfo, state: e.target.value.trim() });
                            if (shippingErrors.state) setShippingErrors((p) => ({ ...p, state: undefined }));
                          }}
                          placeholder="NY"
                          maxLength={100}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                            shippingErrors.state ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                          }`}
                        />
                        {shippingErrors.state && <p className="text-sm text-red-500 mt-1">{shippingErrors.state}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ZIP / Postcode *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.zipCode}
                          onChange={(e) => {
                            setShippingInfo({ ...shippingInfo, zipCode: e.target.value.trim() });
                            if (shippingErrors.zipCode) setShippingErrors((p) => ({ ...p, zipCode: undefined }));
                          }}
                          placeholder={shippingInfo.country === 'Australia' || shippingInfo.country === 'AU' ? '3000' : '10001'}
                          maxLength={20}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                            shippingErrors.zipCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                          }`}
                        />
                        {shippingErrors.zipCode && <p className="text-sm text-red-500 mt-1">{shippingErrors.zipCode}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Speed */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Delivery Speed
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Free standard shipping on orders over ${FREE_STANDARD_SHIPPING_THRESHOLD}
                    </p>
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

                  {/* Saved cards (logged-in users) */}
                  {user && paymentMethods.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Use a saved card
                      </h3>
                      <div className="space-y-2">
                        {paymentMethods.map((pm) => (
                          <label
                            key={pm.id}
                            className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                              effectivePaymentMethodId === pm.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                          >
                            <input
                              type="radio"
                              name="saved-card"
                              checked={effectivePaymentMethodId === pm.id}
                              onChange={() => {
                                setSelectedPaymentMethodId(pm.id);
                                setCardErrors({});
                              }}
                              className="form-radio"
                            />
                            <CreditCard className="w-5 h-5 text-gray-500" />
                            <span className="font-medium text-gray-900 dark:text-white capitalize">
                              {pm.brand} •••• {pm.last4}
                            </span>
                            <span className="text-sm text-gray-500">Expires {pm.expiry}</span>
                          </label>
                        ))}
                        <label
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                            effectivePaymentMethodId === null
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <input
                            type="radio"
                            name="saved-card"
                            checked={effectivePaymentMethodId === null}
                            onChange={() => {
                              setSelectedPaymentMethodId(null);
                              setCardErrors({});
                            }}
                            className="form-radio"
                          />
                          <span className="font-medium text-gray-900 dark:text-white">Enter new card</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Card Information (when entering new card) */}
                  {effectivePaymentMethodId === null && (
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
                              inputMode="numeric"
                              autoComplete="cc-number"
                              value={paymentInfo.cardNumber}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, '');
                                const brand = detectCardBrand(raw);
                                const maxLen = brand === 'amex' ? 15 : 16;
                                if (raw.length <= maxLen) {
                                  const formatted = brand === 'amex'
                                    ? raw.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
                                    : raw.replace(/(\d{4})/g, '$1 ').trim();
                                  setPaymentInfo({ ...paymentInfo, cardNumber: formatted });
                                  setCardErrors((prev) => ({ ...prev, cardNumber: undefined }));
                                }
                              }}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono ${
                                cardErrors.cardNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                              }`}
                            />
                            {paymentInfo.cardNumber && (
                              <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 capitalize">
                                {detectCardBrand(paymentInfo.cardNumber.replace(/\s/g, ''))}
                              </span>
                            )}
                          </div>
                          {cardErrors.cardNumber && (
                            <p className="text-sm text-red-500 mt-1">{cardErrors.cardNumber}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            autoComplete="cc-name"
                            value={paymentInfo.cardName}
                            onChange={(e) => {
                              setPaymentInfo({ ...paymentInfo, cardName: e.target.value });
                              setCardErrors((prev) => ({ ...prev, cardName: undefined }));
                            }}
                            placeholder="John Doe"
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                              cardErrors.cardName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                            }`}
                          />
                          {cardErrors.cardName && (
                            <p className="text-sm text-red-500 mt-1">{cardErrors.cardName}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Expiry Date * (MM/YY)
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              autoComplete="cc-exp"
                              value={paymentInfo.expiryDate}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                if (value.length <= 5) {
                                  setPaymentInfo({ ...paymentInfo, expiryDate: value });
                                  setCardErrors((prev) => ({ ...prev, expiryDate: undefined }));
                                }
                              }}
                              placeholder="MM/YY"
                              maxLength={5}
                              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono ${
                                cardErrors.expiryDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                              }`}
                            />
                            {cardErrors.expiryDate && (
                              <p className="text-sm text-red-500 mt-1">{cardErrors.expiryDate}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              CVV * (Security Code)
                            </label>
                            <div className="relative">
                              <input
                                type="password"
                                inputMode="numeric"
                                autoComplete="cc-csc"
                                value={paymentInfo.cvv}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  const brand = detectCardBrand(paymentInfo.cardNumber.replace(/\s/g, ''));
                                  const maxLen = cvvLengthForBrand(brand);
                                  if (value.length <= maxLen) {
                                    setPaymentInfo({ ...paymentInfo, cvv: value });
                                    setCardErrors((prev) => ({ ...prev, cvv: undefined }));
                                  }
                                }}
                                placeholder={detectCardBrand(paymentInfo.cardNumber.replace(/\s/g, '')) === 'amex' ? '4 digits' : '123'}
                                maxLength={4}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono pr-12 ${
                                  cardErrors.cvv ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                                }`}
                              />
                              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                            {cardErrors.cvv && (
                              <p className="text-sm text-red-500 mt-1">{cardErrors.cvv}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-0.5">Never stored. For verification only.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Card Checkbox (only when entering new card) */}
                  {effectivePaymentMethodId === null && (
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paymentInfo.saveCard}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, saveCard: e.target.checked })}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Save this card for future purchases (only last 4 digits + card type stored)
                      </span>
                    </label>
                  )}

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
                        Qty: {Number(item.quantity) || 1}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}
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
                        {effectivePaymentMethodId ? (
                          (() => {
                            const pm = paymentMethods.find((m) => m.id === effectivePaymentMethodId);
                            return pm ? (
                              <>
                                <span className="block capitalize">{pm.brand} ending in {pm.last4}</span>
                                <span className="block">Expires {pm.expiry}</span>
                              </>
                            ) : null;
                          })()
                        ) : (
                          <>
                            <span className="block">Card ending in {paymentInfo.cardNumber.replace(/\s/g, '').slice(-4)}</span>
                            <span className="block">{paymentInfo.cardName}</span>
                            <span className="block">Expires {paymentInfo.expiryDate}</span>
                          </>
                        )}
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
                            {selectedOption.label}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Estimated delivery: {selectedOption.days} business days
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
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
                        Qty: {Number(item.quantity) || 1}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}
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
                  <span>Shipping ({selectedOption.label})</span>
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

              {items.length > 0 && total <= 0 && (
                <p className="text-sm text-red-500 py-2">
                  We couldn&apos;t calculate total—refresh or contact support.
                </p>
              )}
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

