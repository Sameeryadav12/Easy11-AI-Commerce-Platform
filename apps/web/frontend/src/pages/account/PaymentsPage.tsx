/**
 * Payments Page
 * Sprint 3: Payment methods management with Step-Up
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Plus, Trash2, CheckCircle, Shield } from 'lucide-react';
import { usePaymentStore } from '../../store/paymentStore';
import dashboardAPI from '../../services/dashboardAPI';
import StepUpModal from '../../components/mfa/StepUpModal';
import { Button } from '../../components/ui';
import toast from 'react-hot-toast';

export default function PaymentsPage() {
  const { methods, setMethods, deleteMethod: deleteFromStore } = usePaymentStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStepUp, setShowStepUp] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    setIsLoading(true);
    try {
      const data = await dashboardAPI.getPaymentMethods();
      setMethods(data);
    } catch (error) {
      toast.error('Failed to load payment methods');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTarget(id);
    setShowStepUp(true);
  };

  const handleStepUpSuccess = async (stepUpToken: string) => {
    setShowStepUp(false);

    if (deleteTarget) {
      try {
        await dashboardAPI.deletePaymentMethod(deleteTarget);
        deleteFromStore(deleteTarget);
        toast.success('Payment method removed successfully');
        setDeleteTarget(null);
      } catch (error) {
        toast.error('Failed to remove payment method');
      }
    }
  };

  const getCardIcon = (brand: string) => {
    const icons: Record<string, string> = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳',
    };
    return icons[brand] || '💳';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Payment Methods
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your saved payment methods securely
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Card
          </Button>
        </div>

        {/* Security Notice */}
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                Your cards are secure
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                We use industry-standard encryption and never store your full card details. All cards are tokenized through our secure payment processor.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods List */}
        {methods.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
            <CreditCard className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No payment methods saved</p>
            <Button onClick={() => setShowAddModal(true)} variant="primary">
              Add Your First Card
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {methods.map((method) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden"
              >
                {/* Card Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-8 -mt-8"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-8 -mb-8"></div>

                {/* Default Badge */}
                {method.is_default && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Default
                    </span>
                  </div>
                )}

                {/* Card Content */}
                <div className="relative z-10">
                  {/* Brand & Nickname */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-3xl">{getCardIcon(method.brand)}</p>
                      <p className="text-xs text-gray-400 mt-1 capitalize">{method.brand}</p>
                    </div>
                    {method.nickname && (
                      <p className="text-sm text-gray-300">{method.nickname}</p>
                    )}
                  </div>

                  {/* Card Number */}
                  <div className="mb-6">
                    <p className="text-2xl font-mono tracking-wider">
                      •••• •••• •••• {method.last4}
                    </p>
                  </div>

                  {/* Expiry & Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Expires</p>
                      <p className="font-medium">{method.expiry}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(method.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      title="Remove card (requires MFA)"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Card Modal (Placeholder) */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                  Add Payment Method
                </h3>

                <div className="space-y-4 mb-6">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                      maxLength={19}
                    />
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  {/* Nickname */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nickname (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Personal Card, Business Card..."
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                    />
                  </div>

                  {/* Set as Default */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Set as default payment method
                    </span>
                  </label>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-6">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    🔒 Your card details are encrypted and tokenized. We never store your full card number or CVV.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="primary" className="flex-1" onClick={() => {
                    toast.success('Card added successfully!');
                    setShowAddModal(false);
                  }}>
                    Add Card
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step-Up Modal for Delete */}
        <StepUpModal
          isOpen={showStepUp}
          onClose={() => {
            setShowStepUp(false);
            setDeleteTarget(null);
          }}
          onSuccess={handleStepUpSuccess}
          purpose="remove this payment method"
          action="Remove Payment Method"
        />
      </motion.div>
    </div>
  );
}

