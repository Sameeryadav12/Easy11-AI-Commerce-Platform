import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const token = searchParams.get('token');
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('No verification token provided');
        setIsVerifying(false);
        return;
      }

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock API - In production: POST /auth/verify-email
        // {
        //   token: token
        // }
        
        // On success:
        // - Mark user as verified
        // - Mark token as used
        // - Create session (access JWT + refresh cookie)
        // - Return user data

        const mockUser = {
          id: '1',
          email: 'user@example.com',
          name: 'User',
          role: 'CUSTOMER',
        };

        const mockResponse = {
          accessToken: 'mock-jwt-token-' + Date.now(),
          user: mockUser,
        };

        // Set auth state
        setAuth(mockResponse);
        
        setIsVerified(true);
        
        toast.success('Email verified successfully! Welcome to Easy11!', {
          duration: 4000,
          icon: '🎉',
        });

        // Auto-redirect after 2 seconds
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      } catch (error: any) {
        if (error.code === 'TOKEN_EXPIRED') {
          setError('Verification link has expired');
        } else if (error.code === 'TOKEN_USED') {
          setError('This verification link has already been used');
        } else {
          setError('Invalid verification link');
        }
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, setAuth, navigate]);

  // Verifying state
  if (isVerifying) {
    return (
      <AuthLayout title="Verifying Email" subtitle="Please wait while we verify your email address">
        <div className="text-center py-12">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Verifying your email address...
          </p>
        </div>
      </AuthLayout>
    );
  }

  // Success state
  if (isVerified) {
    return (
      <AuthLayout title="Email Verified!" subtitle="Your account is now active">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-teal-600 dark:text-teal-400" />
          </div>

          <div>
            <p className="text-lg text-gray-900 dark:text-white font-semibold mb-2">
              Success! Your email has been verified.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              You're now signed in and ready to start shopping!
            </p>
          </div>

          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
            <p className="text-sm text-teal-800 dark:text-teal-200">
              🎁 <strong>Welcome Bonus:</strong> You've earned 100 EasyPoints just for joining!
            </p>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Redirecting to your account...
          </p>
        </div>
      </AuthLayout>
    );
  }

  // Error state
  return (
    <AuthLayout title="Verification Failed" subtitle={error || 'Unable to verify email'}>
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>

        <div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {error === 'Verification link has expired'
              ? 'Your verification link has expired. Links are only valid for 30 minutes.'
              : error === 'This verification link has already been used'
              ? 'This verification link has already been used. You can sign in to your account.'
              : 'The verification link is invalid or malformed.'}
          </p>
        </div>

        <div className="space-y-3">
          {error === 'Verification link has expired' && (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => {
                toast('Resend verification feature coming soon!', { icon: '📧' });
              }}
            >
              Resend Verification Email
            </Button>
          )}
          <Link to="/auth/login">
            <Button
              variant={error === 'Verification link has expired' ? 'secondary' : 'primary'}
              size="lg"
              className="w-full"
            >
              Go to Sign In
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

