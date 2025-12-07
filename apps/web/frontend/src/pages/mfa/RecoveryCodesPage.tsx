/**
 * Recovery Codes Page
 * Sprint 2: MFA - View and manage recovery codes
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecoveryCodes from '../../components/mfa/RecoveryCodes';
import StepUpModal from '../../components/mfa/StepUpModal';
import { useMFAStore } from '../../store/mfaStore';

export default function RecoveryCodesPage() {
  const navigate = useNavigate();
  const { isStepUpValid, recoveryCodes } = useMFAStore();
  const [showStepUp, setShowStepUp] = useState(false);
  const [isRegenerate, setIsRegenerate] = useState(false);

  const handleComplete = () => {
    navigate('/account/security');
  };

  const handleRegenerateClick = () => {
    // Check if step-up is needed
    if (!isStepUpValid()) {
      setShowStepUp(true);
    } else {
      setIsRegenerate(true);
    }
  };

  const handleStepUpSuccess = () => {
    setShowStepUp(false);
    setIsRegenerate(true);
  };

  return (
    <>
      <RecoveryCodes
        onComplete={handleComplete}
        isRegenerate={isRegenerate}
      />

      <StepUpModal
        isOpen={showStepUp}
        onClose={() => setShowStepUp(false)}
        onSuccess={handleStepUpSuccess}
        purpose="regenerate your recovery codes"
        action="Regenerate Recovery Codes"
      />
    </>
  );
}

