import { create } from 'zustand';

interface ApiStatusState {
  /** When true, show a global "service unavailable" message. */
  unavailable: boolean;
  setUnavailable: (value: boolean) => void;
}

export const useApiStatusStore = create<ApiStatusState>((set) => ({
  unavailable: false,
  setUnavailable: (value) => set({ unavailable: value }),
}));
