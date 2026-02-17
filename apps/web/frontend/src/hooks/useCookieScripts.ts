/**
 * useCookieScripts
 *
 * Loads non-essential scripts (analytics, marketing) ONLY when user has consented.
 * Scripts are BLOCKED until consent. Register scripts via registerCookieGatedScript().
 * Example (when adding GA/FB/Hotjar):
 *   registerCookieGatedScript('ga', 'analytics', () => loadGoogleAnalytics());
 *   registerCookieGatedScript('fb', 'marketing', () => loadFacebookPixel());
 */

import { useEffect, useRef } from 'react';
import { useCookieConsentStore } from '../store/cookieConsentStore';

/** Scripts that should only load when consent given */
const SCRIPT_REGISTRY: Record<string, { category: 'analytics' | 'marketing'; load: () => void }> = {};

export function registerCookieGatedScript(
  id: string,
  category: 'analytics' | 'marketing',
  loadFn: () => void
) {
  SCRIPT_REGISTRY[id] = { category, load: loadFn };
}

/**
 * Hook that applies consent-based script loading.
 * Dispatches when consent changes and loads/revokes scripts accordingly.
 */
export function useCookieScripts() {
  const preferences = useCookieConsentStore((s) => s.preferences);
  const consentGiven = useCookieConsentStore((s) => s.consentGiven);
  const loadedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Only apply when user has made a choice
    if (consentGiven !== true) return;

    Object.entries(SCRIPT_REGISTRY).forEach(([id, { category, load }]) => {
      const allowed = preferences[category];
      if (allowed && !loadedRef.current.has(id)) {
        try {
          load();
          loadedRef.current.add(id);
        } catch {
          // ignore
        }
      } else if (!allowed && loadedRef.current.has(id)) {
        loadedRef.current.delete(id);
        // Note: Cannot unload scripts once injected. Best practice is to not load until consent.
      }
    });
  }, [consentGiven, preferences]);
}
