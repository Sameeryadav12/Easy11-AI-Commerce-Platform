/**
 * MFA Zustand Store
 * Manages Multi-Factor Authentication state
 * Sprint 2: MFA, Devices & Step-Up
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  MFAStatus,
  MFAFactor,
  MFAChallenge,
  StepUpChallenge,
  Device,
  Session,
  WebAuthnCredential,
  RecoveryCodes,
  MFAEnrollmentState,
} from '../types/mfa';

interface MFAState {
  // MFA Status
  status: MFAStatus | null;
  isLoading: boolean;
  error: string | null;

  // Enrollment State
  enrollmentState: MFAEnrollmentState;

  // WebAuthn Credentials
  passkeyCredentials: WebAuthnCredential[];

  // Recovery Codes
  recoveryCodes: RecoveryCodes | null;

  // Challenge & Step-Up
  currentChallenge: MFAChallenge | null;
  currentStepUp: StepUpChallenge | null;
  isChallengeOpen: boolean;
  isStepUpOpen: boolean;

  // Devices & Sessions
  devices: Device[];
  sessions: Session[];
  currentDeviceId: string | null;
  currentSessionId: string | null;

  // Step-Up Token (for sensitive actions)
  stepUpToken: string | null;
  stepUpExpiresAt: string | null;

  // Actions: MFA Status
  setStatus: (status: MFAStatus) => void;
  fetchStatus: () => Promise<void>;
  setDefaultFactor: (factor: MFAFactor) => Promise<void>;

  // Actions: Enrollment
  startEnrollment: (factor: MFAFactor) => void;
  setEnrollmentStep: (step: number) => void;
  setEnrollmentData: (data: unknown) => void;
  setEnrollmentError: (error: string | null) => void;
  resetEnrollment: () => void;

  // Actions: Passkeys
  addPasskey: (credential: WebAuthnCredential) => void;
  removePasskey: (credentialId: string) => Promise<void>;
  setPasskeyCredentials: (credentials: WebAuthnCredential[]) => void;

  // Actions: Recovery Codes
  setRecoveryCodes: (codes: RecoveryCodes) => void;
  clearRecoveryCodes: () => void;

  // Actions: Challenge
  setChallenge: (challenge: MFAChallenge) => void;
  openChallenge: () => void;
  closeChallenge: () => void;
  clearChallenge: () => void;

  // Actions: Step-Up
  setStepUp: (stepUp: StepUpChallenge) => void;
  openStepUp: () => void;
  closeStepUp: () => void;
  clearStepUp: () => void;
  setStepUpToken: (token: string, expiresAt: string) => void;
  clearStepUpToken: () => void;
  isStepUpValid: () => boolean;

  // Actions: Devices
  setDevices: (devices: Device[]) => void;
  addDevice: (device: Device) => void;
  removeDevice: (deviceId: string) => Promise<void>;
  renameDevice: (deviceId: string, label: string) => Promise<void>;
  setCurrentDevice: (deviceId: string) => void;

  // Actions: Sessions
  setSessions: (sessions: Session[]) => void;
  removeSession: (sessionId: string) => Promise<void>;
  setCurrentSession: (sessionId: string) => void;

  // Actions: General
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialEnrollmentState: MFAEnrollmentState = {
  step: 1,
  factor: null,
  data: null,
  isLoading: false,
  error: null,
};

export const useMFAStore = create<MFAState>()(
  persist(
    (set, get) => ({
      // Initial State
      status: null,
      isLoading: false,
      error: null,
      enrollmentState: initialEnrollmentState,
      passkeyCredentials: [],
      recoveryCodes: null,
      currentChallenge: null,
      currentStepUp: null,
      isChallengeOpen: false,
      isStepUpOpen: false,
      devices: [],
      sessions: [],
      currentDeviceId: null,
      currentSessionId: null,
      stepUpToken: null,
      stepUpExpiresAt: null,

      // MFA Status Actions
      setStatus: (status) => set({ status }),

      fetchStatus: async () => {
        set({ isLoading: true, error: null });
        try {
          // In real app: const response = await mfaAPI.getStatus();
          // Mock response
          const mockStatus: MFAStatus = {
            enabled: false,
            default_factor: null,
            factors: {
              webauthn: 0,
              totp: 0,
              sms: 0,
            },
            recovery_codes_count: 0,
            last_challenged_at: null,
          };
          set({ status: mockStatus, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch MFA status',
            isLoading: false,
          });
        }
      },

      setDefaultFactor: async (factor) => {
        set({ isLoading: true, error: null });
        try {
          // In real app: await mfaAPI.setDefaultFactor(factor);
          set((state) => ({
            status: state.status
              ? { ...state.status, default_factor: factor }
              : null,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to set default factor',
            isLoading: false,
          });
        }
      },

      // Enrollment Actions
      startEnrollment: (factor) =>
        set({
          enrollmentState: {
            ...initialEnrollmentState,
            factor,
            step: 2, // Move to setup step
          },
        }),

      setEnrollmentStep: (step) =>
        set((state) => ({
          enrollmentState: { ...state.enrollmentState, step },
        })),

      setEnrollmentData: (data) =>
        set((state) => ({
          enrollmentState: { ...state.enrollmentState, data },
        })),

      setEnrollmentError: (error) =>
        set((state) => ({
          enrollmentState: { ...state.enrollmentState, error },
        })),

      resetEnrollment: () => set({ enrollmentState: initialEnrollmentState }),

      // Passkey Actions
      addPasskey: (credential) =>
        set((state) => ({
          passkeyCredentials: [...state.passkeyCredentials, credential],
          status: state.status
            ? {
                ...state.status,
                factors: {
                  ...state.status.factors,
                  webauthn: state.status.factors.webauthn + 1,
                },
                enabled: true,
              }
            : null,
        })),

      removePasskey: async (credentialId) => {
        set({ isLoading: true, error: null });
        try {
          // In real app: await mfaAPI.removePasskey(credentialId);
          set((state) => ({
            passkeyCredentials: state.passkeyCredentials.filter(
              (c) => c.credential_id !== credentialId
            ),
            status: state.status
              ? {
                  ...state.status,
                  factors: {
                    ...state.status.factors,
                    webauthn: Math.max(0, state.status.factors.webauthn - 1),
                  },
                }
              : null,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to remove passkey',
            isLoading: false,
          });
        }
      },

      setPasskeyCredentials: (credentials) => set({ passkeyCredentials: credentials }),

      // Recovery Codes Actions
      setRecoveryCodes: (codes) => set({ recoveryCodes: codes }),
      clearRecoveryCodes: () => set({ recoveryCodes: null }),

      // Challenge Actions
      setChallenge: (challenge) => set({ currentChallenge: challenge }),
      openChallenge: () => set({ isChallengeOpen: true }),
      closeChallenge: () => set({ isChallengeOpen: false }),
      clearChallenge: () => set({ currentChallenge: null, isChallengeOpen: false }),

      // Step-Up Actions
      setStepUp: (stepUp) => set({ currentStepUp: stepUp }),
      openStepUp: () => set({ isStepUpOpen: true }),
      closeStepUp: () => set({ isStepUpOpen: false }),
      clearStepUp: () => set({ currentStepUp: null, isStepUpOpen: false }),

      setStepUpToken: (token, expiresAt) =>
        set({ stepUpToken: token, stepUpExpiresAt: expiresAt }),

      clearStepUpToken: () => set({ stepUpToken: null, stepUpExpiresAt: null }),

      isStepUpValid: () => {
        const state = get();
        if (!state.stepUpToken || !state.stepUpExpiresAt) return false;
        const now = new Date();
        const expiresAt = new Date(state.stepUpExpiresAt);
        return now < expiresAt;
      },

      // Device Actions
      setDevices: (devices) => set({ devices }),

      addDevice: (device) =>
        set((state) => ({
          devices: [...state.devices, device],
        })),

      removeDevice: async (deviceId) => {
        set({ isLoading: true, error: null });
        try {
          // In real app: await mfaAPI.revokeDevice(deviceId);
          set((state) => ({
            devices: state.devices.filter((d) => d.id !== deviceId),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to remove device',
            isLoading: false,
          });
        }
      },

      renameDevice: async (deviceId, label) => {
        set({ isLoading: true, error: null });
        try {
          // In real app: await mfaAPI.renameDevice(deviceId, label);
          set((state) => ({
            devices: state.devices.map((d) =>
              d.id === deviceId ? { ...d, label } : d
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to rename device',
            isLoading: false,
          });
        }
      },

      setCurrentDevice: (deviceId) => set({ currentDeviceId: deviceId }),

      // Session Actions
      setSessions: (sessions) => set({ sessions }),

      removeSession: async (sessionId) => {
        set({ isLoading: true, error: null });
        try {
          // In real app: await mfaAPI.revokeSession(sessionId);
          set((state) => ({
            sessions: state.sessions.filter((s) => s.id !== sessionId),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to remove session',
            isLoading: false,
          });
        }
      },

      setCurrentSession: (sessionId) => set({ currentSessionId: sessionId }),

      // General Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      reset: () =>
        set({
          status: null,
          isLoading: false,
          error: null,
          enrollmentState: initialEnrollmentState,
          passkeyCredentials: [],
          recoveryCodes: null,
          currentChallenge: null,
          currentStepUp: null,
          isChallengeOpen: false,
          isStepUpOpen: false,
          devices: [],
          sessions: [],
          currentDeviceId: null,
          currentSessionId: null,
          stepUpToken: null,
          stepUpExpiresAt: null,
        }),
    }),
    {
      name: 'easy11-mfa',
      getStorage: () => localStorage,
      // Only persist non-sensitive data
      partialize: (state) => ({
        status: state.status,
        passkeyCredentials: state.passkeyCredentials.map((c) => ({
          id: c.id,
          credential_id: c.credential_id,
          label: c.label,
          created_at: c.created_at,
          last_used_at: c.last_used_at,
          transports: c.transports,
        })),
        currentDeviceId: state.currentDeviceId,
        currentSessionId: state.currentSessionId,
        // DO NOT persist: challenges, step-up tokens, recovery codes, sessions
      }),
    }
  )
);

