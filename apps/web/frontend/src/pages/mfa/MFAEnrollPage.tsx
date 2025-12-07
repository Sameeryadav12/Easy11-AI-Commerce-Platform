/**
 * MFA Enrollment Page
 * Factor selection: Passkey, TOTP, or SMS
 * Sprint 2: MFA
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Smartphone, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';
import { useMFAStore } from '../../store/mfaStore';
import PasskeyEnrollment from '../../components/mfa/PasskeyEnrollment';
import TOTPEnrollment from '../../components/mfa/TOTPEnrollment';
import SMSEnrollment from '../../components/mfa/SMSEnrollment';
import RecoveryCodes from '../../components/mfa/RecoveryCodes';
import { Button } from '../../components/ui';
import toast from 'react-hot-toast';
import type { MFAFactor } from '../../types/mfa';

export default function MFAEnrollPage() {
  const navigate = useNavigate();
  const { status, fetchStatus } = useMFAStore();
  const [selectedFactor, setSelectedFactor] = useState<MFAFactor | null>(null);
  const [enrollmentStep, setEnrollmentStep] = useState<'select' | 'enroll' | 'recovery'>('select');

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const factors = [
    {
      id: 'webauthn' as MFAFactor,
      name: 'Passkey',
      icon: Shield,
      recommended: true,
      description: 'Fast, biometric, phishing-resistant',
      details: 'Use Face ID, Touch ID, or Windows Hello',
      pros: ['Most secure', 'No codes to type', 'Works offline'],
      badge: 'Recommended',
      badgeColor: 'bg-blue-500',
      gradient: 'from-blue-500 to-teal-500',
    },
    {
      id: 'totp' as MFAFactor,
      name: 'Authenticator App',
      icon: Smartphone,
      recommended: false,
      description: 'Works everywhere with 6-digit codes',
      details: 'Google Authenticator, Authy, 1Password',
      pros: ['Widely compatible', 'No phone signal needed', 'Multiple devices'],
      badge: 'Popular',
      badgeColor: 'bg-teal-500',
      gradient: 'from-teal-500 to-green-500',
    },
    {
      id: 'sms' as MFAFactor,
      name: 'SMS Text Message',
      icon: MessageSquare,
      recommended: false,
      description: 'Use only if other options unavailable',
      details: 'Carrier fees may apply',
      pros: ['No app needed', 'Works on any phone'],
      badge: 'Fallback',
      badgeColor: 'bg-orange-500',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const handleSelectFactor = (factor: MFAFactor) => {
    setSelectedFactor(factor);
  };

  const handleContinue = () => {
    if (!selectedFactor) {
      toast.error('Please select a factor to continue');
      return;
    }

    setEnrollmentStep('enroll');
  };

  const handleEnrollmentComplete = () => {
    setEnrollmentStep('recovery');
  };

  const handleRecoveryComplete = () => {
    toast.success('MFA setup complete! Your account is now secure. 🎉');
    navigate('/account/security');
  };

  const handleBack = () => {
    if (enrollmentStep === 'enroll') {
      setEnrollmentStep('select');
      setSelectedFactor(null);
    } else if (enrollmentStep === 'recovery') {
      setEnrollmentStep('select');
      setSelectedFactor(null);
    }
  };

  // Show enrollment component if selected
  if (enrollmentStep === 'enroll' && selectedFactor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {selectedFactor === 'webauthn' && (
            <PasskeyEnrollment onComplete={handleEnrollmentComplete} onBack={handleBack} />
          )}
          {selectedFactor === 'totp' && (
            <TOTPEnrollment onComplete={handleEnrollmentComplete} onBack={handleBack} />
          )}
          {selectedFactor === 'sms' && (
            <SMSEnrollment onComplete={handleEnrollmentComplete} onBack={handleBack} />
          )}
        </div>
      </div>
    );
  }

  // Show recovery codes after enrollment
  if (enrollmentStep === 'recovery') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <RecoveryCodes onComplete={handleRecoveryComplete} />
        </div>
      </div>
    );
  }

  // Show factor selection (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full mb-6 shadow-lg"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Enable Multi-Factor Authentication
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Add an extra layer of security to your account. Choose the method that works best for you.
          </p>

          {status && status.enabled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center mt-4 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              MFA is already enabled on your account
            </motion.div>
          )}
        </div>

        {/* Factor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {factors.map((factor, index) => (
            <motion.div
              key={factor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              onClick={() => handleSelectFactor(factor.id)}
              className={`
                relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6
                cursor-pointer transition-all duration-300
                ${
                  selectedFactor === factor.id
                    ? 'ring-4 ring-blue-500 scale-105 shadow-2xl'
                    : 'hover:shadow-xl hover:scale-102'
                }
              `}
            >
              {/* Badge */}
              {factor.recommended && (
                <div className="absolute -top-3 -right-3">
                  <span className="inline-flex items-center px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-md">
                    ⭐ {factor.badge}
                  </span>
                </div>
              )}

              {!factor.recommended && (
                <div className="absolute -top-3 -right-3">
                  <span className={`inline-flex items-center px-3 py-1 ${factor.badgeColor} text-white text-xs font-semibold rounded-full shadow-md`}>
                    {factor.badge}
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${factor.gradient} rounded-2xl mb-4 shadow-md`}>
                <factor.icon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                {factor.name}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-2 font-medium">
                {factor.description}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {factor.details}
              </p>

              {/* Pros */}
              <ul className="space-y-2 mb-4">
                {factor.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>

              {/* Selection Indicator */}
              {selectedFactor === factor.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute bottom-4 right-4"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedFactor}
            variant="primary"
            className="px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Continue with {selectedFactor && factors.find((f) => f.id === selectedFactor)?.name}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🔒 Your security data is encrypted and never shared with third parties.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            You can always add or remove factors later from your security settings.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

