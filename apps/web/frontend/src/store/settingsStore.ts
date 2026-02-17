import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { userScopedStorage } from './userScopedStorage';

/** UI language. 'auto' = browser locale. */
export type LanguageOption = 'auto' | 'English' | 'Spanish' | 'French' | 'German' | 'Hindi';

/** Display currency. 'auto' = by shipping country. Store targets Australia → default AUD. */
export type CurrencyOption = 'auto' | 'AUD' | 'USD' | 'EUR' | 'GBP' | 'INR';

export interface CustomerSettingsState {
  language: LanguageOption;
  currency: CurrencyOption;
  marketingEmails: boolean;
  orderUpdates: boolean;

  setSettings: (patch: Partial<Omit<CustomerSettingsState, 'setSettings' | 'reset'>>) => void;
  reset: () => void;
}

/** Defaults: Auto-detect language, AUD (Australia), notifications ON. */
const DEFAULT_SETTINGS: Pick<
  CustomerSettingsState,
  'language' | 'currency' | 'marketingEmails' | 'orderUpdates'
> = {
  language: 'auto',
  currency: 'AUD',
  marketingEmails: true,
  orderUpdates: true,
};

export const useCustomerSettingsStore = create<CustomerSettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setSettings: (patch) => set((state) => ({ ...state, ...patch })),
      reset: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'easy11-settings',
      version: 3,
      storage: createJSONStorage(() => userScopedStorage),
      skipHydration: true,
      migrate: (persisted: unknown, version: number) => {
        const p = persisted as Record<string, unknown>;
        if (p && typeof p === 'object' && version < 3) {
          const lang = (p as { language?: string }).language;
          const curr = (p as { currency?: string }).currency;
          if (lang !== 'auto' && !['auto', 'English', 'Hindi', 'Spanish', 'French', 'German'].includes(lang)) (p as { language: LanguageOption }).language = 'auto';
          if (curr !== 'auto' && !['auto', 'AUD', 'USD', 'EUR', 'GBP', 'INR'].includes(curr)) (p as { currency: CurrencyOption }).currency = 'AUD';
        }
        return p as CustomerSettingsState;
      },
      partialize: (state) => ({
        language: state.language,
        currency: state.currency,
        marketingEmails: state.marketingEmails,
        orderUpdates: state.orderUpdates,
      }),
    }
  )
);

