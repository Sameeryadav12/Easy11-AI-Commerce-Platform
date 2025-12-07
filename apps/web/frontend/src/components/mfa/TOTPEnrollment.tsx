/**
 * TOTP (Authenticator App) Enrollment Component
 * Sprint 2: MFA - TOTP enrollment with QR code
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, CheckCircle, AlertCircle, Loader, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { useMFAStore } from '../../store/mfaStore';
import mfaAPI from '../../services/mfaAPI';
import { isValidTOTPCode } from '../../utils/mfaUtils';
import OTPInput from './OTPInput';
import { Button } from '../ui';
import toast from 'react-hot-toast';

interface TOTPEnrollmentProps {
  onComplete: () => void;
  onBack?: () => void;
}

type EnrollmentStep = 'loading' | 'scan' | 'verify' | 'success' | 'error';

export default function TOTPEnrollment({ onComplete, onBack }: TOTPEnrollmentProps) {
  const [step, setStep] = useState<EnrollmentStep>('loading');
  const [error, setError] = useState<string | null>(null);
  const [totpData, setTotpData] = useState<any>(null);
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [secretCopied, setSecretCopied] = useState(false);

  // Load TOTP enrollment data
  useEffect(() => {
    enrollTOTP();
  }, []);

  const enrollTOTP = async () => {
    try {
      const data = await mfaAPI.enrollTOTP();
      setTotpData(data);
      setStep('scan');
    } catch (err: any) {
      console.error('TOTP enrollment error:', err);
      setStep('error');
      setError(err.message || 'Failed to start TOTP enrollment');
      toast.error('Failed to load TOTP enrollment');
    }
  };

  const handleCopySecret = async () => {
    if (!totpData?.secret) return;

    try {
      await navigator.clipboard.writeText(totpData.secret);
      setSecretCopied(true);
      toast.success('Secret copied to clipboard!');
      setTimeout(() => setSecretCopied(false), 3000);
    } catch (err) {
      toast.error('Failed to copy secret');
    }
  };

  const handleVerifyCode = async (verificationCode: string) => {
    if (!isValidTOTPCode(verificationCode)) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const result = await mfaAPI.verifyTOTP(verificationCode);

      if (result.status === 'ok') {
        setStep('success');
        toast.success('Authenticator app connected successfully! 🎉');

        // Auto-proceed after 2 seconds
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    } catch (err: any) {
      console.error('TOTP verification error:', err);
      setError(err.message || 'Invalid code. Please try again.');
      toast.error('Invalid code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCodeComplete = (completeCode: string) => {
    handleVerifyCode(completeCode);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {/* Loading */}
        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Setting up authenticator app...</p>
          </motion.div>
        )}

        {/* Scan QR Code */}
        {step === 'scan' && totpData && (
          <motion.div
            key="scan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Hero Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Smartphone className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                Set Up Authenticator App
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Scan the QR code with your authenticator app
              </p>
            </div>

            {/* Recommended Apps */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Recommended apps:</strong>
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300">
                  Google Authenticator
                </span>
                <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300">
                  Authy
                </span>
                <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300">
                  1Password
                </span>
                <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300">
                  Microsoft Authenticator
                </span>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
              <div className="flex flex-col items-center space-y-4">
                {/* QR Code Image */}
                <div className="bg-white p-6 rounded-xl border-4 border-gray-200 dark:border-gray-700">
                  <img
                    src={totpData.qr_code}
                    alt="TOTP QR Code"
                    className="w-64 h-64"
                  />
                </div>

                {/* Manual Entry Option */}
                <div className="w-full">
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 mx-auto"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showSecret ? 'Hide' : 'Show'} manual entry key
                  </button>

                  <AnimatePresence>
                    {showSecret && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-3"
                      >
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            Manual Entry Key:
                          </p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 text-sm font-mono bg-white dark:bg-gray-800 px-3 py-2 rounded border border-gray-200 dark:border-gray-700 break-all">
                              {totpData.secret}
                            </code>
                            <button
                              onClick={handleCopySecret}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="Copy secret"
                            >
                              {secretCopied ? (
                                <Check className="w-5 h-5 text-green-500" />
                              ) : (
                                <Copy className="w-5 h-5 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <p><strong>Settings:</strong></p>
                          <p>• Time-based: Yes</p>
                          <p>• Algorithm: {totpData.algorithm}</p>
                          <p>• Digits: {totpData.digits}</p>
                          <p>• Period: {totpData.period} seconds</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                How to set up:
              </h3>
              <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                <li>Open your authenticator app</li>
                <li>Tap the "+" or "Add Account" button</li>
                <li>Scan this QR code with your camera</li>
                <li>Enter the 6-digit code shown in your app below</li>
              </ol>
            </div>

            {/* Verification Code Input */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">
                Enter the 6-digit code from your app
              </h3>

              <OTPInput
                value={code}
                onChange={setCode}
                onComplete={handleCodeComplete}
                disabled={isVerifying}
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

              {isVerifying && (
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-300">
                  <Loader className="w-4 h-4 animate-spin" />
                  Verifying...
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {onBack && (
                <Button variant="secondary" onClick={onBack} className="flex-1" disabled={isVerifying}>
                  Back
                </Button>
              )}
              <Button
                variant="primary"
                onClick={() => handleVerifyCode(code)}
                disabled={code.length !== 6 || isVerifying}
                className="flex-1 bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600"
              >
                {isVerifying ? 'Verifying...' : 'Verify Code'}
              </Button>
            </div>

            {/* Security Note */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              🔒 Your secret key is encrypted and stored securely. Keep your authenticator app safe!
            </p>
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
                Authenticator App Connected! 🎉
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Your account is now protected with TOTP authentication
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-sm text-green-800 dark:text-green-200">
                ✅ <strong>Next Step:</strong> Save your recovery codes in case you lose access to your authenticator app.
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
                Setup Failed
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                {error || 'Failed to set up authenticator app'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 max-w-md mx-auto">
              {onBack && (
                <Button variant="secondary" onClick={onBack} className="flex-1">
                  Try Different Method
                </Button>
              )}
              <Button variant="primary" onClick={enrollTOTP} className="flex-1">
                Try Again
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

