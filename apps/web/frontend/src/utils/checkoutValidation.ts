/**
 * Checkout form validation (RFC/industry standards)
 * - Email: addr-spec, trim, max 254 chars
 * - Phone: E.164, 7-15 digits
 * - Names: letters, spaces, hyphen, apostrophe; max 80 chars
 * - Address: min 5, max 200 chars; block control chars
 * - Postcode: country-based rules
 * - Sanitization: block script injection
 */

const EMAIL_MAX = 254;
const NAME_MAX = 80;
const ADDRESS_MIN = 5;
const ADDRESS_MAX = 200;
const LINE2_MAX = 50;
const CITY_MAX = 100;
const STATE_MAX = 100;
const POSTCODE_MAX = 20;

// RFC 5321 addr-spec: local-part@domain (basic)
const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Control chars and dangerous patterns
const SANITIZE_RE = /[\x00-\x1F\x7F<>\"'`]/g;

/** Sanitize user input (prevent script injection) */
export function sanitizeInput(value: string): string {
  return value.replace(SANITIZE_RE, '');
}

/** Email: mandatory, addr-spec, trim, max 254, block invalid patterns */
export function validateEmail(raw: string): { valid: boolean; error?: string; value: string } {
  const value = raw.trim();
  if (!value) return { valid: false, error: 'Email is required', value: '' };
  if (value.length > EMAIL_MAX)
    return { valid: false, error: `Email must be ${EMAIL_MAX} characters or less`, value };
  if (!value.includes('@')) return { valid: false, error: 'Enter a valid email address', value };
  if (value.endsWith('@') || value.startsWith('@'))
    return { valid: false, error: 'Enter a valid email address', value };
  if (value.includes('@@')) return { valid: false, error: 'Enter a valid email address', value };
  if (/\s/.test(value)) return { valid: false, error: 'Email cannot contain spaces', value };
  const domain = value.split('@')[1] || '';
  if (!domain.includes('.'))
    return { valid: false, error: 'Enter a valid email (e.g. name@example.com)', value };
  if (!EMAIL_RE.test(value)) return { valid: false, error: 'Enter a valid email address', value };
  return { valid: true, value };
}

/** Phone: E.164, digits only (after removing + and spaces/dashes), 7–15 digits */
export function validatePhone(
  raw: string,
  _country?: string,
  required = false
): { valid: boolean; error?: string; value: string; normalized?: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    if (required) return { valid: false, error: 'Phone is required for delivery', value: '' };
    return { valid: true, value: '', normalized: '' };
  }

  const normalized = trimmed
    .replace(/^\+/, '')
    .replace(/[\s\-\.\(\)]/g, '')
    .replace(/\D/g, '');
  if (/[a-zA-Z]/.test(trimmed) || /[\u{1F300}-\u{1F9FF}]/u.test(trimmed))
    return { valid: false, error: 'Phone cannot contain letters or emojis', value: trimmed };
  if (/\d+\.\d+/.test(trimmed)) return { valid: false, error: 'Enter a valid phone number', value: trimmed };
  if ((trimmed.match(/\+/g) || []).length > 1)
    return { valid: false, error: 'Enter a valid phone number', value: trimmed };
  if (normalized.length < 7) return { valid: false, error: 'Phone number is too short', value: trimmed };
  if (normalized.length > 15) return { valid: false, error: 'Phone number is too long', value: trimmed };
  return { valid: true, value: trimmed, normalized: normalized ? '+' + normalized : '' };
}

/** Name: required, letters + spaces + hyphen + apostrophe, max 80, not only numbers/symbols */
export function validateName(
  raw: string,
  field: string
): { valid: boolean; error?: string; value: string } {
  const value = raw.trim();
  if (!value) return { valid: false, error: `${field} is required`, value: '' };
  if (value.length > NAME_MAX)
    return { valid: false, error: `${field} must be ${NAME_MAX} characters or less`, value };
  if (/^\d+$/.test(value)) return { valid: false, error: `${field} cannot be only numbers`, value };
  if (/^[^a-zA-Z]+$/.test(value)) return { valid: false, error: `${field} must contain letters`, value };
  if (!/^[\p{L}\s\-']+$/u.test(value))
    return {
      valid: false,
      error: `${field} can only contain letters, spaces, hyphens, and apostrophes`,
      value,
    };
  if (value.length === 1)
    return { valid: false, error: `${field} seems too short—use full name`, value };
  return { valid: true, value };
}

/** Street address: required, min 5, max 200, block control chars */
export function validateStreetAddress(raw: string): { valid: boolean; error?: string; value: string } {
  const value = sanitizeInput(raw.trim());
  if (!value) return { valid: false, error: 'Street address is required', value: '' };
  if (value.length < ADDRESS_MIN)
    return { valid: false, error: `Street address must be at least ${ADDRESS_MIN} characters`, value };
  if (value.length > ADDRESS_MAX)
    return { valid: false, error: `Street address must be ${ADDRESS_MAX} characters or less`, value };
  if (value.length < 10 && /^[a-zA-Z\s]+$/.test(value))
    return { valid: false, error: 'Please include house number and street name', value };
  return { valid: true, value };
}

/** Apartment/Suite: optional; if provided, validate length */
export function validateLine2(raw: string): { valid: boolean; error?: string; value: string } {
  const value = sanitizeInput(raw.trim());
  if (!value) return { valid: true, value: '' };
  if (value.length > LINE2_MAX)
    return { valid: false, error: `Apartment/Suite must be ${LINE2_MAX} characters or less`, value };
  return { valid: true, value };
}

/** City: required, letters/spaces/hyphens, max 100 */
export function validateCity(raw: string): { valid: boolean; error?: string; value: string } {
  const value = sanitizeInput(raw.trim());
  if (!value) return { valid: false, error: 'City is required', value: '' };
  if (value.length > CITY_MAX)
    return { valid: false, error: `City must be ${CITY_MAX} characters or less`, value };
  if (!/^[\p{L}\s\-']+$/u.test(value))
    return { valid: false, error: 'City can only contain letters, spaces, and hyphens', value };
  return { valid: true, value };
}

/** State/Region: required when country uses it */
export function validateState(raw: string, country: string): { valid: boolean; error?: string; value: string } {
  const value = sanitizeInput(raw.trim());
  const usesState = ['US', 'AU', 'CA', 'United States', 'Australia', 'Canada'].includes(country);
  if (usesState && !value) return { valid: false, error: 'State/Region is required', value: '' };
  if (value.length > STATE_MAX)
    return { valid: false, error: `State must be ${STATE_MAX} characters or less`, value };
  return { valid: true, value };
}

/** Postcode: country-based validation */
export function validatePostcode(
  raw: string,
  country: string
): { valid: boolean; error?: string; value: string } {
  const value = sanitizeInput(raw.trim());
  if (!value) return { valid: false, error: 'Postcode/ZIP is required', value: '' };
  if (value.length > POSTCODE_MAX)
    return { valid: false, error: `Postcode must be ${POSTCODE_MAX} characters or less`, value };

  const c = country.toUpperCase();
  if (c === 'US' || c === 'UNITED STATES') {
    if (!/^\d{5}(-\d{4})?$/.test(value))
      return { valid: false, error: 'Enter a valid US ZIP code (e.g. 12345 or 12345-6789)', value };
  }
  if (c === 'AU' || c === 'AUSTRALIA') {
    if (!/^\d{4}$/.test(value))
      return { valid: false, error: 'Enter a valid Australian postcode (4 digits)', value };
  }
  if (c === 'CA' || c === 'CANADA') {
    if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(value))
      return { valid: false, error: 'Enter a valid Canadian postal code (e.g. A1A 1A1)', value };
  }
  if (c === 'GB' || c === 'UK' || c === 'UNITED KINGDOM') {
    if (value.length < 5 || value.length > 8)
      return { valid: false, error: 'Enter a valid UK postcode', value };
  }
  return { valid: true, value };
}

/** Normalize country for validation (handle full names) */
function normCountry(country: string): string {
  const m: Record<string, string> = {
    'United States': 'US',
    Australia: 'AU',
    Canada: 'CA',
    'United Kingdom': 'GB',
    UK: 'GB',
  };
  return m[country] || country;
}

export interface ShippingValidationResult {
  valid: boolean;
  errors: Partial<Record<string, string>>;
  sanitized: Record<string, string>;
}

/** Validate entire shipping form */
export function validateShippingForm(info: {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}): ShippingValidationResult {
  const errors: Partial<Record<string, string>> = {};
  const sanitized: Record<string, string> = {};

  const e = validateEmail(info.email);
  sanitized.email = e.value;
  if (!e.valid && e.error) errors.email = e.error;

  const fn = validateName(info.firstName, 'First name');
  sanitized.firstName = fn.value;
  if (!fn.valid && fn.error) errors.firstName = fn.error;

  const ln = validateName(info.lastName, 'Last name');
  sanitized.lastName = ln.value;
  if (!ln.valid && ln.error) errors.lastName = ln.error;

  const ph = validatePhone(info.phone, info.country, true);
  sanitized.phone = ph.value;
  if (!ph.valid && ph.error) errors.phone = ph.error;

  const addr = validateStreetAddress(info.address);
  sanitized.address = addr.value;
  if (!addr.valid && addr.error) errors.address = addr.error;

  const apt = validateLine2(info.apartment);
  sanitized.apartment = apt.value;
  if (!apt.valid && apt.error) errors.apartment = apt.error;

  const city = validateCity(info.city);
  sanitized.city = city.value;
  if (!city.valid && city.error) errors.city = city.error;

  const countryNorm = normCountry(info.country);
  const state = validateState(info.state, countryNorm);
  sanitized.state = state.value;
  if (!state.valid && state.error) errors.state = state.error;

  const zip = validatePostcode(info.zipCode, countryNorm);
  sanitized.zipCode = zip.value;
  if (!zip.valid && zip.error) errors.zipCode = zip.error;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}
