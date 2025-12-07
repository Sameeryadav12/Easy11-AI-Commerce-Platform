/**
 * SMS OTP Enrollment Component
 * Sprint 2: MFA - SMS enrollment with phone verification
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, CheckCircle, AlertCircle, Loader, Clock } from 'lucide-react';
import mfaAPI from '../../services/mfaAPI';
import { isValidPhoneNumber, isValidTOTPCode } from '../../utils/mfaUtils';
import OTPInput from './OTPInput';
import { Button } from '../ui';
import toast from 'react-hot-toast';

interface SMSEnrollmentProps {
  onComplete: () => void;
  onBack?: () => void;
}

type EnrollmentStep = 'phone' | 'verify' | 'success' | 'error';

export default function SMSEnrollment({ onComplete, onBack }: SMSEnrollmentProps) {
  const [step, setStep] = useState<EnrollmentStep>('phone');
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);

  const handleSendCode = async () => {
    // Validate phone number
    if (!isValidPhoneNumber(phone)) {
      setError('Please enter a valid phone number in E.164 format (e.g., +61412345678)');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await mfaAPI.enrollSMS({ phone });
      setMaskedPhone(result.masked_phone);
      setStep('verify');
      setResendTimer(60); // 60 second cooldown
      toast.success('Verification code sent!');

      // Start countdown
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err: any) {
      console.error('SMS enrollment error:', err);
      setError(err.message || 'Failed to send verification code');
      toast.error('Failed to send code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (verificationCode: string) => {
    if (!isValidTOTPCode(verificationCode)) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await mfaAPI.verifySMS(verificationCode);

      if (result.status === 'ok') {
        setStep('success');
        toast.success('Phone verified successfully! 🎉');

        // Auto-proceed after 2 seconds
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    } catch (err: any) {
      console.error('SMS verification error:', err);
      setError(err.message || 'Invalid code. Please try again.');
      setAttemptsRemaining((prev) => Math.max(0, prev - 1));
      toast.error('Invalid code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeComplete = (completeCode: string) => {
    handleVerifyCode(completeCode);
  };

  const handleResendCode = () => {
    if (resendTimer > 0) return;
    setCode('');
    setError(null);
    handleSendCode();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {/* Enter Phone Number */}
        {step === 'phone' && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Hero Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <MessageSquare className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                Set Up SMS Authentication
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Receive verification codes via text message
              </p>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium mb-1">⚠️ Less Secure Option</p>
                  <p>
                    SMS is less secure than passkeys or authenticator apps. Use only if you don't have access to other options.
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Input */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+61412345678"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                disabled={isSubmitting}
                autoFocus
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Use E.164 format: country code + number (e.g., +61412345678)
              </p>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 dark:text-red-400 mt-3"
                >
                  {error}
                </motion.p>
              )}
            </div>

            {/* Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                What will happen:
              </h3>
              <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                <li>We'll send a 6-digit verification code to your phone</li>
                <li>Enter the code to verify ownership</li>
                <li>Your phone will be registered for SMS authentication</li>
                <li>You'll receive recovery codes (save them!)</li>
              </ol>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Standard SMS rates may apply. Messages are sent via a secure gateway.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {onBack && (
                <Button variant="secondary" onClick={onBack} className="flex-1" disabled={isSubmitting}>
                  Back
                </Button>
              )}
              <Button
                variant="primary"
                onClick={handleSendCode}
                disabled={!phone || isSubmitting}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Send Code
                  </>
                )}
              </Button>
            </div>

            {/* Security Note */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              🔒 Your phone number is encrypted and never shared with third parties.
            </p>
          </motion.div>
        )}

        {/* Verify Code */}
        {step === 'verify' && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Hero Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <MessageSquare className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                Enter Verification Code
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Code sent to {maskedPhone}
              </p>
            </div>

            {/* OTP Input */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
              <OTPInput
                value={code}
                onChange={setCode}
                onComplete={handleCodeComplete}
                disabled={isSubmitting}
                error={!!error}
                autoFocus
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 dark:text-red-400 text-center mt-3"
                >
                  {error}
                </motion.p>
              )}

              {attemptsRemaining < 3 && (
                <p className="text-sm text-orange-600 dark:text-orange-400 text-center mt-3">
                  {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining
                </p>
              )}

              {isSubmitting && (
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-300">
                  <Loader className="w-4 h-4 animate-spin" />
                  Verifying...
                </div>
              )}
            </div>

            {/* Resend */}
            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  Resend available in {resendTimer}s
                </p>
              ) : (
                <button
                  onClick={handleResendCode}
                  className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  disabled={isSubmitting}
                >
                  Didn't receive the code? Resend
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setStep('phone')}
                className="flex-1"
                disabled={isSubmitting}
              >
                Change Number
              </Button>
              <Button
                variant="primary"
                onClick={() => handleVerifyCode(code)}
                disabled={code.length !== 6 || isSubmitting}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                {isSubmitting ? 'Verifying...' : 'Verify Code'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Success */}
        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>
            <div>
              <h3 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                Phone Verified! 🎉
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                SMS authentication is now enabled for your account
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-sm text-green-800 dark:text-green-200">
                ✅ <strong>Next Step:</strong> Save your recovery codes in case you lose access to your phone.
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting to recovery codes...
            </p>
          </motion.div>
        )}

        {/* Error */}
        {step === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 space-y-6"
          >
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                Verification Failed
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                {error || 'Failed to verify phone number'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 max-w-md mx-auto">
              {onBack && (
                <Button variant="secondary" onClick={onBack} className="flex-1">
                  Try Different Method
                </Button>
              )}
              <Button variant="primary" onClick={() => setStep('phone')} className="flex-1">
                Try Again
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

