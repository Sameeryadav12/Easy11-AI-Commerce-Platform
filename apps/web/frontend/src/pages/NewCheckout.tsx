import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, Check } from 'lucide-react';
import { Button, Card, CardBody, Input, Badge } from '../components/ui';
import { useCartStore } from '../store/cartStore';

export const NewCheckout = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [formData, setFormData] = useState({
    // Shipping
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Payment
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = () => {
    // TODO: Connect to backend API
    alert('Order placed successfully!');
    clearCart();
    navigate('/');
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            Secure Checkout
          </h1>
          <p className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <Lock className="w-4 h-4" />
            <span>Your information is safe and secure</span>
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: 'Shipping' },
              { num: 2, label: 'Payment' },
              { num: 3, label: 'Review' },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      step >= s.num
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step > s.num ? <Check className="w-6 h-6" /> : s.num}
                  </div>
                  <span className="text-sm font-medium mt-2 text-gray-700 dark:text-gray-300">
                    {s.label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`flex-1 h-1 mx-4 transition-all ${
                      step > s.num ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Forms */}
          <div className="lg:col-span-2">
            {/* Shipping Information */}
            {step === 1 && (
              <Card>
                <CardBody>
                  <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                    Shipping Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      fullWidth
                      className="md:col-span-2"
                    />
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="ZIP Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button variant="primary" size="lg" onClick={() => setStep(2)}>
                      Continue to Payment
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Payment Information */}
            {step === 2 && (
              <Card>
                <CardBody>
                  <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                    Payment Information
                  </h2>

                  <div className="space-y-4">
                    <Input
                      label="Card Number"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      leftIcon={<CreditCard className="w-5 h-5" />}
                      required
                    />
                    <Input
                      label="Cardholder Name"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                      />
                      <Input
                        label="CVV"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Your payment information is encrypted and secure
                    </p>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button variant="ghost" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button variant="primary" size="lg" onClick={() => setStep(3)}>
                      Review Order
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Review & Place Order */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Shipping Address */}
                <Card>
                  <CardBody>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                        Shipping Address
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                        Edit
                      </Button>
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      <p className="font-semibold">{formData.fullName}</p>
                      <p>{formData.address}</p>
                      <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                      <p>{formData.country}</p>
                      <p className="mt-2">{formData.email}</p>
                      <p>{formData.phone}</p>
                    </div>
                  </CardBody>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardBody>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                        Payment Method
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        •••• {formData.cardNumber.slice(-4)}
                      </span>
                    </div>
                  </CardBody>
                </Card>

                {/* Place Order Button */}
                <div className="flex justify-between">
                  <Button variant="ghost" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button variant="success" size="lg" onClick={handlePlaceOrder}>
                    <Lock className="w-5 h-5 mr-2" />
                    Place Order - ${total.toFixed(2)}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardBody>
                  <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                    Order Summary
                  </h3>

                  {/* Cart Items */}
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">{item.image}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Shipping</span>
                      {shipping === 0 ? (
                        <Badge variant="success" size="sm">FREE</Badge>
                      ) : (
                        <span>${shipping.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-3 border-t-2 border-gray-200 dark:border-gray-700">
                      <span>Total</span>
                      <span className="text-blue-600 dark:text-blue-400">${total.toFixed(2)}</span>
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

export default NewCheckout;

