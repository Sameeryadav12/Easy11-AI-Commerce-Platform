/**
 * Renders the CookiePreferencesModal globally so it can be opened from
 * Footer (Do Not Sell), Cookie Policy page, or banner.
 */
import CookiePreferencesModal from './CookiePreferencesModal';
import { useCookieConsentStore } from '../../store/cookieConsentStore';

export default function CookiePreferencesTrigger() {
  const {
    isPreferencesModalOpen,
    closePreferencesModal,
    savePreferences,
    acceptAll,
    rejectNonEssential,
    preferences,
  } = useCookieConsentStore();

  return (
    <CookiePreferencesModal
      isOpen={isPreferencesModalOpen}
      onClose={closePreferencesModal}
      onSave={savePreferences}
      onAcceptAll={acceptAll}
      onRejectNonEssential={rejectNonEssential}
      currentPreferences={preferences}
    />
  );
}
