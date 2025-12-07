/**
 * Step-Up Authentication Modal
 * Sprint 2: MFA - Re-authentication for sensitive actions
 */

import { useState } from 'react';
import { useMFAStore } from '../../store/mfaStore';
import MFAChallengeModal from './MFAChallengeModal';
import toast from 'react-hot-toast';

interface StepUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (stepUpToken: string) => void;
  purpose: string; // e.g., "change your email", "add a payment method"
  action: string; // e.g., "Change Email", "Add Payment Method"
}

export default function StepUpModal({
  isOpen,
  onClose,
  onSuccess,
  purpose,
  action,
}: StepUpModalProps) {
  const { setStepUpToken } = useMFAStore();

  const handleChallengeSuccess = (mfaToken: string) => {
    // In a real app, exchange the MFA token for a Step-Up token from the backend
    // For now, we'll use the MFA token directly as a Step-Up token
    const stepUpToken = `stepup-${mfaToken}`;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Store in MFA store
    setStepUpToken(stepUpToken, expiresAt);

    // Return to caller
    onSuccess(stepUpToken);

    toast.success('Authentication verified! ✅');
  };

  const contextMessage = `Confirm it's you to ${purpose}`;

  return (
    <MFAChallengeModal
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={handleChallengeSuccess}
      context={contextMessage}
    />
  );
}

