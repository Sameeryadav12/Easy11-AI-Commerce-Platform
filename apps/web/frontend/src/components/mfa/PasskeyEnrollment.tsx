/**
 * Passkey (WebAuthn) Enrollment Component
 * Sprint 2: MFA - Passkey enrollment flow
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, AlertCircle, Loader, Fingerprint } from 'lucide-react';
import { useMFAStore } from '../../store/mfaStore';
import mfaAPI from '../../services/mfaAPI';
import { isWebAuthnSupported, isPlatformAuthenticatorAvailable } from '../../utils/mfaUtils';
import { Button } from '../ui';
import toast from 'react-hot-toast';

interface PasskeyEnrollmentProps {
  onComplete: () => void;
  onBack?: () => void;
}

type EnrollmentStep = 'check' | 'prompt' | 'creating' | 'verifying' | 'success' | 'error';

export default function PasskeyEnrollment({ onComplete, onBack }: PasskeyEnrollmentProps) {
  const [step, setStep] = useState<EnrollmentStep>('check');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isPlatformAvailable, setIsPlatformAvailable] = useState(false);
  const { addPasskey } = useMFAStore();

  // Check browser support
  useEffect(() => {
    checkSupport();
  }, []);

  const checkSupport = async () => {
    const supported = isWebAuthnSupported();
    setIsSupported(supported);

    if (supported) {
      const platformAvailable = await isPlatformAuthenticatorAvailable();
      setIsPlatformAvailable(platformAvailable);
      setStep('prompt');
    } else {
      setStep('error');
      setError('Your browser does not support passkeys. Please use a modern browser like Chrome, Safari, or Edge.');
    }
  };

  const handleCreatePasskey = async () => {
    setStep('creating');
    setError(null);

    try {
      // Step 1: Get registration options from server
      const options = await mfaAPI.getWebAuthnRegistrationOptions('Your Device');

      // Step 2: Call browser's WebAuthn API
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0)),
          rp: options.rp,
          user: {
            id: Uint8Array.from(atob(options.user.id), c => c.charCodeAt(0)),
            name: options.user.name,
            displayName: options.user.displayName,
          },
          pubKeyCredParams: options.pubKeyCredParams,
          timeout: options.timeout,
          authenticatorSelection: options.authenticatorSelection,
          attestation: options.attestation || 'none',
        },
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Failed to create passkey');
      }

      // Step 3: Verify with server
      setStep('verifying');

      const response = credential.response as AuthenticatorAttestationResponse;
      const verificationPayload = {
        id: credential.id,
        rawId: arrayBufferToBase64(credential.rawId),
        response: {
          clientDataJSON: arrayBufferToBase64(response.clientDataJSON),
          attestationObject: arrayBufferToBase64(response.attestationObject),
        },
        type: credential.type,
      };

      const result = await mfaAPI.verifyWebAuthnRegistration(verificationPayload);

      // Step 4: Success!
      setStep('success');

      // Add to store
      addPasskey({
        id: result.credentialId,
        credential_id: result.credentialId,
        label: 'Your Device',
        created_at: new Date().toISOString(),
        last_used_at: null,
        transports: ['internal'],
      });

      toast.success('Passkey created successfully! 🎉');

      // Auto-proceed after 2 seconds
      setTimeout(() => {
        onComplete();
      }, 2000);

    } catch (err: any) {
      console.error('Passkey enrollment error:', err);
      setStep('error');

      if (err.name === 'NotAllowedError') {
        setError('Passkey creation was cancelled. Please try again.');
      } else if (err.name === 'NotSupportedError') {
        setError('Your device does not support passkeys. Try using a security key instead.');
      } else if (err.name === 'InvalidStateError') {
        setError('A passkey for this account already exists on this device.');
      } else {
        setError(err.message || 'Failed to create passkey. Please try again.');
      }

      toast.error('Failed to create passkey');
    }
  };

  const handleRetry = () => {
    setError(null);
    setStep('prompt');
  };

  // Helper: Convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {/* Checking Support */}
        {step === 'check' && (
          <motion.div
            key="check"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Checking device compatibility...</p>
          </motion.div>
        )}

        {/* Prompt to Create */}
        {step === 'prompt' && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Hero Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <Fingerprint className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                Create Your Passkey
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
                {isPlatformAvailable
                  ? 'Use Face ID, Touch ID, or Windows Hello to secure your account'
                  : 'Use your device\'s security features to secure your account'}
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <Shield className="w-5 h-5 text-blue-500 mr-2" />
                Why Passkeys Are Better
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Phishing-resistant:</strong> Cannot be stolen or intercepted</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>No codes to type:</strong> Authenticate with biometrics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Works offline:</strong> No internet needed to authenticate</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Cross-device sync:</strong> Use on all your devices (iCloud, Google)</span>
                </li>
              </ul>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                What will happen next:
              </h3>
              <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                <li>Your browser will prompt you to authenticate</li>
                <li>Use Face ID, Touch ID, or your device PIN</li>
                <li>Your passkey will be created and saved securely</li>
                <li>You'll receive recovery codes (save them!)</li>
              </ol>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {onBack && (
                <Button variant="secondary" onClick={onBack} className="flex-1">
                  Back
                </Button>
              )}
              <Button
                variant="primary"
                onClick={handleCreatePasskey}
                className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
              >
                <Fingerprint className="w-5 h-5 mr-2" />
                Create Passkey
              </Button>
            </div>

            {/* Security Note */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              🔒 Your passkey is stored securely on your device and never leaves it.
            </p>
          </motion.div>
        )}

        {/* Creating */}
        {step === 'creating' && (
          <motion.div
            key="creating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 space-y-6"
          >
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
              <Loader className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                Creating Your Passkey...
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Please complete the authentication prompt on your device
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 max-w-md mx-auto">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                💡 <strong>Tip:</strong> Look for a popup or system prompt asking you to use Face ID, Touch ID, or your device PIN.
              </p>
            </div>
          </motion.div>
        )}

        {/* Verifying */}
        {step === 'verifying' && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 space-y-6"
          >
            <div className="w-24 h-24 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto">
              <Loader className="w-12 h-12 text-teal-500 animate-spin" />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                Verifying Passkey...
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Almost done! Just a moment while we securely register your passkey.
              </p>
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
                Passkey Created! 🎉
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Your account is now protected with passkey authentication
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-sm text-green-800 dark:text-green-200">
                ✅ <strong>Next Step:</strong> Save your recovery codes in case you lose access to your device.
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
                Passkey Creation Failed
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                {error || 'An unexpected error occurred'}
              </p>
            </div>

            {/* Troubleshooting */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 max-w-md mx-auto text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Troubleshooting:
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Make sure you're using a modern browser (Chrome, Safari, Edge, Firefox)</li>
                <li>• Check that your device has a PIN, Face ID, or Touch ID set up</li>
                <li>• Try using a different browser if the issue persists</li>
                <li>• Consider using an Authenticator App instead</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3 max-w-md mx-auto">
              {onBack && (
                <Button variant="secondary" onClick={onBack} className="flex-1">
                  Try Different Method
                </Button>
              )}
              {isSupported && (
                <Button variant="primary" onClick={handleRetry} className="flex-1">
                  Try Again
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

