/**
 * Security Page
 * MFA status, device management, session management
 * Sprint 2: MFA
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Monitor,
  Clock,
  MapPin,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { useMFAStore } from '../../store/mfaStore';
import mfaAPI from '../../services/mfaAPI';
import { getRelativeTime, getFactorIcon, getFactorName, formatDateTime } from '../../utils/mfaUtils';
import { Button } from '../../components/ui';
import BreadcrumbBack from '../../components/navigation/BreadcrumbBack';
import toast from 'react-hot-toast';

export default function SecurityPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get('from');
  const fromSupport = fromParam === 'support' || fromParam === 'account-support';
  const parentLabel = fromSupport ? 'Support' : 'Profile';
  const parentUrl = fromSupport ? (fromParam === 'account-support' ? '/account/support' : '/support') : '/account/profile';
  const {
    status,
    devices,
    sessions,
    setDevices,
    setSessions,
    removeDevice,
    removeSession,
    fetchStatus,
  } = useMFAStore();

  const [isLoading, setIsLoading] = useState(true);
  const [revokeDeviceModal, setRevokeDeviceModal] = useState<{ deviceId: string; label: string } | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setIsLoading(true);
    try {
      await fetchStatus();
      const [devicesData, sessionsData] = await Promise.all([
        mfaAPI.getDevices(),
        mfaAPI.getSessions(),
      ]);
      setDevices(devicesData);
      setSessions(sessionsData);
    } catch (error) {
      toast.error('Failed to load security data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnableMFA = () => {
    navigate('/auth/mfa/enroll');
  };

  const handleRevokeDeviceClick = (device: { id: string; label: string }) => {
    setRevokeDeviceModal({ deviceId: device.id, label: device.label });
  };

  const handleRevokeDeviceConfirm = async () => {
    if (!revokeDeviceModal) return;
    try {
      await mfaAPI.revokeDevice(revokeDeviceModal.deviceId);
      await removeDevice(revokeDeviceModal.deviceId);
      setRevokeDeviceModal(null);
      toast.success('Device removed successfully');
    } catch (error) {
      toast.error('Failed to revoke device');
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await mfaAPI.revokeSession(sessionId);
      await removeSession(sessionId);
      toast.success('Session signed out');
    } catch (error) {
      toast.error('Failed to sign out session');
    }
  };

  const handleRevokeAllOtherSessions = async () => {
    const others = sessions.filter((s) => !s.is_current);
    if (others.length === 0) {
      toast.success('No other sessions to sign out');
      return;
    }
    setRevokingAll(true);
    try {
      await Promise.all(others.map((s) => mfaAPI.revokeSession(s.id)));
      setSessions(sessions.filter((s) => s.is_current));
      toast.success(`Signed out ${others.length} session${others.length > 1 ? 's' : ''}`);
    } catch (error) {
      toast.error('Failed to sign out sessions');
    } finally {
      setRevokingAll(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const mfaEnabled = status?.enabled || false;
  const mfaFactorCount =
    (status?.factors.webauthn || 0) + (status?.factors.totp || 0) + (status?.factors.sms || 0);

  /** Mask IP for consumer apps: 203.123.45.67 → 203.123.xx.xx */
  const maskIP = (ip: string) => {
    const parts = ip.split('.');
    if (parts.length !== 4) return ip;
    return `${parts[0]}.${parts[1]}.xx.xx`;
  };

  return (
    <div className="container-custom py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <BreadcrumbBack
            parentLabel={parentLabel}
            parentUrl={parentUrl}
            currentPage="Security"
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Security & Privacy
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your account security settings, devices, and active sessions
            </p>
          </div>
        </div>

        {/* MFA Status Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`mb-8 p-6 rounded-2xl shadow-md ${
            mfaEnabled
              ? 'bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-2 border-green-200 dark:border-green-700'
              : 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {mfaEnabled ? (
                <ShieldCheck className="w-12 h-12 text-green-600 dark:text-green-400 flex-shrink-0" />
              ) : (
                <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-400 flex-shrink-0" />
              )}
              <div>
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                  {mfaEnabled ? '✅ MFA is Enabled' : '⚠️ MFA is Disabled'}
                </h2>
                {mfaEnabled ? (
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      Your account is protected with multi-factor authentication
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {status?.factors.webauthn! > 0 && (
                        <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                          {getFactorIcon('webauthn')} {status?.factors.webauthn} Passkey
                          {status?.factors.webauthn! > 1 ? 's' : ''}
                        </span>
                      )}
                      {status?.factors.totp! > 0 && (
                        <span className="inline-flex items-center px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium">
                          {getFactorIcon('totp')} Authenticator App
                        </span>
                      )}
                      {status?.factors.sms! > 0 && (
                        <span className="inline-flex items-center px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
                          {getFactorIcon('sms')} SMS
                        </span>
                      )}
                      <span className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                        {status?.recovery_codes_count || 0} Recovery Codes
                      </span>
                    </div>
                    {status?.default_factor && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Default factor: {getFactorIcon(status.default_factor)}{' '}
                        {getFactorName(status.default_factor)}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Your account is vulnerable. Enable MFA now for enhanced security.
                    </p>
                    <Button
                      onClick={handleEnableMFA}
                      variant="primary"
                      className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Shield className="w-5 h-5" />
                      Enable MFA (Recommended)
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {mfaEnabled && (
              <Button
                onClick={() => navigate('/auth/mfa/enroll')}
                variant="secondary"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Factor
              </Button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Devices Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-blue-500" />
                Trusted Devices
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {devices.length} device{devices.length !== 1 ? 's' : ''}
              </span>
            </div>

            {devices.length === 0 ? (
              <div className="text-center py-8">
                <Monitor className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No devices found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {devices.map((device) => (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      device.is_current
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          {device.os === 'iOS' || device.os === 'Android' ? (
                            <Smartphone className="w-5 h-5 text-white" />
                          ) : (
                            <Monitor className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                              {device.label}
                            </h3>
                            {device.is_current && (
                              <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                                Current
                              </span>
                            )}
                            {device.trusted && (
                              <span className="inline-flex items-center px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                                ✓ Trusted
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <p className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Last seen: {getRelativeTime(device.last_seen)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              Last activity: {formatDateTime(device.last_seen)}
                            </p>
                            <p className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {device.last_location} • {maskIP(device.last_ip)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-2">
                        {!device.is_current && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleRevokeDeviceClick(device)}
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Sessions Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-6 h-6 text-teal-500" />
                Active Sessions
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {sessions.length} session{sessions.length !== 1 ? 's' : ''}
                </span>
                {sessions.some((s) => !s.is_current) && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRevokeAllOtherSessions}
                    disabled={revokingAll}
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                  >
                    {revokingAll ? 'Signing out...' : 'Sign out all other sessions'}
                  </Button>
                )}
              </div>
            </div>

            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No active sessions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      session.is_current
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {session.device_label}
                          </h3>
                          {session.is_current && (
                            <span className="inline-flex items-center px-2 py-0.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-medium rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <p>Created: {getRelativeTime(session.created_at)}</p>
                          <p>Last seen: {getRelativeTime(session.last_seen)}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Last activity: {formatDateTime(session.last_seen)}
                          </p>
                          <p className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {session.last_location} • {maskIP(session.last_ip)}
                          </p>
                          {mfaEnabled && session.mfa_completed_at && (
                            <p className="text-green-600 dark:text-green-400">
                              ✓ MFA verified {getRelativeTime(session.mfa_completed_at)}
                            </p>
                          )}
                        </div>
                      </div>
                      {!session.is_current && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleRevokeSession(session.id)}
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                        >
                          Sign out this device
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium mb-1">Security Tip</p>
                  <p>
                    If you see unfamiliar devices or sessions, revoke them immediately and change
                    your password.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Remove Device Confirmation Modal */}
        <AnimatePresence>
          {revokeDeviceModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setRevokeDeviceModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex gap-3 mb-6">
                  <AlertCircle className="w-10 h-10 text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                      Remove this trusted device?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Remove &quot;{revokeDeviceModal.label}&quot; from trusted devices? You may be asked for
                      verification next time you sign in from this device.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setRevokeDeviceModal(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleRevokeDeviceConfirm}
                    className="flex-1 bg-red-500 hover:bg-red-600"
                  >
                    Remove
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

