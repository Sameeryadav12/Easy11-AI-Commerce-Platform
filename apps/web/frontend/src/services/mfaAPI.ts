/**
 * MFA API Service Layer
 * Mock implementations of MFA backend endpoints
 * Sprint 2: MFA, Devices & Step-Up
 *
 * In production, replace these mocks with real axios/fetch calls to your backend.
 */

import type {
  MFAStatus,
  MFAFactor,
  WebAuthnRegistrationOptions,
  WebAuthnRegistrationCredential,
  WebAuthnAuthenticationOptions,
  WebAuthnAuthenticationCredential,
  TOTPEnrollmentData,
  SMSEnrollmentRequest,
  SMSEnrollmentResponse,
  MFAChallengeVerifyRequest,
  MFAChallengeVerifyResponse,
  RecoveryCodes,
  Device,
  Session,
  StepUpChallenge,
  WebAuthnCredential,
} from '../types/mfa';

// ====================  Delay helper for realistic UX ====================
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ==================== Mock Data ====================
const MOCK_USER_ID = 'user-123';
const MOCK_USER_EMAIL = 'john@example.com';
const MOCK_USER_NAME = 'John Doe';

// ==================== MFA Status ====================

export const getMFAStatus = async (): Promise<MFAStatus> => {
  await delay(500);

  // Check localStorage for persisted MFA state
  const mfaStore = localStorage.getItem('easy11-mfa');
  if (mfaStore) {
    const parsed = JSON.parse(mfaStore);
    if (parsed.state?.status) {
      return parsed.state.status;
    }
  }

  // Default: MFA not enabled
  return {
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
};

export const setDefaultMFAFactor = async (factor: MFAFactor): Promise<{ status: string }> => {
  await delay(300);
  console.log(`[MFA API] Setting default factor to: ${factor}`);
  return { status: 'ok' };
};

// ==================== WebAuthn (Passkeys) ====================

export const getWebAuthnRegistrationOptions = async (
  displayName: string
): Promise<WebAuthnRegistrationOptions> => {
  await delay(400);

  // Generate a random challenge (in real app, from server)
  const challenge = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));

  return {
    challenge,
    rp: {
      name: 'Easy11',
      id: window.location.hostname, // 'localhost' or 'easy11.com'
    },
    user: {
      id: btoa(MOCK_USER_ID), // Opaque user handle
      name: MOCK_USER_EMAIL,
      displayName: displayName || MOCK_USER_NAME,
    },
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 }, // ES256
      { type: 'public-key', alg: -257 }, // RS256
    ],
    timeout: 60000,
    authenticatorSelection: {
      authenticatorAttachment: 'platform', // Prefer built-in (Face ID, Touch ID, Windows Hello)
      residentKey: 'preferred',
      userVerification: 'required',
    },
    attestation: 'none',
  };
};

export const verifyWebAuthnRegistration = async (
  credential: WebAuthnRegistrationCredential
): Promise<{ status: string; credentialId: string; message: string }> => {
  await delay(600);

  // In real app, send to server for verification
  console.log('[MFA API] Verifying WebAuthn registration:', credential);

  // Mock success
  return {
    status: 'ok',
    credentialId: credential.id,
    message: 'Passkey registered successfully',
  };
};

export const getWebAuthnAuthenticationOptions = async (): Promise<WebAuthnAuthenticationOptions> => {
  await delay(300);

  // In real app, fetch user's enrolled credentials from server
  const challenge = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));

  return {
    challenge,
    allowCredentials: [
      // Mock: user has one passkey enrolled
      {
        id: 'mock-credential-id-base64',
        type: 'public-key',
        transports: ['internal'], // Built-in authenticator
      },
    ],
    timeout: 60000,
    userVerification: 'required',
  };
};

export const verifyWebAuthnAuthentication = async (
  credential: WebAuthnAuthenticationCredential
): Promise<MFAChallengeVerifyResponse> => {
  await delay(600);

  console.log('[MFA API] Verifying WebAuthn authentication:', credential);

  // Mock success
  return {
    status: 'ok',
    mfa_token: 'mock-mfa-token-' + Date.now(),
    message: 'Authentication successful',
  };
};

export const getPasskeyCredentials = async (): Promise<WebAuthnCredential[]> => {
  await delay(400);

  // Mock: return stored passkeys
  return [
    {
      id: 'cred-1',
      credential_id: 'mock-credential-id-1',
      label: 'MacBook Pro (Touch ID)',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      last_used_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      transports: ['internal'],
    },
  ];
};

export const removePasskey = async (credentialId: string): Promise<{ status: string }> => {
  await delay(400);
  console.log(`[MFA API] Removing passkey: ${credentialId}`);
  return { status: 'ok' };
};

// ==================== TOTP (Authenticator App) ====================

export const enrollTOTP = async (): Promise<TOTPEnrollmentData> => {
  await delay(500);

  // Generate a random Base32 secret (in real app, from server)
  const secret = generateBase32Secret();
  const issuer = 'Easy11';
  const accountName = MOCK_USER_EMAIL;

  // Build otpauth:// URI
  const otpauthUri = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(
    accountName
  )}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;

  // Generate QR code data URL (using a library like qrcode in real app)
  const qrCode = await generateQRCode(otpauthUri);

  return {
    otpauth_uri: otpauthUri,
    qr_code: qrCode,
    secret,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  };
};

export const verifyTOTP = async (code: string): Promise<{ status: string; message: string }> => {
  await delay(400);

  // In real app, verify code against secret on server
  console.log(`[MFA API] Verifying TOTP code: ${code}`);

  // Mock: accept "123456" as valid
  if (code === '123456') {
    return { status: 'ok', message: 'TOTP enrolled successfully' };
  }

  throw new Error('Invalid code');
};

export const challengeTOTP = async (code: string): Promise<MFAChallengeVerifyResponse> => {
  await delay(400);

  console.log(`[MFA API] TOTP challenge code: ${code}`);

  // Mock: accept "123456" as valid
  if (code === '123456') {
    return {
      status: 'ok',
      mfa_token: 'mock-mfa-token-' + Date.now(),
    };
  }

  return {
    status: 'error',
    error_code: 'INVALID_CODE',
    message: 'Invalid code',
    attempts_remaining: 4,
  };
};

// ==================== SMS ====================

export const enrollSMS = async (request: SMSEnrollmentRequest): Promise<SMSEnrollmentResponse> => {
  await delay(800);

  const { phone } = request;

  // Mask phone for display
  const masked = phone.replace(/(\+\d{2})\d+(\d{3})/, '$1 *** *** $2');

  console.log(`[MFA API] Sending SMS code to: ${masked}`);

  return {
    status: 'code_sent',
    masked_phone: masked,
    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 min
  };
};

export const verifySMS = async (code: string): Promise<{ status: string; message: string }> => {
  await delay(400);

  console.log(`[MFA API] Verifying SMS code: ${code}`);

  // Mock: accept "123456" as valid
  if (code === '123456') {
    return { status: 'ok', message: 'Phone verified' };
  }

  throw new Error('Invalid code');
};

export const challengeSMS = async (): Promise<{ status: string; masked_phone: string }> => {
  await delay(800);

  console.log('[MFA API] Sending SMS challenge code');

  return {
    status: 'code_sent',
    masked_phone: '+61 4** *** **3',
  };
};

export const verifySMSChallenge = async (code: string): Promise<MFAChallengeVerifyResponse> => {
  await delay(400);

  console.log(`[MFA API] Verifying SMS challenge code: ${code}`);

  // Mock: accept "123456" as valid
  if (code === '123456') {
    return {
      status: 'ok',
      mfa_token: 'mock-mfa-token-' + Date.now(),
    };
  }

  return {
    status: 'error',
    error_code: 'INVALID_CODE',
    message: 'Invalid code',
    attempts_remaining: 2,
  };
};

// ==================== Recovery Codes ====================

export const generateRecoveryCodes = async (): Promise<RecoveryCodes> => {
  await delay(600);

  // Generate 10 recovery codes
  const codes = Array.from({ length: 10 }, () => generateRecoveryCode());

  return {
    codes,
    version: 1,
    created_at: new Date().toISOString(),
  };
};

export const consumeRecoveryCode = async (
  code: string
): Promise<{ status: string; mfa_token: string; remaining_codes: number }> => {
  await delay(400);

  console.log(`[MFA API] Consuming recovery code: ${code}`);

  // Mock: accept any code starting with "EASY"
  if (code.startsWith('EASY')) {
    return {
      status: 'ok',
      mfa_token: 'mock-mfa-token-' + Date.now(),
      remaining_codes: 9,
    };
  }

  throw new Error('Invalid or already used recovery code');
};

// ==================== Step-Up Authentication ====================

export const createStepUpChallenge = async (
  purpose: string
): Promise<StepUpChallenge> => {
  await delay(300);

  const challengeId = 'stepup-' + Date.now();

  return {
    challenge_id: challengeId,
    purpose,
    factors_available: ['webauthn', 'totp'], // Mock: user has these enrolled
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 min
  };
};

export const verifyStepUpChallenge = async (
  challengeId: string,
  request: MFAChallengeVerifyRequest
): Promise<{ status: string; step_up_token: string; expires_at: string }> => {
  await delay(600);

  console.log(`[MFA API] Verifying step-up challenge: ${challengeId}`, request);

  // Mock success
  return {
    status: 'ok',
    step_up_token: 'mock-stepup-token-' + Date.now(),
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 min
  };
};

// ==================== Devices ====================

export const getDevices = async (): Promise<Device[]> => {
  await delay(400);

  // Mock device list
  return [
    {
      id: 'device-1',
      user_id: MOCK_USER_ID,
      label: 'MacBook Pro (Chrome)',
      os: 'macOS',
      browser: 'Chrome',
      trusted: true,
      trust_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      last_ip: '203.123.45.67',
      last_location: 'Melbourne, Australia',
      last_seen: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min ago
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      is_current: true,
    },
    {
      id: 'device-2',
      user_id: MOCK_USER_ID,
      label: 'iPhone 15 (Safari)',
      os: 'iOS',
      browser: 'Safari',
      trusted: true,
      trust_expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      last_ip: '203.123.45.68',
      last_location: 'Sydney, Australia',
      last_seen: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
      is_current: false,
    },
  ];
};

export const revokeDevice = async (
  deviceId: string
): Promise<{ status: string; message: string; sessions_invalidated: number }> => {
  await delay(400);
  console.log(`[MFA API] Revoking device: ${deviceId}`);

  return {
    status: 'ok',
    message: 'Device revoked',
    sessions_invalidated: 2, // Mock: 2 sessions were active on this device
  };
};

export const renameDevice = async (
  deviceId: string,
  label: string
): Promise<{ status: string }> => {
  await delay(300);
  console.log(`[MFA API] Renaming device ${deviceId} to: ${label}`);

  return { status: 'ok' };
};

// ==================== Sessions ====================

export const getSessions = async (): Promise<Session[]> => {
  await delay(400);

  // Mock session list
  return [
    {
      id: 'session-1',
      user_id: MOCK_USER_ID,
      device_id: 'device-1',
      device_label: 'MacBook Pro (Chrome)',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      last_seen: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min ago
      last_ip: '203.123.45.67',
      last_location: 'Melbourne, Australia',
      is_current: true,
      is_trusted: true,
      mfa_completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      risk_flags: [],
    },
    {
      id: 'session-2',
      user_id: MOCK_USER_ID,
      device_id: 'device-2',
      device_label: 'iPhone 15 (Safari)',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      last_seen: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      last_ip: '203.123.45.68',
      last_location: 'Sydney, Australia',
      is_current: false,
      is_trusted: true,
      mfa_completed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      risk_flags: [],
    },
  ];
};

export const revokeSession = async (sessionId: string): Promise<{ status: string; message: string }> => {
  await delay(400);
  console.log(`[MFA API] Revoking session: ${sessionId}`);

  return {
    status: 'ok',
    message: 'Session signed out',
  };
};

// ==================== Utility Functions ====================

function generateBase32Secret(): string {
  // Base32 alphabet
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const length = 32;
  let secret = '';
  for (let i = 0; i < length; i++) {
    secret += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return secret;
}

function generateRecoveryCode(): string {
  // Format: EASY-1234-ABCD-5678
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const parts = [];
  for (let i = 0; i < 4; i++) {
    let part = '';
    for (let j = 0; j < 4; j++) {
      part += chars[Math.floor(Math.random() * chars.length)];
    }
    parts.push(part);
  }
  return 'EASY-' + parts.join('-');
}

async function generateQRCode(text: string): Promise<string> {
  // In a real app, use a library like 'qrcode' to generate the image
  // For now, return a placeholder data URL
  await delay(200);

  // This is a placeholder - in production, use a real QR code library
  // e.g., import QRCode from 'qrcode'; return await QRCode.toDataURL(text);

  // For demo purposes, we'll return a simple SVG placeholder
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#ffffff"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="monospace" font-size="12" fill="#000000">
        QR Code Placeholder
      </text>
      <text x="50%" y="60%" text-anchor="middle" dy=".3em" font-family="monospace" font-size="8" fill="#666666">
        (Use real QR library)
      </text>
    </svg>
  `;

  return 'data:image/svg+xml;base64,' + btoa(svg);
}

// ==================== Export All ====================

const mfaAPI = {
  getMFAStatus,
  setDefaultMFAFactor,
  getWebAuthnRegistrationOptions,
  verifyWebAuthnRegistration,
  getWebAuthnAuthenticationOptions,
  verifyWebAuthnAuthentication,
  getPasskeyCredentials,
  removePasskey,
  enrollTOTP,
  verifyTOTP,
  challengeTOTP,
  enrollSMS,
  verifySMS,
  challengeSMS,
  verifySMSChallenge,
  generateRecoveryCodes,
  consumeRecoveryCode,
  createStepUpChallenge,
  verifyStepUpChallenge,
  getDevices,
  revokeDevice,
  renameDevice,
  getSessions,
  revokeSession,
};

export default mfaAPI;

