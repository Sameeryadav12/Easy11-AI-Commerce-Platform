/**
 * OTP Input Component
 * Segmented 6-digit input for TOTP and SMS codes
 * Sprint 2: MFA
 */

import { useState, useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';

interface OTPInputProps {
  length?: number; // Default: 6
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  autoFocus = true,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(autoFocus ? 0 : null);

  // Ensure value is always a string of correct length
  const normalizedValue = value.padEnd(length, ' ');

  const handleChange = (index: number, newValue: string) => {
    // Only allow digits
    const digit = newValue.replace(/\D/g, '').slice(-1);

    if (!digit && newValue.length > 0) return; // Ignore non-digit input

    // Update value
    const newOTP = normalizedValue.split('');
    newOTP[index] = digit || ' ';
    const updatedValue = newOTP.join('').trimEnd();

    onChange(updatedValue);

    // Auto-focus next input if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete if all digits filled
    if (digit && index === length - 1 && updatedValue.length === length) {
      onComplete?.(updatedValue);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Backspace: clear current or move to previous
    if (e.key === 'Backspace') {
      if (normalizedValue[index] === ' ') {
        // Current is empty, move to previous
        if (index > 0) {
          const newOTP = normalizedValue.split('');
          newOTP[index - 1] = ' ';
          onChange(newOTP.join('').trimEnd());
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        // Clear current
        const newOTP = normalizedValue.split('');
        newOTP[index] = ' ';
        onChange(newOTP.join('').trimEnd());
      }
      e.preventDefault();
    }

    // Arrow keys: navigate
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      e.preventDefault();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      e.preventDefault();
    }

    // Home/End: jump to first/last
    if (e.key === 'Home') {
      inputRefs.current[0]?.focus();
      e.preventDefault();
    }
    if (e.key === 'End') {
      inputRefs.current[length - 1]?.focus();
      e.preventDefault();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const digits = pasteData.replace(/\D/g, '').slice(0, length);

    if (digits.length > 0) {
      onChange(digits);

      // Focus last filled input or the one after
      const nextIndex = Math.min(digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();

      // Call onComplete if all digits filled
      if (digits.length === length) {
        onComplete?.(digits);
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
    // Select content on focus
    inputRefs.current[index]?.select();
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length }).map((_, index) => {
        const digit = normalizedValue[index];
        const isFilled = digit !== ' ';
        const isFocused = focusedIndex === index;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={isFilled ? digit : ''}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              disabled={disabled}
              autoFocus={autoFocus && index === 0}
              className={`
                w-12 h-14 sm:w-14 sm:h-16
                text-center text-2xl font-bold
                rounded-xl
                border-2
                transition-all duration-200
                ${
                  error
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : isFocused
                    ? 'border-blue-500 bg-white dark:bg-gray-800 shadow-lg ring-4 ring-blue-100 dark:ring-blue-900/30'
                    : isFilled
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 dark:hover:border-blue-500 cursor-text'}
                focus:outline-none
              `}
              aria-label={`Digit ${index + 1} of ${length}`}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

