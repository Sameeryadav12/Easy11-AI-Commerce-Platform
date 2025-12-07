/**
 * Vendor Settings & Payouts Page
 * Sprint 7: Business profile, bank details, payout history
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, CreditCard, DollarSign, Download, Lock } from 'lucide-react';
import { useVendorStore } from '../../store/vendorStore';
import { useVendorPayoutsStore } from '../../store/vendorPayoutsStore';
import vendorAPI from '../../services/vendorAPI';
import vendorOrdersAPI from '../../services/vendorOrdersAPI';
import StepUpModal from '../../components/mfa/StepUpModal';
import { Button } from '../../components/ui';
import toast from 'react-hot-toast';

export default function VendorSettingsPage() {
  const { currentVendor, updateCurrentVendor } = useVendorStore();
  const { wallet, payouts, setWallet, setPayouts } = useVendorPayoutsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showStepUp, setShowStepUp] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'bank' | 'payouts'>('profile');
  
  // Business Profile
  const [businessName, setBusinessName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Bank Details
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [bsb, setBsb] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (currentVendor) {
      setBusinessName(currentVendor.business_name);
      setLegalName(currentVendor.legal_name);
      setEmail(currentVendor.email);
      setPhone(currentVendor.phone);
    }
  }, [currentVendor]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [walletData, payoutsData] = await Promise.all([
        vendorOrdersAPI.getVendorWallet('vendor-123'),
        vendorOrdersAPI.getPayouts('vendor-123'),
      ]);
      setWallet(walletData);
      setPayouts(payoutsData.payouts);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await vendorAPI.updateVendorProfile({
        business_name: businessName,
        legal_name: legalName,
        email,
        phone,
      });
      updateCurrentVendor({ business_name: businessName, legal_name: legalName, email, phone });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleUpdateBankDetails = () => {
    setShowStepUp(true);
  };

  const handleStepUpSuccess = async () => {
    setShowStepUp(false);
    try {
      await vendorOrdersAPI.updateBankDetails('vendor-123', {
        bank_name: bankName,
        account_holder_name: accountHolder,
        bsb,
      }, 'stepup-token');
      toast.success('Bank details updated successfully! Verification pending.');
    } catch (error) {
      toast.error('Failed to update bank details');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'processing': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'failed': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Settings & Payouts
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your business profile, bank details, and payouts
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          {[
            { key: 'profile', label: 'Business Profile', icon: Building2 },
            { key: 'bank', label: 'Bank Details', icon: CreditCard },
            { key: 'payouts', label: 'Payouts', icon: DollarSign },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Business Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Business Profile
            </h2>
            
            <div className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Legal Name
                  </label>
                  <input
                    type="text"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                  />
                </div>
              </div>

              <Button onClick={handleUpdateProfile} variant="primary" className="w-full md:w-auto">
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {/* Bank Details Tab */}
        {activeTab === 'bank' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                Bank Details
              </h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full">
                <Lock className="w-4 h-4" />
                Encrypted & Secure
              </div>
            </div>
            
            <div className="space-y-6 max-w-2xl">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 mb-6">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ Changing bank details requires MFA verification for security
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Commonwealth Bank"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="TechCo Electronics Pty Ltd"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    BSB
                  </label>
                  <input
                    type="text"
                    value={bsb}
                    onChange={(e) => setBsb(e.target.value)}
                    placeholder="123-456"
                    maxLength={7}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="12345678"
                    maxLength={10}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                  />
                </div>
              </div>

              <Button 
                onClick={handleUpdateBankDetails} 
                variant="primary" 
                className="w-full md:w-auto flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Update Bank Details (Requires MFA)
              </Button>
            </div>
          </div>
        )}

        {/* Payouts Tab */}
        {activeTab === 'payouts' && wallet && (
          <div className="space-y-6">
            {/* Wallet Balance */}
            <div className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl shadow-lg p-8 text-white">
              <h2 className="text-2xl font-heading font-bold mb-6">Wallet Balance</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-blue-100 mb-2">Available Balance</p>
                  <p className="text-4xl font-bold">${wallet.balance.toLocaleString()}</p>
                  <p className="text-sm text-blue-100 mt-1">Ready for payout</p>
                </div>
                <div>
                  <p className="text-sm text-blue-100 mb-2">On Hold</p>
                  <p className="text-4xl font-bold">${wallet.hold_balance.toLocaleString()}</p>
                  <p className="text-sm text-blue-100 mt-1">Fraud/dispute holds</p>
                </div>
                <div>
                  <p className="text-sm text-blue-100 mb-2">Pending</p>
                  <p className="text-4xl font-bold">${wallet.pending_balance.toLocaleString()}</p>
                  <p className="text-sm text-blue-100 mt-1">Clearing period</p>
                </div>
              </div>

              {wallet.next_payout_date && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-sm text-blue-100">Next Payout</p>
                  <p className="text-2xl font-bold">
                    ${wallet.next_payout_amount?.toLocaleString()} on {new Date(wallet.next_payout_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Payout History */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                Payout History
              </h2>
              
              {payouts.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No payout history yet
                </div>
              ) : (
                <div className="space-y-4">
                  {payouts.map((payout) => (
                    <div
                      key={payout.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                            {payout.status}
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(payout.period_start).toLocaleDateString()} - {new Date(payout.period_end).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Gross Revenue</p>
                            <p className="font-bold text-gray-900 dark:text-white">${payout.gross_revenue.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Fees</p>
                            <p className="font-bold text-red-600">-${payout.platform_fees.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Net Payout</p>
                            <p className="font-bold text-green-600">${payout.net_payout.toFixed(2)}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {payout.orders_count} orders
                        </p>
                      </div>
                      
                      {payout.statement_url && (
                        <button className="ml-4 p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step-Up Modal */}
        <StepUpModal
          isOpen={showStepUp}
          onClose={() => setShowStepUp(false)}
          onSuccess={handleStepUpSuccess}
          purpose="update your bank details"
          action="Update Bank Details"
        />
      </motion.div>
    </div>
  );
}

