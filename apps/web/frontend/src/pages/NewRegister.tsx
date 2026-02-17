import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Check, X } from 'lucide-react';
import { Button, Card, CardBody, Input } from '../components/ui';
import { register as registerApi } from '../services/auth';
import { useAuthStore } from '../store/authStore';
import { useRecentlyViewedStore } from '../store/recentlyViewedStore';
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  getPasswordStrength,
  type PasswordStrengthResult,
} from '../utils/registerValidation';

function PasswordStrengthMeter({ strength: result }: { strength: PasswordStrengthResult }) {
  const { strength, checks } = result;
  const labels: Record<string, string> = {
    weak: 'Weak',
    fair: 'Fair',
    good: 'Good',
    strong: 'Strong',
  };
  const strengthColors: Record<string, string> = {
    weak: 'bg-red-500',
    fair: 'bg-amber-500',
    good: 'bg-lime-500',
    strong: 'bg-green-600',
  };
  const items = [
    { key: 'length8', done: checks.length8, label: '8+ characters' },
    { key: 'uppercase', done: checks.uppercase, label: 'Uppercase' },
    { key: 'lowercase', done: checks.lowercase, label: 'Lowercase' },
    { key: 'number', done: checks.number, label: 'Number' },
    { key: 'special', done: checks.special, label: 'Special character' },
    { key: 'notCommon', done: checks.notCommon, label: 'Not a common password' },
    { key: 'notEmail', done: checks.notEmail, label: 'Does not contain email' },
  ];
  if (!result.score && !result.checks.length8) return null;
  return (
    <div className="mt-2 space-y-2" role="status" aria-live="polite">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Strength:</span>
        <span className="text-xs font-semibold capitalize">{labels[strength]}</span>
        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${strengthColors[strength]}`}
            style={{ width: strength === 'weak' ? '25%' : strength === 'fair' ? '50%' : strength === 'good' ? '75%' : '100%' }}
          />
        </div>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
        {items.map(({ key, done, label }) => (
          <li key={key} className="flex items-center gap-1.5">
            {done ? <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
            <span className={done ? 'text-green-700 dark:text-green-400' : ''}>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const NewRegister = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const emailForValidation = formData.email.trim().toLowerCase();

  const passwordStrength = useMemo(
    () => getPasswordStrength(formData.password, emailForValidation, formData.name.trim()),
    [formData.password, emailForValidation, formData.name]
  );

  const nameValidation = useMemo(() => validateFullName(formData.name), [formData.name]);
  const emailValidation = useMemo(() => validateEmail(formData.email), [formData.email]);
  const passwordValidation = useMemo(
    () => validatePassword(formData.password, emailForValidation, formData.name.trim()),
    [formData.password, emailForValidation, formData.name]
  );
  const confirmValidation = useMemo(
    () => validateConfirmPassword(formData.password, formData.confirmPassword),
    [formData.password, formData.confirmPassword]
  );

  const isFormValid =
    nameValidation.valid &&
    emailValidation.valid &&
    passwordValidation.valid &&
    confirmValidation.valid &&
    formData.agreeToTerms;

  useEffect(() => {
    fetch('/api/v1/__debug/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'run8',
        hypothesisId: 'S',
        location: 'src/pages/NewRegister.tsx:useEffect',
        message: 'NewRegister mounted',
        data: { pathname: typeof window !== 'undefined' ? window.location.pathname : 'no-window' },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!isFormValid || isLoading) return;

    setIsLoading(true);

    try {
      if (typeof registerApi !== 'function') {
        throw new Error('Registration service not available. Please refresh the page.');
      }

      const nameTrimmed = formData.name.trim();
      const emailLower = formData.email.trim().toLowerCase();
      const termsAcceptedAt = formData.agreeToTerms ? new Date().toISOString() : undefined;

      const response = await registerApi(emailLower, formData.password, nameTrimmed, termsAcceptedAt);

      if (!response?.user || !response?.accessToken) {
        throw new Error('Invalid response from server');
      }

      // Business tactics: fresh start for new account — clear any guest "recently viewed" so they don't see it after signup
      useRecentlyViewedStore.getState().clearHistory();
      setAuth(response);
      navigate('/');
    } catch (err: any) {
      const status = err?.response?.status;
      const apiMessage = err?.response?.data?.message || err?.response?.data?.error?.message;

      const isDuplicateEmail = status === 409 || (status === 400 && /email already|already registered/i.test(apiMessage || ''));
      if (isDuplicateEmail) {
        setErrors({ email: 'Email already in use' });
      } else {
        const friendlyMessage =
          apiMessage ||
          (status === 400 ? 'Please check your details and try again.' : null) ||
          (status === 429 ? 'Too many attempts. Please wait and try again.' : null) ||
          err?.message ||
          'Registration failed';
        setErrors({ general: friendlyMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let finalValue: string | boolean = type === 'checkbox' ? checked : value;
    if (type !== 'checkbox' && typeof finalValue === 'string' && name === 'name') {
      finalValue = value;
    }
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (errors.general) setErrors((prev) => ({ ...prev, general: '' }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const nameError = (touched.name || formData.name) ? nameValidation.message : undefined;
  const emailError = (touched.email || formData.email) ? emailValidation.message : errors.email || undefined;
  const passwordError = (touched.password || formData.password) ? passwordValidation.message : (errors.password || undefined);
  const confirmError = (formData.password || formData.confirmPassword) ? confirmValidation.message : (errors.confirmPassword || undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-16">
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
                Create Account
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                Join Easy11 and start your smart shopping journey
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name *"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('name')}
                  placeholder="e.g. Sameer Yadav, O'Connor"
                  leftIcon={<User className="w-5 h-5" />}
                  error={nameError}
                  required
                  autoComplete="name"
                />

                <Input
                  label="Email Address *"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="you@example.com"
                  leftIcon={<Mail className="w-5 h-5" />}
                  error={emailError}
                  required
                  autoComplete="email"
                />

                <div>
                  <Input
                    label="Password *"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('password')}
                    placeholder="At least 8 characters"
                    leftIcon={<Lock className="w-5 h-5" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:text-blue-500 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    }
                    error={passwordError}
                    required
                    autoComplete="new-password"
                  />
                  <PasswordStrengthMeter strength={passwordStrength} />
                </div>

                <Input
                  label="Confirm Password *"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="Repeat your password"
                  leftIcon={<Lock className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="hover:text-blue-500 transition-colors"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  }
                  error={confirmError}
                  required
                  autoComplete="new-password"
                />

                {/* Terms & Conditions */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    required
                    aria-required="true"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {!formData.agreeToTerms && (touched.terms || errors.terms) && (
                  <p className="text-sm text-red-600 dark:text-red-400">You must agree to the terms and conditions.</p>
                )}

                {errors.general && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  fullWidth
                  disabled={!isFormValid}
                  isLoading={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    or sign up with
                  </span>
                </div>
              </div>

              {/* Social Registration */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" className="justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </Button>
                <Button variant="secondary" className="justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  </svg>
                </Button>
              </div>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewRegister;

