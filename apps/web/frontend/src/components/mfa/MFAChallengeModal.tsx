/**
 * MFA Challenge Modal
 * Sprint 2: MFA - Universal MFA verification component
 * Used for: Login, Step-Up, Risk-based challenges
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Shield,
  Smartphone,
  MessageSquare,
  Fingerprint,
  Key,
  Loader,
  AlertCircle,
} from 'lucide-react';
import { useMFAStore } from '../../store/mfaStore';
import mfaAPI from '../../services/mfaAPI';
import { getFactorName, getFactorIcon, isValidTOTPCode, isValidRecoveryCode } from '../../utils/mfaUtils';
import OTPInput from './OTPInput';
import { Button } from '../ui';
import toast from 'react-hot-toast';
import type { MFAFactor } from '../../types/mfa';

interface MFAChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (mfaToken: string) => void;
  context?: string; // "login", "stepup", or custom message
}

export default function MFAChallengeModal({
  isOpen,
  onClose,
  onSuccess,
  context = 'For your security, confirm it\'s you',
}: MFAChallengeModalProps) {
  const { status } = useMFAStore();
  const [selectedFactor, setSelectedFactor] = useState<MFAFactor | 'recovery'>('webauthn');
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);
  const [rememberDevice, setRememberDevice] = useState(false);

  // Set default factor based on user's enrolled methods
  useEffect(() => {
    if (!status) return;

    if (status.default_factor) {
      setSelectedFactor(status.default_factor);
    } else if (status.factors.webauthn > 0) {
      setSelectedFactor('webauthn');
    } else if (status.factors.totp > 0) {
      setSelectedFactor('totp');
    } else if (status.factors.sms > 0) {
      setSelectedFactor('sms');
    }
  }, [status]);

  const handlePasskeyChallenge = async () => {
    setIsVerifying(true);
    setError(null);

    try {
      // Get authentication options
      const options = await mfaAPI.getWebAuthnAuthenticationOptions();

      // Call browser's WebAuthn API
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0)),
          allowCredentials: options.allowCredentials.map((cred) => ({
            id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0)),
            type: cred.type,
            transports: cred.transports,
          })),
          timeout: options.timeout,
          userVerification: options.userVerification,
        },
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Failed to get passkey');
      }

      // Verify with server
      const response = credential.response as AuthenticatorAssertionResponse;
      const verificationPayload = {
        id: credential.id,
        rawId: arrayBufferToBase64(credential.rawId),
        response: {
          clientDataJSON: arrayBufferToBase64(response.clientDataJSON),
          authenticatorData: arrayBufferToBase64(response.authenticatorData),
          signature: arrayBufferToBase64(response.signature),
          userHandle: response.userHandle ? arrayBufferToBase64(response.userHandle) : undefined,
        },
        type: credential.type,
      };

      const result = await mfaAPI.verifyWebAuthnAuthentication(verificationPayload);

      if (result.status === 'ok' && result.mfa_token) {
        toast.success('Authentication successful! ✅');
        onSuccess(result.mfa_token);
        onClose();
      }
    } catch (err: any) {
      console.error('Passkey challenge error:', err);

      if (err.name === 'NotAllowedError') {
        setError('Authentication was cancelled');
      } else {
        setError(err.message || 'Failed to authenticate with passkey');
      }

      toast.error('Authentication failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTOTPChallenge = async (verificationCode: string) => {
    if (!isValidTOTPCode(verificationCode)) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const result = await mfaAPI.challengeTOTP(verificationCode);

      if (result.status === 'ok' && result.mfa_token) {
        toast.success('Authentication successful! ✅');
        onSuccess(result.mfa_token);
        onClose();
      } else {
        setError(result.message || 'Invalid code');
        setAttemptsRemaining(result.attempts_remaining || 0);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSMSChallenge = async (verificationCode: string) => {
    if (!isValidTOTPCode(verificationCode)) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const result = await mfaAPI.verifySMSChallenge(verificationCode);

      if (result.status === 'ok' && result.mfa_token) {
        toast.success('Authentication successful! ✅');
        onSuccess(result.mfa_token);
        onClose();
      } else {
        setError(result.message || 'Invalid code');
        setAttemptsRemaining(result.attempts_remaining || 0);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRecoveryCode = async (recoveryCode: string) => {
    const formattedCode = recoveryCode.toUpperCase().trim();

    if (!isValidRecoveryCode(formattedCode)) {
      setError('Please enter a valid recovery code (EASY-XXXX-XXXX-XXXX)');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const result = await mfaAPI.consumeRecoveryCode(formattedCode);
      toast.success(`Authentication successful! ${result.remaining_codes} codes remaining.`);
      onSuccess(result.mfa_token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid or already used recovery code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCodeComplete = (completeCode: string) => {
    if (selectedFactor === 'totp') {
      handleTOTPChallenge(completeCode);
    } else if (selectedFactor === 'sms') {
      handleSMSChallenge(completeCode);
    } else if (selectedFactor === 'recovery') {
      handleRecoveryCode(completeCode);
    }
  };

  const handleSendSMS = async () => {
    setIsVerifying(true);
    try {
      await mfaAPI.challengeSMS();
      toast.success('Code sent via SMS!');
    } catch (err) {
      toast.error('Failed to send SMS');
    } finally {
      setIsVerifying(false);
    }
  };

  // Helper
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Auto-send SMS when selected
  useEffect(() => {
    if (selectedFactor === 'sms' && isOpen) {
      handleSendSMS();
    }
  }, [selectedFactor, isOpen]);

  if (!isOpen) return null;

  // Get available factors
  const availableFactors: (MFAFactor | 'recovery')[] = [];
  if (status?.factors.webauthn && status.factors.webauthn > 0) availableFactors.push('webauthn');
  if (status?.factors.totp && status.factors.totp > 0) availableFactors.push('totp');
  if (status?.factors.sms && status.factors.sms > 0) availableFactors.push('sms');
  availableFactors.push('recovery'); // Always available

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
              Verify It's You
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {context}
            </p>
          </div>

          {/* Factor Selection (if multiple available) */}
          {availableFactors.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableFactors.map((factor) => (
                  <button
                    key={factor}
                    onClick={() => {
                      setSelectedFactor(factor);
                      setCode('');
                      setError(null);
                    }}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedFactor === factor
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{getFactorIcon(factor)}</div>
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {getFactorName(factor)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Factor-Specific UI */}
          <div className="space-y-4">
            {/* Passkey */}
            {selectedFactor === 'webauthn' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  Use Face ID, Touch ID, or your device PIN to continue
                </p>
                <Button
                  variant="primary"
                  onClick={handlePasskeyChallenge}
                  disabled={isVerifying}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-5 h-5" />
                      Use Passkey
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* TOTP */}
            {selectedFactor === 'totp' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  Open your authenticator app and enter the 6-digit code
                </p>
                <OTPInput
                  value={code}
                  onChange={setCode}
                  onComplete={handleCodeComplete}
                  disabled={isVerifying}
                  error={!!error}
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">
                    {error}
                  </p>
                )}
                {attemptsRemaining < 5 && (
                  <p className="text-sm text-orange-600 dark:text-orange-400 text-center">
                    {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining
                  </p>
                )}
              </div>
            )}

            {/* SMS */}
            {selectedFactor === 'sms' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  Code sent to +61 4** *** **3
                </p>
                <OTPInput
                  value={code}
                  onChange={setCode}
                  onComplete={handleCodeComplete}
                  disabled={isVerifying}
                  error={!!error}
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">
                    {error}
                  </p>
                )}
                {attemptsRemaining < 5 && (
                  <p className="text-sm text-orange-600 dark:text-orange-400 text-center">
                    {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining
                  </p>
                )}
                <button
                  onClick={handleSendSMS}
                  disabled={isVerifying}
                  className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 mx-auto block"
                >
                  Resend Code
                </button>
              </div>
            )}

            {/* Recovery Code */}
            {selectedFactor === 'recovery' && (
              <div className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> Each recovery code can only be used once
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter Recovery Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="EASY-XXXX-XXXX-XXXX"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-center focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                    disabled={isVerifying}
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">
                    {error}
                  </p>
                )}
                <Button
                  variant="primary"
                  onClick={() => handleRecoveryCode(code)}
                  disabled={code.length < 19 || isVerifying}
                  className="w-full"
                >
                  {isVerifying ? 'Verifying...' : 'Verify Recovery Code'}
                </Button>
              </div>
            )}
          </div>

          {/* Remember Device */}
          {selectedFactor !== 'recovery' && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  Remember this device for 30 days
                </span>
              </label>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setSelectedFactor('recovery')}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Lost your device? Use a recovery code
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

