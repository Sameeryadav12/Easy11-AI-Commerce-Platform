import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { login } from '../../services/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get redirect path from location state (if redirected from protected route)
  const from = (location.state as any)?.from || '/';

  useEffect(() => {
    // #region agent log
    fetch('/api/v1/__debug/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'run3',
        hypothesisId: 'A',
        location: 'src/pages/auth/LoginPage.tsx:useEffect',
        message: 'LoginPage mounted',
        data: {
          pathname: typeof window !== 'undefined' ? window.location.pathname : 'no-window',
          typeofLogin: typeof login,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error for this field and general error when user edits
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      if (name === 'email' || name === 'password') delete newErrors.general;
      return newErrors;
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDemoLogin = () => {
    const demoUser = {
      id: 'demo-user-id',
      email: 'TestDashboard2@gmail.com',
      name: 'Test Dashboard',
      role: 'CUSTOMER' as const,
      createdAt: new Date().toISOString(),
    };
    setAuth({
      user: demoUser,
      accessToken: 'demo-token',
      refreshToken: 'demo-refresh',
    });
    toast.success(`Signed in as ${demoUser.email} (demo mode)`, {
      icon: '👋',
      duration: 3000,
    });
    navigate(from, { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // #region agent log
      fetch('/api/v1/__debug/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'A',
          location: 'src/pages/auth/LoginPage.tsx:handleSubmit',
          message: 'about to validate login import',
          data: {
            pathname: typeof window !== 'undefined' ? window.location.pathname : 'no-window',
            typeofLogin: typeof login,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      // Verify login function exists
      if (typeof login !== 'function') {
        console.error('[LoginPage] login is not a function:', typeof login, login);
        throw new Error('Login function not available. Please refresh the page.');
      }

      console.log('[LoginPage] Calling login function...');
      
      // Call login function directly
      const response = await login(formData.email, formData.password);

      // Validate response structure
      if (!response || !response.user || !response.accessToken) {
        throw new Error('Invalid response from server');
      }

      // Set auth state
      setAuth({
        user: response.user,
        accessToken: response.accessToken,
      });

      toast.success(`Welcome back, ${response.user.name || response.user.email}!`, {
        icon: '👋',
        duration: 3000,
      });

      // Redirect to intended page or account
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);

      const status = error.response?.status;
      const apiMessage =
        error.response?.data?.error?.message || error.response?.data?.message;
      let errorMessage = 'Invalid credentials or verification required';

      if (error.response) {
        errorMessage =
          apiMessage ||
          (status === 401 ? 'Invalid email or password' : undefined) ||
          (status === 503
            ? 'Service temporarily unavailable. Use demo login to explore the app.'
            : undefined) ||
          (status >= 500
            ? 'Server is temporarily unavailable. Use demo login to explore the app.'
            : undefined) ||
          errorMessage;
      } else if (error.request) {
        errorMessage =
          'Unable to connect to server. Use demo login to explore the app.';
      } else if (error.message?.includes('login is not a function')) {
        errorMessage = 'Authentication service error. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({
        general: errorMessage,
        email: ' ',
        password: ' ',
      });
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue shopping"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.general && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {errors.general}
            {(errors.general?.includes('demo login') ||
              errors.general?.includes('unavailable')) && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="mt-3 w-full"
                onClick={handleDemoLogin}
              >
                Use demo login
              </Button>
            )}
          </div>
        )}
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
              autoFocus
            />
          </div>
          {errors.email && errors.email.trim() && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
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
          {errors.password && errors.password.trim() && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-blue-600 rounded"
              disabled={isSubmitting}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Remember me</span>
          </label>
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
              Signing In...
            </>
          ) : (
            <>Sign In</>
          )}
        </Button>

        {/* Security Badge */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Shield className="w-4 h-4 text-teal-500" />
          <span>Secured by 256-bit SSL encryption</span>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">
              New to Easy11?
            </span>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <Link to="/auth/register">
            <Button variant="secondary" size="lg" className="w-full">
              Create Account
            </Button>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

