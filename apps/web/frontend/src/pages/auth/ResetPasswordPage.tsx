import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import PasswordStrength from '../../components/auth/PasswordStrength';
import { Button } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const token = searchParams.get('token');
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false);
        setIsValidatingToken(false);
        toast.error('Invalid reset link');
        return;
      }

      try {
        // Simulate token validation
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock validation - In production: GET /auth/validate-reset-token?token={token}
        // Check: token exists, not expired, not used
        
        setIsValidToken(true);
      } catch (error) {
        setIsValidToken(false);
        toast.error('Reset link expired or invalid');
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Password validation (NIST 800-63B)
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (formData.password.length > 64) {
      newErrors.password = 'Password must be less than 64 characters';
    }

    // Breach check (mock)
    const commonPasswords = ['password', '12345678', 'qwerty', 'admin'];
    if (commonPasswords.some((p) => formData.password.toLowerCase().includes(p))) {
      newErrors.password = 'This password is too common. Please choose a stronger one';
    }

    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock API - In production: POST /auth/reset-password
      // {
      //   token: token,
      //   new_password: formData.password
      // }
      
      // On success:
      // - Password updated
      // - All refresh tokens revoked
      // - New session created
      // - Auto sign-in

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

      setAuth(mockResponse);

      toast.success('Password updated successfully! You are now signed in.', {
        duration: 4000,
        icon: '✅',
      });

      // Redirect to account
      navigate('/', { replace: true });
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isValidatingToken) {
    return (
      <AuthLayout title="Validating Link" subtitle="Please wait...">
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Validating your reset link...</p>
        </div>
      </AuthLayout>
    );
  }

  // Invalid token
  if (!isValidToken) {
    return (
      <AuthLayout title="Invalid Reset Link" subtitle="This link is expired or invalid">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>

          <p className="text-gray-700 dark:text-gray-300">
            This password reset link has expired or has already been used.
          </p>

          <div className="space-y-3">
            <Link to="/auth/forgot-password">
              <Button variant="primary" size="lg" className="w-full">
                Request New Reset Link
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button variant="secondary" size="lg" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Valid token - show reset form
  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your new password below"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* New Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a strong password"
              autoComplete="new-password"
              className={`w-full pl-11 pr-12 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                errors.password
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              disabled={isSubmitting}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
          )}

          {/* Password Strength */}
          {formData.password && !errors.password && (
            <div className="mt-3">
              <PasswordStrength password={formData.password} />
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              className={`w-full pl-11 pr-12 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                errors.confirmPassword
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Security Info */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                Important Security Notice
              </p>
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                After resetting, you'll be signed out from all other devices for security. You'll
                need to sign in again.
              </p>
            </div>
          </div>
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
              Resetting Password...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Reset Password & Sign In
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

