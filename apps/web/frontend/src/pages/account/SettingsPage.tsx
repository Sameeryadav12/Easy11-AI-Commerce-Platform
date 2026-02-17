import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  DollarSign,
} from 'lucide-react';
import {
  useCustomerSettingsStore,
  type CurrencyOption,
  type LanguageOption,
} from '../../store/settingsStore';
import { Button } from '../../components/ui';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const persisted = useCustomerSettingsStore((s) => ({
    language: s.language,
    currency: s.currency,
    marketingEmails: s.marketingEmails,
    orderUpdates: s.orderUpdates,
  }));
  const setSettings = useCustomerSettingsStore((s) => s.setSettings);
  const resetPersisted = useCustomerSettingsStore((s) => s.reset);

  const [language, setLanguage] = useState<LanguageOption>(persisted.language);
  const [currency, setCurrency] = useState<CurrencyOption>(persisted.currency);
  const [marketingEmails, setMarketingEmails] = useState(persisted.marketingEmails);
  const [orderUpdates, setOrderUpdates] = useState(persisted.orderUpdates);

  useEffect(() => {
    setLanguage(persisted.language);
    setCurrency(persisted.currency);
    setMarketingEmails(persisted.marketingEmails);
    setOrderUpdates(persisted.orderUpdates);
  }, [persisted.currency, persisted.language, persisted.marketingEmails, persisted.orderUpdates]);

  const hasUnsavedChanges =
    language !== persisted.language ||
    currency !== persisted.currency ||
    marketingEmails !== persisted.marketingEmails ||
    orderUpdates !== persisted.orderUpdates;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Preferences that control how the product behaves for you.
        </p>
      </div>

      {/* Clear separation of responsibilities */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-2">
          Looking for profile, security, or privacy?
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Profile & Security</span> is for identity and protection (password, MFA, devices, sessions).
          <span className="font-semibold"> Privacy & data</span> is for export and account deletion.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/account/profile?from=settings">
            <Button variant="secondary">Profile & Security</Button>
          </Link>
          <Link to="/account/privacy?from=settings">
            <Button variant="secondary">Privacy & data</Button>
          </Link>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                  Preferences
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  These settings are saved per account on this device.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <Button
                  variant="secondary"
                  disabled={!hasUnsavedChanges}
                  onClick={() => {
                    setLanguage(persisted.language);
                    setCurrency(persisted.currency);
                    setMarketingEmails(persisted.marketingEmails);
                    setOrderUpdates(persisted.orderUpdates);
                    toast.success('Changes discarded');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  disabled={!hasUnsavedChanges}
                  onClick={() => {
                    setSettings({
                      language,
                      currency,
                      marketingEmails,
                      orderUpdates,
                    });
                    toast.success('Settings saved');
                  }}
                >
                  Save changes
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/40">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Globe className="w-4 h-4" />
                  Language
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as LanguageOption)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="auto">Auto-detect (browser)</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Language affects menus and emails.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/40">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <DollarSign className="w-4 h-4" />
                  Currency
                </div>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyOption)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="auto">Auto-detect by shipping country</option>
                  <option value="AUD">AUD – Australia</option>
                  <option value="USD">USD – United States</option>
                  <option value="EUR">EUR – Europe</option>
                  <option value="GBP">GBP – United Kingdom</option>
                  <option value="INR">INR – India</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Prices shown in this currency. Final charge depends on payment provider.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Notifications
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/40">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Order updates</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Shipping, delivery, and return status.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={orderUpdates}
                    onChange={(e) => setOrderUpdates(e.target.checked)}
                    className="h-5 w-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/40">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Marketing emails</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Deals, recommendations, and new arrivals.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={marketingEmails}
                    onChange={(e) => setMarketingEmails(e.target.checked)}
                    className="h-5 w-5"
                  />
                </label>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Notification preferences are saved locally for now.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    resetPersisted();
                    toast.success('Settings reset to defaults');
                  }}
                >
                  Reset to defaults
                </Button>
              </div>
            </div>
          </div>
    </div>
  );
}

