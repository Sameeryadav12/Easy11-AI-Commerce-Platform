import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock API - In production: POST /auth/forgot-password
      // Generic response (OWASP: no user enumeration)
      
      setEmailSent(true);
      
      toast.success('If an account exists, we sent a reset link to your email', {
        duration: 5000,
        icon: '📧',
      });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title={emailSent ? 'Check Your Email' : 'Forgot Password?'}
      subtitle={
        emailSent
          ? 'We sent password reset instructions'
          : "No worries! We'll send you reset instructions"
      }
    >
      {!emailSent ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={isSubmitting}
                autoFocus
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              We'll send you an email with instructions to reset your password. The link will be
              valid for 30 minutes.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>Send Reset Link</>
            )}
          </Button>

          {/* Back to Login */}
          <Link to="/auth/login">
            <button
              type="button"
              className="w-full flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Sign In</span>
            </button>
          </Link>
        </form>
      ) : (
        /* Success State */
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-10 h-10 text-teal-600 dark:text-teal-400" />
          </div>

          {/* Message */}
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If an account exists for <strong>{email}</strong>, you'll receive password reset
              instructions shortly.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please check your inbox and spam folder. The link will expire in 30 minutes.
            </p>
          </div>

          {/* Security Note */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Security Notice
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  If you didn't request this, your account is still secure. Password reset links
                  expire quickly and can only be used once.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link to="/auth/login">
              <Button variant="primary" size="lg" className="w-full">
                Return to Sign In
              </Button>
            </Link>
            <button
              onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}
              className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Didn't receive the email? Try again
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

