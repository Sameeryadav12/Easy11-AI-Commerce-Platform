/**
 * Card validation utilities - PCI-DSS compliant (never store full card or CVV).
 * Validates: Luhn, card type (BIN), expiry, CVV length.
 */

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';

export interface CardValidationResult {
  valid: boolean;
  error?: string;
  brand?: CardBrand;
}

/** Luhn algorithm (mod 10) checksum - industry standard */
function luhnCheck(digits: string): boolean {
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

/** Detect card brand from first digits (BIN) */
export function detectCardBrand(num: string): CardBrand {
  const digits = num.replace(/\D/g, '');
  if (digits.startsWith('4')) return 'visa';
  if (digits.startsWith('34') || digits.startsWith('37')) return 'amex';
  if (digits.startsWith('51') || digits.startsWith('52') || digits.startsWith('53') ||
      digits.startsWith('54') || digits.startsWith('55') ||
      (digits.startsWith('2') && digits.length >= 2 && parseInt(digits.slice(1, 6), 10) >= 222100 && parseInt(digits.slice(1, 6), 10) <= 272099)) return 'mastercard';
  if (digits.startsWith('6011') || digits.startsWith('65') || (digits.startsWith('64') && digits.length >= 4)) return 'discover';
  return 'other';
}

/** Required length by brand */
function requiredLength(brand: CardBrand): number[] {
  switch (brand) {
    case 'visa': return [13, 16];
    case 'mastercard': return [16];
    case 'amex': return [15];
    case 'discover': return [16];
    default: return [13, 14, 15, 16];
  }
}

/** CVV length by brand */
export function cvvLengthForBrand(brand: CardBrand): number {
  return brand === 'amex' ? 4 : 3;
}

/** Whether we're in dev/test mode - allows fake card numbers for testing */
const isTestMode = () =>
  typeof import.meta !== 'undefined' && import.meta.env?.DEV === true;

/** Validate card number */
export function validateCardNumber(num: string): CardValidationResult {
  const digits = num.replace(/\D/g, '');
  if (digits.length === 0) return { valid: false, error: 'Card number is required' };
  if (!/^\d+$/.test(digits)) return { valid: false, error: 'Card number must contain only digits' };
  if (/^(\d)\1+$/.test(digits)) return { valid: false, error: 'Invalid card number' };

  const brand = detectCardBrand(digits);
  const lengths = requiredLength(brand);
  if (!lengths.includes(digits.length)) {
    if (brand === 'visa') return { valid: false, error: 'Visa cards are 13 or 16 digits', brand };
    if (brand === 'amex') return { valid: false, error: 'Amex cards are 15 digits', brand };
    return { valid: false, error: 'Invalid card number length', brand };
  }

  // In dev/test mode, skip Luhn check to allow fake numbers for testing
  if (!isTestMode() && !luhnCheck(digits)) return { valid: false, error: 'Invalid card number', brand };
  return { valid: true, brand };
}

/** Validate cardholder name */
export function validateCardholderName(name: string): CardValidationResult {
  const trimmed = (name || '').trim();
  if (trimmed.length === 0) return { valid: false, error: 'Cardholder name is required' };
  if (trimmed.length < 2) return { valid: false, error: 'Name must be at least 2 characters' };
  if (!/^[a-zA-Z\s\-.'\u00C0-\u024F]+$/.test(trimmed)) return { valid: false, error: 'Name can only contain letters and spaces' };
  return { valid: true };
}

/** Validate expiry MM/YY */
export function validateExpiry(mmYY: string): CardValidationResult {
  const cleaned = mmYY.replace(/\D/g, '');
  if (cleaned.length < 4) return { valid: false, error: 'Expiry is required (MM/YY)' };

  const mm = parseInt(cleaned.slice(0, 2), 10);
  const yy = parseInt(cleaned.slice(2, 4), 10);
  if (mm < 1 || mm > 12) return { valid: false, error: 'Invalid month' };

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
    return { valid: false, error: 'Card has expired' };
  }
  const futureLimit = (now.getFullYear() % 100) + 25;
  if (yy > futureLimit) return { valid: false, error: 'Invalid expiry date' };

  return { valid: true };
}

/** Validate CVV - length only (never store) */
export function validateCVV(cvv: string, brand?: CardBrand): CardValidationResult {
  const digits = cvv.replace(/\D/g, '');
  if (digits.length === 0) return { valid: false, error: 'CVV is required' };
  const required = brand ? cvvLengthForBrand(brand) : 3;
  if (digits.length !== required) {
    if (brand === 'amex') return { valid: false, error: 'Amex CVV is 4 digits' };
    return { valid: false, error: 'CVV is 3 digits' };
  }
  return { valid: true };
}
