/**
 * Multi-Factor Authentication (MFA) Types
 * Sprint 2: MFA, Devices & Step-Up
 */

// ==================== MFA Factor Types ====================

export type MFAFactor = 'webauthn' | 'totp' | 'sms';

export type MFAFactorStatus = 'not_enrolled' | 'enrolled' | 'enabled';

// ==================== MFA Status ====================

export interface MFAStatus {
  enabled: boolean;
  default_factor: MFAFactor | null;
  factors: {
    webauthn: number; // Count of enrolled passkeys
    totp: number; // 0 or 1
    sms: number; // 0 or 1
  };
  recovery_codes_count: number;
  last_challenged_at: string | null;
}

// ==================== WebAuthn (Passkeys) ====================

export interface WebAuthnRegistrationOptions {
  challenge: string; // Base64URL
  rp: {
    name: string; // "Easy11"
    id: string; // "easy11.com" or "localhost"
  };
  user: {
    id: string; // User handle (opaque)
    name: string; // "john@example.com"
    displayName: string; // "John Doe"
  };
  pubKeyCredParams: Array<{
    type: 'public-key';
    alg: number; // -7 (ES256), -257 (RS256)
  }>;
  timeout: number; // 60000 (60s)
  authenticatorSelection?: {
    authenticatorAttachment?: 'platform' | 'cross-platform';
    residentKey?: 'required' | 'preferred' | 'discouraged';
    userVerification?: 'required' | 'preferred' | 'discouraged';
  };
  attestation?: 'none' | 'direct' | 'indirect';
}

export interface WebAuthnRegistrationCredential {
  id: string; // Credential ID (Base64URL)
  rawId: string; // Raw credential ID
  response: {
    clientDataJSON: string;
    attestationObject: string;
  };
  type: 'public-key';
}

export interface WebAuthnAuthenticationOptions {
  challenge: string;
  allowCredentials: Array<{
    id: string; // Base64URL credential ID
    type: 'public-key';
    transports?: ('usb' | 'nfc' | 'ble' | 'internal')[];
  }>;
  timeout: number;
  userVerification: 'required' | 'preferred' | 'discouraged';
}

export interface WebAuthnAuthenticationCredential {
  id: string;
  rawId: string;
  response: {
    clientDataJSON: string;
    authenticatorData: string;
    signature: string;
    userHandle?: string;
  };
  type: 'public-key';
}

export interface WebAuthnCredential {
  id: string;
  credential_id: string;
  label: string; // "My iPhone", "Work Laptop"
  created_at: string;
  last_used_at: string | null;
  transports: string[];
}

// ==================== TOTP (Authenticator App) ====================

export interface TOTPEnrollmentData {
  otpauth_uri: string; // "otpauth://totp/Easy11:john@example.com?secret=..."
  qr_code: string; // Data URL of QR code image
  secret: string; // Base32 secret (for manual entry)
  algorithm: 'SHA1' | 'SHA256' | 'SHA512';
  digits: number; // 6 or 8
  period: number; // 30 seconds
}

export interface TOTPSecret {
  enabled: boolean;
  created_at: string;
  last_verified_at: string | null;
}

// ==================== SMS ====================

export interface SMSEnrollmentRequest {
  phone: string; // E.164 format: "+61412345678"
}

export interface SMSEnrollmentResponse {
  status: 'code_sent';
  masked_phone: string; // "+61 4** *** **3"
  expires_at: string;
}

export interface SMSData {
  enabled: boolean;
  masked_phone: string;
  verified_at: string;
  last_challenge_at: string | null;
}

// ==================== Recovery Codes ====================

export interface RecoveryCodes {
  codes: string[]; // ["ABCD-1234-EFGH-5678", ...]
  version: number;
  created_at: string;
}

// ==================== MFA Challenge ====================

export interface MFAChallenge {
  challenge_id: string;
  user_id: string;
  factors_available: MFAFactor[];
  default_factor: MFAFactor | null;
  trigger: 'login' | 'stepup' | 'risk';
  created_at: string;
  expires_at: string;
}

export interface MFAChallengeVerifyRequest {
  challenge_id?: string;
  factor: MFAFactor;
  code?: string; // For TOTP/SMS
  credential?: WebAuthnAuthenticationCredential; // For WebAuthn
}

export interface MFAChallengeVerifyResponse {
  status: 'ok' | 'error';
  mfa_token?: string; // Short-lived token for session creation
  step_up_token?: string; // For step-up challenges
  message?: string;
  error_code?: string;
  attempts_remaining?: number;
}

// ==================== Step-Up Authentication ====================

export interface StepUpChallenge {
  challenge_id: string;
  purpose: string; // 'change_email', 'add_payment', etc.
  factors_available: MFAFactor[];
  created_at: string;
  expires_at: string;
}

export interface StepUpToken {
  token: string;
  purpose: string;
  expires_at: string;
}

// ==================== Devices ====================

export interface Device {
  id: string;
  user_id: string;
  label: string; // "MacBook Pro (Chrome)"
  os: string; // "macOS", "Windows", "iOS", "Android"
  browser: string; // "Chrome", "Safari", "Firefox", "Edge"
  trusted: boolean;
  trust_expires_at: string | null;
  last_ip: string;
  last_location: string; // "Melbourne, Australia"
  last_seen: string;
  created_at: string;
  is_current?: boolean; // Is this the current device?
}

export interface DeviceFingerprint {
  ua_hash: string; // SHA256(User-Agent)
  os: string;
  browser: string;
  browser_version: string;
  os_version: string;
  platform: string;
  mobile: boolean;
  client_hints?: {
    brands?: string[];
    mobile?: boolean;
    platform?: string;
  };
}

// ==================== Sessions ====================

export interface Session {
  id: string;
  user_id: string;
  device_id: string | null;
  device_label: string;
  created_at: string;
  last_seen: string;
  last_ip: string;
  last_location: string;
  is_current: boolean;
  is_trusted: boolean;
  mfa_completed_at: string | null;
  risk_flags: string[];
}

// ==================== Risk Detection ====================

export interface RiskAssessment {
  risk_score: number; // 0-100
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  flags: RiskFlag[];
  require_mfa: boolean;
  require_stepup: boolean;
}

export interface RiskFlag {
  type:
    | 'new_device'
    | 'new_ip'
    | 'new_location'
    | 'impossible_travel'
    | 'velocity'
    | 'high_value_action'
    | 'data_export';
  severity: 'low' | 'medium' | 'high';
  description: string;
  detected_at: string;
}

// ==================== API Response Types ====================

export interface MFAEnrollResponse {
  status: 'ok' | 'error';
  message: string;
  data?: unknown;
}

export interface MFAFactorRemoveResponse {
  status: 'ok' | 'error';
  message: string;
}

export interface DeviceRevokeResponse {
  status: 'ok' | 'error';
  message: string;
  sessions_invalidated?: number;
}

export interface SessionRevokeResponse {
  status: 'ok' | 'error';
  message: string;
}

// ==================== Telemetry Events ====================

export interface MFATelemetryEvent {
  event_type:
    | 'mfa.enroll_started'
    | 'mfa.enroll_success'
    | 'mfa.enroll_fail'
    | 'mfa.challenge_started'
    | 'mfa.challenge_success'
    | 'mfa.challenge_fail'
    | 'mfa.default_changed'
    | 'mfa.factor_removed'
    | 'mfa.recovery_generated'
    | 'mfa.recovery_used'
    | 'security.device_added'
    | 'security.device_renamed'
    | 'security.device_revoked'
    | 'security.session_revoked'
    | 'risk.detected'
    | 'risk.stepup_triggered'
    | 'risk.stepup_success'
    | 'risk.stepup_fail'
    | 'sms.rate_limit_triggered'
    | 'totp.invalid_attempts';
  user_id?: string;
  factor?: MFAFactor;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

// ==================== Enrollment State ====================

export interface MFAEnrollmentState {
  step: number; // 1: Choose, 2: Setup, 3: Verify, 4: Recovery Codes
  factor: MFAFactor | null;
  data: unknown | null; // Factor-specific data (QR, phone, etc.)
  isLoading: boolean;
  error: string | null;
}

// ==================== UI State ====================

export interface MFAUIState {
  isChallengeOpen: boolean;
  isStepUpOpen: boolean;
  isEnrollmentOpen: boolean;
  currentChallenge: MFAChallenge | null;
  currentStepUp: StepUpChallenge | null;
}

// ==================== Rate Limiting ====================

export interface RateLimitStatus {
  is_limited: boolean;
  attempts_remaining: number;
  reset_at: string;
  window_seconds: number;
}

// ==================== Error Types ====================

export interface MFAError {
  code:
    | 'INVALID_CODE'
    | 'EXPIRED'
    | 'RATE_LIMITED'
    | 'INVALID_ATTESTATION'
    | 'CHALLENGE_MISMATCH'
    | 'TIMEOUT'
    | 'USER_CANCELLED'
    | 'NOT_SUPPORTED'
    | 'ALREADY_ENROLLED'
    | 'NOT_ENROLLED'
    | 'INVALID_PHONE'
    | 'SMS_FAILED'
    | 'ALREADY_USED';
  message: string;
  attempts_remaining?: number;
  reset_at?: string;
}

