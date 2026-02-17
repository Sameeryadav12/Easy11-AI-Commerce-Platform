import { useState, useEffect } from 'react';
import { Shield, BarChart, Settings, Target } from 'lucide-react';
import { Modal, ModalFooter } from '../ui';
import type { CookiePreferences } from '../../store/cookieConsentStore';

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prefs: CookiePreferences) => void;
  onAcceptAll: () => void;
  onRejectNonEssential: () => void;
  currentPreferences: CookiePreferences;
}

const CATEGORIES = [
  {
    key: 'essential' as const,
    label: 'Essential Cookies',
    description: 'Required for the website to function. Cannot be disabled.',
    icon: Shield,
    disabled: true,
  },
  {
    key: 'analytics' as const,
    label: 'Analytics Cookies',
    description: 'Help us understand how visitors use our site.',
    icon: BarChart,
  },
  {
    key: 'functional' as const,
    label: 'Functional Cookies',
    description: 'Enable enhanced features like language and theme preferences.',
    icon: Settings,
  },
  {
    key: 'marketing' as const,
    label: 'Marketing Cookies',
    description: 'Used for personalized ads and campaign measurement.',
    icon: Target,
  },
];

export default function CookiePreferencesModal({
  isOpen,
  onClose,
  onSave,
  onAcceptAll,
  onRejectNonEssential,
  currentPreferences,
}: CookiePreferencesModalProps) {
  const [prefs, setPrefs] = useState<CookiePreferences>(currentPreferences);

  useEffect(() => {
    if (isOpen) setPrefs({ ...currentPreferences });
  }, [isOpen, currentPreferences]);

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === 'essential') return;
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = () => {
    onSave(prefs);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cookie Preferences"
      size="lg"
      showCloseButton
    >
      <div className="space-y-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose which cookies you allow. Essential cookies are required for the site to work and cannot be disabled.
        </p>

        {/* GDPR/CCPA primary actions - equal prominence */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onAcceptAll}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Accept All
          </button>
          <button
            type="button"
            onClick={onRejectNonEssential}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Reject Non-Essential
          </button>
          <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 py-2">
            Or customize below ↓
          </span>
        </div>

        <div className="space-y-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const checked = prefs[cat.key];
            const disabled = cat.disabled ?? false;

            return (
              <div
                key={cat.key}
                className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                    <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {cat.label}
                      </h4>
                      {disabled && (
                        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                      {cat.description}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => handleToggle(cat.key)}
                    className="peer sr-only"
                  />
                  <div
                    className={`h-6 w-11 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800`}
                  />
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Save preferences
        </button>
      </ModalFooter>
    </Modal>
  );
}
