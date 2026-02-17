import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings } from 'lucide-react';
import { useCookieConsentStore } from '../../store/cookieConsentStore';

/**
 * Cookie Consent Banner
 *
 * Shows on first visit when consentGiven is null.
 * Accept all | Reject non-essential | Manage preferences
 */
export default function CookieConsentBanner() {
  const {
    consentGiven,
    acceptAll,
    rejectNonEssential,
    openPreferencesModal,
  } = useCookieConsentStore();

  if (consentGiven !== null) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
                  <Cookie className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    We use cookies
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                    We use cookies to improve your experience, analyze traffic, and personalize content.
                    You can accept all, reject non-essential, or customize your preferences.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
                <button
                  type="button"
                  onClick={acceptAll}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Accept all
                </button>
                <button
                  type="button"
                  onClick={rejectNonEssential}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Reject non-essential
                </button>
                <button
                  type="button"
                  onClick={openPreferencesModal}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  <Settings className="h-4 w-4" />
                  Customize
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
