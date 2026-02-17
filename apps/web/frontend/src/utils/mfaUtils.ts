/**
 * MFA Utility Functions
 * Device fingerprinting, risk detection, validation helpers
 * Sprint 2: MFA, Devices & Step-Up
 */

import type { DeviceFingerprint, RiskAssessment, RiskFlag } from '../types/mfa';

// ==================== Device Fingerprinting ====================

/**
 * Generate a unique device fingerprint based on User-Agent and Client Hints
 */
export function getDeviceFingerprint(): DeviceFingerprint {
  const ua = navigator.userAgent;

  // Parse User-Agent for OS and browser info
  const osMatch = {
    Windows: /Windows NT/,
    macOS: /Mac OS X/,
    iOS: /iPhone|iPad|iPod/,
    Android: /Android/,
    Linux: /Linux/,
  };

  const browserMatch = {
    Chrome: /Chrome\/(\d+)/,
    Safari: /Version\/(\d+).*Safari/,
    Firefox: /Firefox\/(\d+)/,
    Edge: /Edg\/(\d+)/,
  };

  let os = 'Unknown';
  let osVersion = '';
  for (const [name, regex] of Object.entries(osMatch)) {
    if (regex.test(ua)) {
      os = name;
      const versionMatch = ua.match(/(?:Windows NT|Mac OS X|Android|iPhone OS) ([\d._]+)/);
      if (versionMatch) {
        osVersion = versionMatch[1].replace(/_/g, '.');
      }
      break;
    }
  }

  let browser = 'Unknown';
  let browserVersion = '';
  for (const [name, regex] of Object.entries(browserMatch)) {
    const match = ua.match(regex);
    if (match) {
      browser = name;
      browserVersion = match[1];
      break;
    }
  }

  const mobile = /Mobile|Android|iPhone|iPad|iPod/.test(ua);
  const platform = (navigator as any).platform || 'Unknown';

  // Client Hints (if available - modern browsers only)
  const clientHints = (navigator as any).userAgentData
    ? {
        brands: (navigator as any).userAgentData.brands?.map((b: any) => b.brand),
        mobile: (navigator as any).userAgentData.mobile,
        platform: (navigator as any).userAgentData.platform,
      }
    : undefined;

  // Generate a hash of the User-Agent (for server-side comparison)
  const uaHash = hashString(ua);

  return {
    ua_hash: uaHash,
    os,
    browser,
    browser_version: browserVersion,
    os_version: osVersion,
    platform,
    mobile,
    client_hints: clientHints,
  };
}

/**
 * Generate a friendly device label from fingerprint
 */
export function getDeviceLabel(fingerprint: DeviceFingerprint): string {
  const { os, browser, mobile } = fingerprint;

  if (mobile) {
    if (os === 'iOS') return `iPhone (${browser})`;
    if (os === 'Android') return `Android Phone (${browser})`;
    return `Mobile Device (${browser})`;
  }

  // Desktop
  if (os === 'macOS') return `MacBook (${browser})`;
  if (os === 'Windows') return `Windows PC (${browser})`;
  if (os === 'Linux') return `Linux (${browser})`;

  return `${os} (${browser})`;
}

/**
 * Simple hash function for strings (for UA hashing)
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

// ==================== Risk Detection ====================

interface StoredDeviceInfo {
  fingerprint: string;
  lastIP: string;
  lastLocation: string;
  lastSeen: string;
}

const STORAGE_KEY = 'easy11-device-info';

/**
 * Check if the current device/IP is new or suspicious
 */
export function assessRisk(currentIP?: string, currentLocation?: string): RiskAssessment {
  const flags: RiskFlag[] = [];
  let riskScore = 0;

  // Get current device fingerprint
  const currentFingerprint = getDeviceFingerprint();
  const currentFingerprintHash = currentFingerprint.ua_hash;

  // Get stored device info
  const stored = getStoredDeviceInfo();

  // Check: New Device?
  if (!stored || stored.fingerprint !== currentFingerprintHash) {
    flags.push({
      type: 'new_device',
      severity: 'high',
      description: 'Login from a new or unrecognized device',
      detected_at: new Date().toISOString(),
    });
    riskScore += 40;
  }

  // Check: New IP?
  if (currentIP && stored && stored.lastIP !== currentIP) {
    flags.push({
      type: 'new_ip',
      severity: 'medium',
      description: 'Login from a new IP address',
      detected_at: new Date().toISOString(),
    });
    riskScore += 20;
  }

  // Check: New Location?
  if (currentLocation && stored && stored.lastLocation !== currentLocation) {
    // Check if locations are drastically different (simplified)
    if (!isSameRegion(stored.lastLocation, currentLocation)) {
      flags.push({
        type: 'new_location',
        severity: 'medium',
        description: `Login from a new location: ${currentLocation}`,
        detected_at: new Date().toISOString(),
      });
      riskScore += 25;
    }
  }

  // Check: Impossible Travel?
  if (stored && stored.lastSeen && currentLocation && stored.lastLocation) {
    const timeSinceLastSeen = Date.now() - new Date(stored.lastSeen).getTime();
    const hoursSinceLastSeen = timeSinceLastSeen / (1000 * 60 * 60);

    // If location changed significantly in < 1 hour, flag as impossible travel
    if (hoursSinceLastSeen < 1 && !isSameRegion(stored.lastLocation, currentLocation)) {
      flags.push({
        type: 'impossible_travel',
        severity: 'high',
        description: 'Login from distant location too quickly',
        detected_at: new Date().toISOString(),
      });
      riskScore += 50;
    }
  }

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (riskScore >= 70) riskLevel = 'critical';
  else if (riskScore >= 40) riskLevel = 'high';
  else if (riskScore >= 20) riskLevel = 'medium';
  else riskLevel = 'low';

  // Decide if MFA or Step-Up is required
  const require_mfa = riskLevel === 'high' || riskLevel === 'critical';
  const require_stepup = riskLevel === 'critical';

  return {
    risk_score: riskScore,
    risk_level: riskLevel,
    flags,
    require_mfa,
    require_stepup,
  };
}

/**
 * Store current device info for future risk checks
 */
export function storeDeviceInfo(ip?: string, location?: string): void {
  const fingerprint = getDeviceFingerprint();

  const info: StoredDeviceInfo = {
    fingerprint: fingerprint.ua_hash,
    lastIP: ip || 'unknown',
    lastLocation: location || 'unknown',
    lastSeen: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  } catch (e) {
    console.warn('[MFA Utils] Failed to store device info:', e);
  }
}

/**
 * Get stored device info
 */
function getStoredDeviceInfo(): StoredDeviceInfo | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('[MFA Utils] Failed to get stored device info:', e);
  }
  return null;
}

/**
 * Simple region comparison (checks if countries/cities are similar)
 */
function isSameRegion(location1: string, location2: string): boolean {
  // Simplified: check if both locations contain same country/city keywords
  const normalize = (loc: string) => loc.toLowerCase().replace(/[^a-z]/g, '');
  const loc1 = normalize(location1);
  const loc2 = normalize(location2);

  // If strings are very similar, consider same region
  return loc1.includes(loc2.substring(0, 5)) || loc2.includes(loc1.substring(0, 5));
}

// ==================== WebAuthn Helpers ====================

/**
 * Check if WebAuthn is supported in the current browser
 */
export function isWebAuthnSupported(): boolean {
  return !!(
    window.PublicKeyCredential &&
    navigator.credentials &&
    navigator.credentials.create &&
    navigator.credentials.get
  );
}

/**
 * Get platform authenticator availability (Face ID, Touch ID, Windows Hello)
 */
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) return false;

  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch (e) {
    console.error('[MFA Utils] Error checking platform authenticator:', e);
    return false;
  }
}

// ==================== TOTP Helpers ====================

/**
 * Validate TOTP code format (6 digits)
 */
export function isValidTOTPCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

/**
 * Get current TOTP time step (for UI countdown)
 */
export function getTOTPTimeRemaining(): number {
  const now = Math.floor(Date.now() / 1000);
  const period = 30; // TOTP period in seconds
  const timeInPeriod = now % period;
  return period - timeInPeriod;
}

// ==================== SMS Helpers ====================

/**
 * Validate phone number format (E.164)
 */
export function isValidPhoneNumber(phone: string): boolean {
  // E.164 format: +[country code][number]
  // Example: +61412345678, +14155552671
  return /^\+\d{10,15}$/.test(phone);
}

/**
 * Format phone number for display (mask middle digits)
 */
export function maskPhoneNumber(phone: string): string {
  // Input: +61412345678
  // Output: +61 4** *** **8
  if (!phone.startsWith('+')) return phone;

  const match = phone.match(/^(\+\d{2})(\d+)(\d{3})$/);
  if (match) {
    const [, prefix, middle, suffix] = match;
    const masked = middle.replace(/\d/g, '*');
    return `${prefix} ${masked.slice(0, 3)} *** **${suffix[0]}`;
  }

  return phone;
}

// ==================== Recovery Code Helpers ====================

/**
 * Validate recovery code format (EASY-XXXX-XXXX-XXXX)
 */
export function isValidRecoveryCode(code: string): boolean {
  return /^EASY-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code.toUpperCase());
}

/**
 * Format recovery code input (auto-add dashes)
 */
export function formatRecoveryCodeInput(input: string): string {
  // Remove non-alphanumeric chars
  const cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, '');

  // Auto-prepend EASY if not present
  let formatted = cleaned.startsWith('EASY') ? cleaned : 'EASY' + cleaned;

  // Add dashes
  formatted = formatted.replace(/^(EASY)(.{0,4})(.{0,4})(.{0,4}).*/, (match, p1, p2, p3, p4) => {
    let result = p1;
    if (p2) result += '-' + p2;
    if (p3) result += '-' + p3;
    if (p4) result += '-' + p4;
    return result;
  });

  return formatted;
}

// ==================== Time Formatting ====================

/**
 * Format time remaining for display
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return 'Expired';
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) return `${minutes}m`;
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Format date and time for "Last activity" display (e.g., "Feb 10, 2026 – 10:23 PM")
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const datePart = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${datePart} – ${timePart}`;
}

/**
 * Get relative time string (e.g., "2 minutes ago", "3 hours ago")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return days === 1 ? '1 day ago' : `${days} days ago`;
  if (hours > 0) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  if (minutes > 0) return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  if (seconds > 10) return `${seconds} seconds ago`;
  return 'Just now';
}

// ==================== Copy to Clipboard ====================

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    return successful;
  } catch (err) {
    console.error('[MFA Utils] Failed to copy to clipboard:', err);
    return false;
  }
}

// ==================== Download File ====================

/**
 * Trigger download of text file (for recovery codes)
 */
export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==================== Factor Name Helpers ====================

/**
 * Get human-readable factor name
 */
export function getFactorName(factor: string): string {
  switch (factor) {
    case 'webauthn':
      return 'Passkey';
    case 'totp':
      return 'Authenticator App';
    case 'sms':
      return 'SMS';
    default:
      return factor;
  }
}

/**
 * Get factor icon/emoji
 */
export function getFactorIcon(factor: string): string {
  switch (factor) {
    case 'webauthn':
      return '🔐';
    case 'totp':
      return '📱';
    case 'sms':
      return '📞';
    default:
      return '🔒';
  }
}

// ==================== Export All ====================

const mfaUtils = {
  formatDateTime,
  getDeviceFingerprint,
  getDeviceLabel,
  assessRisk,
  storeDeviceInfo,
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
  isValidTOTPCode,
  getTOTPTimeRemaining,
  isValidPhoneNumber,
  maskPhoneNumber,
  isValidRecoveryCode,
  formatRecoveryCodeInput,
  formatTimeRemaining,
  getRelativeTime,
  copyToClipboard,
  downloadTextFile,
  getFactorName,
  getFactorIcon,
};

export default mfaUtils;

