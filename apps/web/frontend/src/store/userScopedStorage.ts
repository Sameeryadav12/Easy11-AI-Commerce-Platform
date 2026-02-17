// User-scoped localStorage wrapper for Zustand persist.
// Prevents cross-user leakage of persisted client state (cart, rewards, etc.)

type StorageLike = {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
};

const CURRENT_USER_KEY = 'easy11-current-user-id';

function getScope(): string {
  if (typeof window === 'undefined') return 'ssr';
  try {
    return window.localStorage.getItem(CURRENT_USER_KEY) || 'anon';
  } catch {
    return 'anon';
  }
}

function scoped(name: string): string {
  return `${name}::${getScope()}`;
}

export const userScopedStorage: StorageLike = {
  getItem(name) {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(scoped(name));
    } catch {
      return null;
    }
  },
  setItem(name, value) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(scoped(name), value);
    } catch {
      // ignore
    }
  },
  removeItem(name) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(scoped(name));
    } catch {
      // ignore
    }
  },
};

export function setCurrentUserScope(userId: string | null | undefined) {
  if (typeof window === 'undefined') return;
  try {
    if (userId) window.localStorage.setItem(CURRENT_USER_KEY, userId);
    else window.localStorage.removeItem(CURRENT_USER_KEY);
  } catch {
    // ignore
  }
}

