import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Lock,
  KeyRound,
  Smartphone,
  MapPin,
  CreditCard,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { useMFAStore } from '../../store/mfaStore';

export default function ProfileSecurityPage() {
  const user = useAuthStore((s) => s.user);
  const mfaEnabled = useMFAStore((s) => s.status?.enabled ?? false);

  const created = useMemo(() => {
    const raw = user?.createdAt;
    if (!raw) return null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  }, [user?.createdAt]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
          Profile & Security
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your personal info and account security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                  {user?.name || 'Customer'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.role || 'CUSTOMER'}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/40">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {user?.email || '—'}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/40">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  Member since
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {created ? created.toLocaleDateString() : '—'}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/account/settings?from=profile">
                <Button variant="secondary">Preferences</Button>
              </Link>
              <Link to="/account/privacy?from=profile">
                <Button variant="secondary">Privacy & data</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Security & shortcuts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Security overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                  Security
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Password, MFA (two‑step), devices, and active sessions.
                </p>
              </div>
              <Link to="/account/security?from=profile">
                <Button variant="primary">
                  Manage security
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Lock className="w-4 h-4" />
                  Password
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">Set</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Use a strong unique password.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Shield className="w-4 h-4" />
                  Two‑step (MFA)
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {mfaEnabled ? 'Enabled' : 'Disabled'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Recommended for account safety.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Smartphone className="w-4 h-4" />
                  Devices & sessions
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">Manage</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Sign out unknown devices.
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/auth/forgot-password">
                <Button variant="secondary">
                  <KeyRound className="w-4 h-4 mr-2" />
                  Reset password
                </Button>
              </Link>
              <Link to="/auth/mfa/enroll">
                <Button variant="secondary">
                  <Shield className="w-4 h-4 mr-2" />
                  {mfaEnabled ? 'Add MFA method' : 'Enable MFA'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Common account shortcuts (Amazon/eBay style) */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Account shortcuts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: 'Addresses', to: '/account/addresses?from=profile', icon: MapPin },
                { label: 'Payment methods', to: '/account/payments?from=profile', icon: CreditCard },
                { label: 'Notifications', to: '/account/notifications?from=profile', icon: Bell },
                { label: 'Privacy & data', to: '/account/privacy?from=profile', icon: Shield },
              ].map((x) => {
                const Icon = x.icon;
                return (
                  <Link
                    key={x.to}
                    to={x.to}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white">{x.label}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

