/**
 * Registration form validation utilities.
 * Full name, email, password rules, and password strength.
 */

/** Full name: must contain letters, allow spaces/hyphen/apostrophe, min 2 chars, reject only-numbers/symbols */
const FULL_NAME_REGEX = /^[\p{L}\p{M}\s'-]{2,}$/u;

export function validateFullName(name: string): { valid: boolean; message?: string } {
  const trimmed = name.trim();
  if (!trimmed) return { valid: false, message: 'Full name is required' };
  if (trimmed.length < 2) return { valid: false, message: 'Name must be at least 2 characters' };
  if (!/\p{L}/u.test(trimmed)) return { valid: false, message: 'Name must contain at least one letter' };
  if (/^\d+$/.test(trimmed)) return { valid: false, message: 'Name cannot be only numbers' };
  if (!FULL_NAME_REGEX.test(trimmed)) return { valid: false, message: 'Use only letters, spaces, hyphens, or apostrophes' };
  return { valid: true };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): { valid: boolean; message?: string } {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return { valid: false, message: 'Email is required' };
  if (!EMAIL_REGEX.test(trimmed)) return { valid: false, message: 'Please enter a valid email address' };
  return { valid: true };
}

/** Common passwords to block (extended list) */
const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', '123456', '12345678', '123456789', '123654987', '321654987',
  'qwerty', 'abc123', 'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master', 'login', 'princess',
  'football', 'iloveyou', 'trustno1', 'sunshine', 'passw0rd', 'admin123', 'root', 'access', 'shadow',
]);

export function isCommonPassword(password: string): boolean {
  const lower = password.toLowerCase();
  if (COMMON_PASSWORDS.has(lower)) return true;
  if (/^\d+$/.test(password) && password.length >= 6) return true; // all digits
  if (/^(\d)\1+$/.test(password)) return true; // repeated digit
  return false;
}

export function passwordContainsEmail(password: string, email: string): boolean {
  if (!email || !password) return false;
  const local = email.split('@')[0].toLowerCase();
  if (local.length >= 4 && password.toLowerCase().includes(local)) return true;
  return false;
}

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number;
  checks: {
    length8: boolean;
    length12: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
    notCommon: boolean;
    notEmail: boolean;
  };
}

export function getPasswordStrength(password: string, email: string, name: string): PasswordStrengthResult {
  const checks = {
    length8: password.length >= 8,
    length12: password.length >= 12,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    notCommon: !isCommonPassword(password),
    notEmail: !passwordContainsEmail(password, email),
  };

  let score = 0;
  if (checks.length8) score += 1;
  if (checks.length12) score += 1;
  if (checks.lowercase) score += 1;
  if (checks.uppercase) score += 1;
  if (checks.number) score += 1;
  if (checks.special) score += 1;
  if (!checks.notCommon) score -= 2;
  if (!checks.notEmail) score -= 2;
  score = Math.max(0, score);

  let strength: PasswordStrength = 'weak';
  if (score >= 6) strength = 'strong';
  else if (score >= 5) strength = 'good';
  else if (score >= 3) strength = 'fair';

  return { strength, score, checks };
}

export function validatePassword(
  password: string,
  email: string,
  name: string
): { valid: boolean; message?: string } {
  if (!password) return { valid: false, message: 'Password is required' };
  if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };

  const { checks } = getPasswordStrength(password, email, name);
  const criteriaMet = [
    checks.lowercase,
    checks.uppercase,
    checks.number,
    checks.special,
  ].filter(Boolean).length;
  if (criteriaMet < 3) {
    return { valid: false, message: 'Use at least 3 of: lowercase, uppercase, number, special character' };
  }
  if (!checks.notCommon) return { valid: false, message: 'Choose a stronger password (this one is too common)' };
  if (!checks.notEmail) return { valid: false, message: 'Password cannot contain your email' };
  return { valid: true };
}

export function validateConfirmPassword(password: string, confirm: string): { valid: boolean; message?: string } {
  if (!confirm) return { valid: false, message: 'Please confirm your password' };
  if (password !== confirm) return { valid: false, message: 'Passwords do not match' };
  return { valid: true };
}
