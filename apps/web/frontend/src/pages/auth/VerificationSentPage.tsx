import { useLocation, Link } from 'react-router-dom';
import { Mail, Shield } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui';

export default function VerificationSentPage() {
  const location = useLocation();
  const email = (location.state as any)?.email || 'your email';

  return (
    <AuthLayout
      title="Check Your Email"
      subtitle="We sent you a verification link"
    >
      <div className="text-center space-y-6">
        {/* Icon */}
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>

        {/* Message */}
        <div>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            We've sent a verification email to:
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {email}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click the link in the email to verify your account. The link will expire in 30 minutes.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            What's next?
          </p>
          <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
            <li>Check your email inbox</li>
            <li>Click the "Verify Email" button in the email</li>
            <li>You'll be automatically signed in</li>
            <li>Start shopping with Easy11!</li>
          </ol>
        </div>

        {/* Security Note */}
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-medium text-teal-900 dark:text-teal-100 mb-1">
                Didn't receive the email?
              </p>
              <p className="text-xs text-teal-800 dark:text-teal-200">
                Check your spam folder. If you still don't see it, you can request a new
                verification email.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => {
              // In production: POST /auth/resend-verification
              alert('Resend verification feature coming soon!');
            }}
          >
            Resend Verification Email
          </Button>
          
          <Link to="/auth/login">
            <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Back to Sign In
            </button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

