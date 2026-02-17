/**
 * MFA Verify Page
 * Sprint 2: MFA - Challenge page for login/risk events
 */

import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import MFAChallengeModal from '../../components/mfa/MFAChallengeModal';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function MFAVerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();

  const redirectTo = searchParams.get('redirect') || '/';

  const handleSuccess = (mfaToken: string) => {
    // In a real app, exchange the MFA token for a full session token
    // For now, we'll just mark the user as authenticated
    setAuth({
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      tier: 'gold',
      points: 2450,
      avatar: null,
    }, `access-token-${mfaToken}`);

    toast.success('Welcome back! 🎉');
    navigate(redirectTo);
  };

  const handleClose = () => {
    // If user closes without completing MFA, redirect to login
    toast.error('MFA verification required');
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <MFAChallengeModal
        isOpen={true}
        onClose={handleClose}
        onSuccess={handleSuccess}
        context="Complete authentication to access your account"
      />
    </div>
  );
}

