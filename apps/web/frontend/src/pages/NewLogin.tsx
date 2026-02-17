import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Card, CardBody, Input } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import { login as loginApi } from '../services/auth';

export const NewLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // #region agent log
    fetch('/api/v1/__debug/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'run3',
        hypothesisId: 'A',
        location: 'src/pages/NewLogin.tsx:useEffect',
        message: 'NewLogin mounted',
        data: {
          pathname: typeof window !== 'undefined' ? window.location.pathname : 'no-window',
          typeofLoginApi: typeof loginApi,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // #region agent log
      (() => {
        const payload = {
          sessionId: 'debug-session',
          runId: 'run7',
          hypothesisId: 'A',
          location: 'src/pages/NewLogin.tsx:handleSubmit',
          message: 'submit clicked',
          data: {
            pathname: typeof window !== 'undefined' ? window.location.pathname : 'no-window',
            typeofLoginApi: typeof loginApi,
            emailPresent: !!formData.email,
            passwordLength: typeof formData.password === 'string' ? formData.password.length : -1,
          },
          timestamp: Date.now(),
        };
        try {
          if (navigator && typeof navigator.sendBeacon === 'function') {
            navigator.sendBeacon('/api/v1/__debug/log', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
            return;
          }
        } catch {}
        fetch('/api/v1/__debug/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {});
      })();
      // #endregion

      if (typeof loginApi !== 'function') {
        throw new Error('Login service not available. Please refresh the page.');
      }

      const response = await loginApi(formData.email, formData.password);
      // #region agent log
      (() => {
        const payload = {
          sessionId: 'debug-session',
          runId: 'run7',
          hypothesisId: 'E',
          location: 'src/pages/NewLogin.tsx:afterLogin',
          message: 'loginApi resolved',
          data: {
            hasResponse: !!response,
            hasUser: !!(response as any)?.user,
            hasAccessToken: !!(response as any)?.accessToken,
          },
          timestamp: Date.now(),
        };
        try {
          if (navigator && typeof navigator.sendBeacon === 'function') {
            navigator.sendBeacon('/api/v1/__debug/log', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
            return;
          }
        } catch {}
        fetch('/api/v1/__debug/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {});
      })();
      // #endregion

      if (!response || !response.user || !response.accessToken) {
        throw new Error('Invalid response from server');
      }

      setAuth(response);
      navigate('/');
    } catch (err: any) {
      // #region agent log
      (() => {
        const payload = {
          sessionId: 'debug-session',
          runId: 'run7',
          hypothesisId: 'A',
          location: 'src/pages/NewLogin.tsx:catch',
          message: 'login failed',
          data: { errorMessage: (err as any)?.message },
          timestamp: Date.now(),
        };
        try {
          if (navigator && typeof navigator.sendBeacon === 'function') {
            navigator.sendBeacon('/api/v1/__debug/log', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
            return;
          }
        } catch {}
        fetch('/api/v1/__debug/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {});
      })();
      // #endregion
      const status = (err as any)?.response?.status;
      const apiMessage =
        (err as any)?.response?.data?.error?.message ||
        (err as any)?.response?.data?.message;

      const friendlyMessage =
        apiMessage ||
        (status === 401 ? 'Invalid email or password' : undefined) ||
        (status === 429 ? 'Too many attempts. Please wait and try again.' : undefined) ||
        (status === 503 || status >= 500
          ? 'Server is temporarily unavailable. Use demo login to explore the app.'
          : undefined) ||
        (err.message && !err.message.includes('status code')
          ? err.message
          : undefined) ||
        'Login failed';

      setError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    navigate('/');
  };

  const showDemoOption =
    error &&
    (error.includes('demo login') || error.includes('unavailable'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-16">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-heading font-bold text-3xl">E</span>
              </div>
              <span className="text-3xl font-heading font-bold text-navy dark:text-white">
                Easy11
              </span>
            </Link>
          </div>

          <Card variant="elevated">
            <CardBody>
              <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2 text-center">
                Welcome Back!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                Sign in to your account to continue shopping
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  leftIcon={<Mail className="w-5 h-5" />}
                  required
                />

                <div>
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    leftIcon={<Lock className="w-5 h-5" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:text-blue-500 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    }
                    required
                  />
                  <div className="flex justify-end mt-2">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    {showDemoOption && (
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

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    or
                  </span>
                </div>
              </div>

              {/* Social Login (Placeholder) */}
              <div className="space-y-3">
                <Button variant="secondary" fullWidth className="justify-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  Continue with Facebook
                </Button>
                <Button variant="secondary" fullWidth className="justify-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Demo Credentials */}
          <div className="mt-6 text-center">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardBody className="py-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Demo:</strong> admin@easy11.com / admin123
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLogin;

