/**
 * Cookie Consent Store
 *
 * Manages user cookie preferences with consent logging.
 * Essential cookies always on; Analytics, Functional, Marketing are opt-in.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CookieCategory = 'essential' | 'analytics' | 'functional' | 'marketing';

export interface CookiePreferences {
  essential: boolean; // always true, cannot be disabled
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

export interface ConsentLog {
  consentId: string;
  timestamp: string;
  region: string;
  categories: CookiePreferences;
  action: 'accept_all' | 'reject_non_essential' | 'manage_preferences';
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  functional: false,
  marketing: false,
};

const ALL_ENABLED: CookiePreferences = {
  essential: true,
  analytics: true,
  functional: true,
  marketing: true,
};

const ESSENTIAL_ONLY: CookiePreferences = {
  essential: true,
  analytics: false,
  functional: false,
  marketing: false,
};

/** Simple region detection: EU/UK, California, or rest */
function detectRegion(): string {
  if (typeof window === 'undefined') return 'unknown';
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (/^(Europe|Atlantic\/Azores|Atlantic\/Madeira)/.test(tz)) return 'eu';
  if (tz === 'America/Los_Angeles' || tz === 'America/Denver' || /^America\//.test(tz)) return 'us';
  return 'rest';
}

interface CookieConsentState {
  /** null = not yet decided, true = user made a choice */
  consentGiven: boolean | null;
  preferences: CookiePreferences;
  consentLog: ConsentLog | null;
  isPreferencesModalOpen: boolean;

  acceptAll: () => void;
  rejectNonEssential: () => void;
  setPreferences: (prefs: Partial<CookiePreferences>) => void;
  savePreferences: (prefs: CookiePreferences) => void;
  openPreferencesModal: () => void;
  closePreferencesModal: () => void;

  /** Check if a category is allowed (for script loading) */
  isAllowed: (category: CookieCategory) => boolean;

  /** Internal: apply script loading based on consent */
  applyScripts: () => void;
}

function generateConsentId(): string {
  return `consent_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function logConsent(
  action: ConsentLog['action'],
  categories: CookiePreferences
): ConsentLog {
  const log: ConsentLog = {
    consentId: generateConsentId(),
    timestamp: new Date().toISOString(),
    region: detectRegion(),
    categories: { ...categories },
    action,
  };
  try {
    localStorage.setItem('easy11_consent_log', JSON.stringify(log));
  } catch {
    // ignore
  }
  return log;
}

export const useCookieConsentStore = create<CookieConsentState>()(
  persist(
    (set, get) => ({
      consentGiven: null,
      preferences: DEFAULT_PREFERENCES,
      consentLog: null,
      isPreferencesModalOpen: false,

      acceptAll: () => {
        const log = logConsent('accept_all', ALL_ENABLED);
        set({
          consentGiven: true,
          preferences: ALL_ENABLED,
          consentLog: log,
          isPreferencesModalOpen: false,
        });
        get().applyScripts();
      },

      rejectNonEssential: () => {
        const log = logConsent('reject_non_essential', ESSENTIAL_ONLY);
        set({
          consentGiven: true,
          preferences: ESSENTIAL_ONLY,
          consentLog: log,
          isPreferencesModalOpen: false,
        });
        get().applyScripts();
      },

      setPreferences: (prefs) => {
        set((s) => ({
          preferences: {
            ...s.preferences,
            ...prefs,
            essential: true, // always enforced
          },
        }));
      },

      savePreferences: (prefs) => {
        const final = {
          ...prefs,
          essential: true,
        };
        const log = logConsent('manage_preferences', final);
        set({
          consentGiven: true,
          preferences: final,
          consentLog: log,
          isPreferencesModalOpen: false,
        });
        get().applyScripts();
      },

      openPreferencesModal: () => set({ isPreferencesModalOpen: true }),
      closePreferencesModal: () => set({ isPreferencesModalOpen: false }),

      isAllowed: (category: CookieCategory) => {
        const p = get().preferences;
        if (category === 'essential') return true;
        return p[category] === true;
      },

      applyScripts: () => {
        // Called when consent changes - load/block scripts accordingly
        // Script loading is handled by useCookieScripts hook
        const ev = new CustomEvent('easy11-cookie-consent-changed', {
          detail: get().preferences,
        });
        window.dispatchEvent(ev);
      },
    }),
    {
      name: 'easy11-cookie-consent',
      version: 1,
      partialize: (s) => ({
        consentGiven: s.consentGiven,
        preferences: s.preferences,
        consentLog: s.consentLog,
      }),
    }
  )
);
