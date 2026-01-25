import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import PasswordStrength from '../../components/auth/PasswordStrength';
import { Button } from '../../components/ui';
import authService, { register as registerUser } from '../../services/auth';
import { useAuthStore } from '../../store/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error for this field
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

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation (NIST 800-63B aligned)
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (formData.password.length > 64) {
      newErrors.password = 'Password must be less than 64 characters';
    }

    // Check for common breached passwords (mock - real would check API)
    const commonPasswords = ['password', '12345678', 'qwerty', 'admin', 'letmein'];
    if (commonPasswords.some((p) => formData.password.toLowerCase().includes(p))) {
      newErrors.password = 'This password appears in known data breaches. Please choose a different one';
    }

    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
      // Use direct function import as fallback
      const registerFunction = authService?.register || registerUser;
      
      if (!registerFunction || typeof registerFunction !== 'function') {
        console.error('Register function not available:', {
          authService,
          registerUser,
          'authService.register': authService?.register,
          'typeof registerUser': typeof registerUser,
        });
        throw new Error('Registration function not available. Please refresh the page.');
      }

      // Call real API
      const response = await registerFunction(
        formData.email,
        formData.password,
        formData.name
      );

      // Set auth state
      setAuth({
        user: response.user,
        accessToken: response.accessToken,
      });

      // Generic success message (OWASP: no enumeration)
      toast.success('Account created successfully!', {
        duration: 3000,
        icon: '✅',
      });

      // Navigate to account dashboard
      navigate('/account', { replace: true });
    } catch (error: any) {
      // Handle API errors
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Registration failed. Please try again.';
      
      // Generic error message (OWASP: no user enumeration)
      toast.error('Registration failed. Please check your information and try again.', {
        duration: 4000,
      });
      
      // Set form errors if provided by API
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join Easy11 and start shopping smarter with AI"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                errors.name
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              disabled={isSubmitting}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              autoComplete="email"
              className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
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
          
          {/* Password Strength Indicator */}
          {formData.password && !errors.password && (
            <div className="mt-3">
              <PasswordStrength password={formData.password} />
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirm Password
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

        {/* Terms Agreement */}
        <div>
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className={`form-checkbox h-5 w-5 text-blue-600 rounded mt-0.5 ${
                errors.agreeToTerms ? 'border-red-500' : ''
              }`}
              disabled={isSubmitting}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I agree to the{' '}
              <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.agreeToTerms}
            </p>
          )}
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
              Creating Account...
            </>
          ) : (
            <>
              Create Account
            </>
          )}
        </Button>

        {/* Security Note */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Your Security Matters
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                We use enterprise-grade encryption (Argon2id) to protect your password. We'll never
                share your data.
              </p>
            </div>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

