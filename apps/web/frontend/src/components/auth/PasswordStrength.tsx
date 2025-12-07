import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
  showRequirements?: boolean;
}

export default function PasswordStrength({ password, showRequirements = true }: PasswordStrengthProps) {
  const analysis = useMemo(() => {
    const length = password.length;
    
    // NIST 800-63B: Minimum 8, recommend 15+, max 64+
    const checks = {
      minLength: length >= 8,
      recommendedLength: length >= 15,
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^a-zA-Z0-9]/.test(password),
    };

    // Strength calculation (NIST-aligned: length matters most)
    let score = 0;
    if (checks.minLength) score += 25;
    if (length >= 12) score += 25;
    if (length >= 15) score += 15;
    if (checks.hasLower && checks.hasUpper) score += 15;
    if (checks.hasNumber) score += 10;
    if (checks.hasSpecial) score += 10;

    let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
    let color = 'red';
    let bgColor = 'bg-red-500';

    if (score >= 75) {
      strength = 'strong';
      color = 'green';
      bgColor = 'bg-teal-500';
    } else if (score >= 55) {
      strength = 'good';
      color = 'blue';
      bgColor = 'bg-blue-500';
    } else if (score >= 35) {
      strength = 'fair';
      color = 'yellow';
      bgColor = 'bg-yellow-500';
    }

    return {
      score,
      strength,
      color,
      bgColor,
      checks,
    };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password Strength:
          </span>
          <span
            className={`text-sm font-semibold capitalize ${
              analysis.color === 'green'
                ? 'text-teal-600 dark:text-teal-400'
                : analysis.color === 'blue'
                ? 'text-blue-600 dark:text-blue-400'
                : analysis.color === 'yellow'
                ? 'text-yellow-600 dark:text-yellow-500'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {analysis.strength}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${analysis.score}%` }}
            transition={{ duration: 0.3 }}
            className={`h-2 rounded-full ${analysis.bgColor}`}
          />
        </div>
      </div>

      {/* Requirements */}
      {showRequirements && (
        <div className="space-y-2 text-sm">
          <RequirementItem
            met={analysis.checks.minLength}
            text="At least 8 characters (minimum)"
          />
          <RequirementItem
            met={analysis.checks.recommendedLength}
            text="15+ characters (recommended for security)"
            isRecommended
          />
          <RequirementItem
            met={analysis.checks.hasLower && analysis.checks.hasUpper}
            text="Mixed case letters (optional)"
            isOptional
          />
          <RequirementItem
            met={analysis.checks.hasNumber}
            text="At least one number (optional)"
            isOptional
          />
          <RequirementItem
            met={analysis.checks.hasSpecial}
            text="Special character (optional)"
            isOptional
          />
        </div>
      )}

      {/* NIST Guidance */}
      {password.length >= 8 && password.length < 15 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Security Tip:</strong> Consider using a passphrase (15+ characters) for better
            security. Example: "coffee morning routine 2024"
          </p>
        </div>
      )}

      {/* Breach Warning (Mock - real would check API) */}
      {password.toLowerCase().includes('password') ||
      password.toLowerCase().includes('123456') ||
      password.toLowerCase() === 'admin' ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-800 dark:text-red-200 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>
              <strong>Warning:</strong> This password appears in known data breaches. Please choose
              a different one.
            </span>
          </p>
        </div>
      ) : null}
    </div>
  );
}

interface RequirementItemProps {
  met: boolean;
  text: string;
  isRecommended?: boolean;
  isOptional?: boolean;
}

function RequirementItem({ met, text, isRecommended, isOptional }: RequirementItemProps) {
  return (
    <div className="flex items-center space-x-2">
      {met ? (
        <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
      ) : (
        <XCircle className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
      )}
      <span
        className={`text-sm ${
          met
            ? 'text-gray-900 dark:text-gray-100'
            : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        {text}
        {isRecommended && !isOptional && (
          <span className="text-blue-600 dark:text-blue-400 ml-1">(recommended)</span>
        )}
        {isOptional && <span className="text-gray-400 ml-1">(optional)</span>}
      </span>
    </div>
  );
}

