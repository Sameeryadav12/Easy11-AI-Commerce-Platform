/**
 * Addresses Page
 * Sprint 3: Customer Dashboard - Address Management with Step-Up
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Plus, Edit2, Trash2, MapPin, Phone, User, CheckCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAddressStore } from '../../store/addressStore';
import { useAuthStore } from '../../store/authStore';
import dashboardAPI from '../../services/dashboardAPI';
import StepUpModal from '../../components/mfa/StepUpModal';
import { Button } from '../../components/ui';
import BreadcrumbBack from '../../components/navigation/BreadcrumbBack';
import toast from 'react-hot-toast';
import type { Address, AddressFormData } from '../../types/dashboard';

export default function AddressesPage() {
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get('from');
  const fromProfile = fromParam === 'profile';
  const {
    addresses,
    addAddress: addToStore,
    updateAddress: updateInStore,
    deleteAddress: deleteFromStore,
    setDefaultShipping,
    setDefaultBilling,
  } = useAddressStore();
  const hasHydrated = useAddressStore.persist?.hasHydrated?.() ?? true;
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showStepUp, setShowStepUp] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    nickname: '',
    full_name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    country: 'AU',
    postal_code: '',
    is_default_shipping: false,
    is_default_billing: false,
  });

  useEffect(() => {
    const onHydrated = () => {
      setIsLoading(false);
      const state = useAddressStore.getState();
      const addrs = state.addresses;
      const shippingDefaults = addrs.filter((a) => a.is_default_shipping);
      const billingDefaults = addrs.filter((a) => a.is_default_billing);
      if (shippingDefaults.length > 1) state.setDefaultShipping(shippingDefaults[0].id);
      if (billingDefaults.length > 1) state.setDefaultBilling(billingDefaults[0].id);
    };
    const unsub = useAddressStore.persist?.onFinishHydration?.(onHydrated);
    if (useAddressStore.persist?.hasHydrated?.()) onHydrated();
    return () => unsub?.();
  }, []);

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      nickname: '',
      full_name: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: 'AU',
      postal_code: '',
      is_default_shipping: false,
      is_default_billing: false,
    });
    setShowForm(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      nickname: address.nickname,
      full_name: address.full_name,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      state: address.state,
      country: address.country,
      postal_code: address.postal_code,
      is_default_shipping: address.is_default_shipping,
      is_default_billing: address.is_default_billing,
    });
    setShowForm(true);
  };

  /** Meaningful card title: nickname if set, else "Home Address" for default shipping, else "Address (City)". */
  const getAddressCardTitle = (address: Address) => {
    const nickname = (address.nickname || '').trim();
    if (nickname && nickname !== 'Address' && nickname.toLowerCase() !== 'shipping address') {
      return nickname;
    }
    if (address.is_default_shipping) return 'Home Address';
    return `Address (${address.city || 'Other'})`;
  };

  const handleSave = async () => {
    try {
      if (editingAddress) {
        const updated = {
          ...formData,
          updated_at: new Date().toISOString(),
        };
        updateInStore(editingAddress.id, updated);
        if (formData.is_default_shipping) setDefaultShipping(editingAddress.id);
        if (formData.is_default_billing) setDefaultBilling(editingAddress.id);
        toast.success('Address updated successfully!');
      } else {
        const user = useAuthStore.getState().user;
        const newAddress: Address = {
          id: `addr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          user_id: user?.id ?? 'anon',
          nickname: formData.nickname.trim() || 'Address',
          full_name: formData.full_name,
          phone: formData.phone,
          line1: formData.line1,
          line2: formData.line2,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postal_code: formData.postal_code,
          is_default_shipping: formData.is_default_shipping,
          is_default_billing: formData.is_default_billing,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        addToStore(newAddress);
        if (formData.is_default_shipping) setDefaultShipping(newAddress.id);
        if (formData.is_default_billing) setDefaultBilling(newAddress.id);
        toast.success('Address added successfully!');
      }
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to save address');
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
        // Delete from store directly (addresses may exist only in addressStore)
        deleteFromStore(deleteTarget);
        toast.success('Address deleted successfully!');
        setDeleteTarget(null);
      } catch (error) {
        toast.error('Failed to delete address');
      }
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {fromProfile && (
          <div className="mb-4">
            <BreadcrumbBack
              parentLabel="Profile"
              parentUrl="/account/profile"
              currentPage="My Addresses"
            />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              My Addresses
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your shipping and billing addresses
            </p>
          </div>
          <Button
            onClick={handleAddNew}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Address
          </Button>
        </div>

        {/* Address List */}
        {addresses.length === 0 ? (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No addresses saved</p>
            <Button onClick={handleAddNew} variant="primary">
              Add Your First Address
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <h3 className="font-heading font-bold text-gray-900 dark:text-white capitalize">
                      {getAddressCardTitle(address)}
                    </h3>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(address.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete (requires MFA)"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p className="flex items-start gap-2">
                    <User className="w-4 h-4 text-gray-400 mt-0.5" />
                    {address.full_name}
                  </p>
                  <p className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                    {address.phone}
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span>
                      {address.line1}
                      {address.line2 && <>, {address.line2}</>}
                      <br />
                      {address.city}, {address.state} {address.postal_code}
                      <br />
                      {address.country}
                    </span>
                  </p>
                </div>

                {/* Only one address shows Default Shipping, only one shows Default Billing */}
                {(address.is_default_shipping || address.is_default_billing) && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
                    {address.is_default_shipping && (
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Default Shipping
                      </span>
                    )}
                    {address.is_default_billing && (
                      <span className="inline-flex items-center px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-medium rounded-full">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Default Billing
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Address Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address name
                    </label>
                    <input
                      type="text"
                      value={formData.nickname}
                      onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                      placeholder="e.g. Home, Work, Parents..."
                      className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+61412345678"
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      value={formData.line1}
                      onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.line2}
                      onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                      placeholder="Apartment, suite, unit, etc."
                      className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={formData.postal_code}
                        onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                      >
                        <option value="AU">Australia</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="CA">Canada</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_default_shipping}
                        onChange={(e) => setFormData({ ...formData, is_default_shipping: e.target.checked })}
                        className="w-4 h-4 text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Set as default shipping address
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_default_billing}
                        onChange={(e) => setFormData({ ...formData, is_default_billing: e.target.checked })}
                        className="w-4 h-4 text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Set as default billing address
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="secondary" onClick={() => setShowForm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSave} className="flex-1">
                    {editingAddress ? 'Update' : 'Save'} Address
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
          purpose="delete this address"
          action="Delete Address"
        />
      </motion.div>
    </div>
  );
}

