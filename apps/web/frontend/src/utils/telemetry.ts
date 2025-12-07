/**
 * Telemetry & Analytics Utility
 * Sprint 2: MFA - Event tracking for analytics
 */

import type { MFATelemetryEvent } from '../types/mfa';

/**
 * Track MFA events for analytics
 * In production, send to your analytics service (PostHog, Mixpanel, GA4, etc.)
 */
export function trackMFAEvent(event: MFATelemetryEvent): void {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('[Telemetry]', event);
  }

  // In production, send to analytics backend
  // Example with PostHog:
  // posthog.capture(event.event_type, {
  //   user_id: event.user_id,
  //   factor: event.factor,
  //   ...event.metadata,
  //   timestamp: event.timestamp,
  // });

  // Example with custom backend:
  // fetch('/api/analytics/events', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(event),
  // });

  // For now, just store locally for development
  try {
    const events = JSON.parse(localStorage.getItem('easy11-telemetry') || '[]');
    events.push(event);
    // Keep only last 100 events
    if (events.length > 100) events.shift();
    localStorage.setItem('easy11-telemetry', JSON.stringify(events));
  } catch (e) {
    console.warn('[Telemetry] Failed to store event:', e);
  }
}

/**
 * Track MFA enrollment events
 */
export const mfaTelemetry = {
  enrollStarted: (factor: string, userId?: string) => {
    trackMFAEvent({
      event_type: 'mfa.enroll_started',
      user_id: userId,
      factor: factor as any,
      timestamp: new Date().toISOString(),
    });
  },

  enrollSuccess: (factor: string, userId?: string, timeMs?: number) => {
    trackMFAEvent({
      event_type: 'mfa.enroll_success',
      user_id: userId,
      factor: factor as any,
      metadata: { time_to_complete_ms: timeMs },
      timestamp: new Date().toISOString(),
    });
  },

  enrollFail: (factor: string, errorCode: string, userId?: string) => {
    trackMFAEvent({
      event_type: 'mfa.enroll_fail',
      user_id: userId,
      factor: factor as any,
      metadata: { error_code: errorCode },
      timestamp: new Date().toISOString(),
    });
  },

  challengeStarted: (factor: string, trigger: string, userId?: string) => {
    trackMFAEvent({
      event_type: 'mfa.challenge_started',
      user_id: userId,
      factor: factor as any,
      metadata: { trigger },
      timestamp: new Date().toISOString(),
    });
  },

  challengeSuccess: (factor: string, userId?: string, timeMs?: number) => {
    trackMFAEvent({
      event_type: 'mfa.challenge_success',
      user_id: userId,
      factor: factor as any,
      metadata: { time_to_complete_ms: timeMs },
      timestamp: new Date().toISOString(),
    });
  },

  challengeFail: (factor: string, errorCode: string, userId?: string) => {
    trackMFAEvent({
      event_type: 'mfa.challenge_fail',
      user_id: userId,
      factor: factor as any,
      metadata: { error_code: errorCode },
      timestamp: new Date().toISOString(),
    });
  },

  defaultChanged: (fromFactor: string, toFactor: string, userId?: string) => {
    trackMFAEvent({
      event_type: 'mfa.default_changed',
      user_id: userId,
      metadata: { from_factor: fromFactor, to_factor: toFactor },
      timestamp: new Date().toISOString(),
    });
  },

  factorRemoved: (factor: string, userId?: string) => {
    trackMFAEvent({
      event_type: 'mfa.factor_removed',
      user_id: userId,
      factor: factor as any,
      timestamp: new Date().toISOString(),
    });
  },

  recoveryGenerated: (userId?: string) => {
    trackMFAEvent({
      event_type: 'mfa.recovery_generated',
      user_id: userId,
      timestamp: new Date().toISOString(),
    });
  },

  recoveryUsed: (success: boolean, remaining: number, userId?: string) => {
    trackMFAEvent({
      event_type: 'mfa.recovery_used',
      user_id: userId,
      metadata: { success, remaining_codes: remaining },
      timestamp: new Date().toISOString(),
    });
  },

  deviceAdded: (os: string, browser: string, location: string, userId?: string) => {
    trackMFAEvent({
      event_type: 'security.device_added',
      user_id: userId,
      metadata: { os, browser, location },
      timestamp: new Date().toISOString(),
    });
  },

  deviceRenamed: (deviceId: string, userId?: string) => {
    trackMFAEvent({
      event_type: 'security.device_renamed',
      user_id: userId,
      metadata: { device_id: deviceId },
      timestamp: new Date().toISOString(),
    });
  },

  deviceRevoked: (deviceId: string, sessionsCount: number, userId?: string) => {
    trackMFAEvent({
      event_type: 'security.device_revoked',
      user_id: userId,
      metadata: { device_id: deviceId, sessions_count: sessionsCount },
      timestamp: new Date().toISOString(),
    });
  },

  sessionRevoked: (sessionId: string, userId?: string) => {
    trackMFAEvent({
      event_type: 'security.session_revoked',
      user_id: userId,
      metadata: { session_id: sessionId },
      timestamp: new Date().toISOString(),
    });
  },

  stepUpTriggered: (purpose: string, userId?: string) => {
    trackMFAEvent({
      event_type: 'risk.stepup_triggered',
      user_id: userId,
      metadata: { purpose },
      timestamp: new Date().toISOString(),
    });
  },

  stepUpSuccess: (purpose: string, userId?: string, timeMs?: number) => {
    trackMFAEvent({
      event_type: 'risk.stepup_success',
      user_id: userId,
      metadata: { purpose, time_to_complete_ms: timeMs },
      timestamp: new Date().toISOString(),
    });
  },

  stepUpFail: (purpose: string, errorCode: string, userId?: string) => {
    trackMFAEvent({
      event_type: 'risk.stepup_fail',
      user_id: userId,
      metadata: { purpose, error_code: errorCode },
      timestamp: new Date().toISOString(),
    });
  },

  smsRateLimit: (phoneHash: string, count: number) => {
    trackMFAEvent({
      event_type: 'sms.rate_limit_triggered',
      metadata: { phone_hash: phoneHash, window_count: count },
      timestamp: new Date().toISOString(),
    });
  },

  totpInvalidAttempts: (count: number, userId?: string) => {
    trackMFAEvent({
      event_type: 'totp.invalid_attempts',
      user_id: userId,
      metadata: { count },
      timestamp: new Date().toISOString(),
    });
  },
};

/**
 * Get all tracked events (for development/debugging)
 */
export function getTelemetryEvents(): MFATelemetryEvent[] {
  try {
    return JSON.parse(localStorage.getItem('easy11-telemetry') || '[]');
  } catch (e) {
    return [];
  }
}

/**
 * Clear telemetry events (for development/debugging)
 */
export function clearTelemetryEvents(): void {
  localStorage.removeItem('easy11-telemetry');
}

export default mfaTelemetry;

