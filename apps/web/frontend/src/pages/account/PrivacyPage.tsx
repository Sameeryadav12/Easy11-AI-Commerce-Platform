/**
 * Privacy & Data Management Page
 * Sprint 3: Data export and account deletion
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, AlertTriangle, Shield, FileText, Lock, Info } from 'lucide-react';
import dashboardAPI from '../../services/dashboardAPI';
import StepUpModal from '../../components/mfa/StepUpModal';
import { Button } from '../../components/ui';
import toast from 'react-hot-toast';
import usePersonalizationStore from '../../store/personalizationStore';
import type { PersonalizationSettings } from '../../types/personalization';

export default function PrivacyPage() {
  const [showStepUp, setShowStepUp] = useState(false);
  const [stepUpAction, setStepUpAction] = useState<'export' | 'delete'>('export');
  const [isExporting, setIsExporting] = useState(false);
  const [exportRequest, setExportRequest] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const {
    settings,
    loadSettings,
    updateSettings,
  } = usePersonalizationStore((state) => ({
    settings: state.settings,
    loadSettings: state.loadSettings,
    updateSettings: state.updateSettings,
  }));
  const [allowPersonalization, setAllowPersonalization] = useState(true);
  const [explorationRatio, setExplorationRatio] = useState(0.25);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (settings) {
      setAllowPersonalization(settings.allowExploration);
      setExplorationRatio(settings.explorationRatio);
    }
  }, [settings]);

  const persistSettings = (next: Partial<PersonalizationSettings>) => {
    const base: PersonalizationSettings = settings ?? {
      mutedBrands: [],
      mutedCategories: [],
      allowExploration: true,
      explorationRatio: 0.25,
    };
    updateSettings({
      ...base,
      ...next,
    });
  };

  const handleExportData = () => {
    setStepUpAction('export');
    setShowStepUp(true);
  };

  const handleDeleteAccount = () => {
    setStepUpAction('delete');
    setShowStepUp(true);
  };

  const handleStepUpSuccess = async (stepUpToken: string) => {
    setShowStepUp(false);

    if (stepUpAction === 'export') {
      setIsExporting(true);
      try {
        const request = await dashboardAPI.requestDataExport();
        setExportRequest(request);
        toast.success('Data export started! Check back in a few minutes.');
        
        // Poll for completion
        setTimeout(async () => {
          const status = await dashboardAPI.getDataExportStatus(request.id);
          if (status.status === 'completed') {
            setExportRequest(status);
            toast.success('Your data is ready for download!');
          }
        }, 5000);
      } catch (error) {
        toast.error('Failed to start data export');
      } finally {
        setIsExporting(false);
      }
    } else if (stepUpAction === 'delete') {
      setShowDeleteConfirm(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
      toast.error('Please type "DELETE MY ACCOUNT" exactly');
      return;
    }

    try {
      const request = await dashboardAPI.requestAccountDeletion(deleteConfirmText);
      toast.success(
        `Account scheduled for deletion on ${new Date(request.scheduled_deletion_date).toLocaleDateString()}. You can cancel within 7 days.`
      );
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error('Failed to request account deletion');
    }
  };

  return (
    <div className="container-custom py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Privacy & Data
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your data, privacy settings, and account
          </p>
        </div>

        {/* Data Export Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <Download className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                Export Your Data
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Download a copy of all your personal data, orders, and activity. The export includes:
              </p>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  Account information and profile data
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  Order history and transaction records
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  Wishlist, reviews, and preferences
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  Addresses and payment methods (tokenized)
                </li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                You&apos;ll receive an email when your export is ready. Exports may take up to 24 hours.
              </p>

              {exportRequest && exportRequest.status === 'completed' && (
                <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
                  <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                    ✅ Your data export is ready! Download link expires in 24 hours.
                  </p>
                  <a
                    href={exportRequest.download_url}
                    download
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Data (ZIP)
                  </a>
                </div>
              )}

              {exportRequest && exportRequest.status === 'processing' && (
                <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    ⏳ Processing your data export... Estimated time: {exportRequest.estimated_time_minutes} minutes
                  </p>
                </div>
              )}

              <Button
                onClick={handleExportData}
                variant="primary"
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                {isExporting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Starting Export...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Request Data Export (Requires MFA)
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-teal-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                Privacy Settings
              </h2>
              <div className="space-y-4 mt-6">
                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Personalized Recommendations</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Allow AI to personalize your shopping experience</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowPersonalization}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      setAllowPersonalization(checked);
                      persistSettings({ allowExploration: checked });
                      toast.success(
                        checked
                          ? 'Personalized recommendations enabled'
                          : 'Personalization paused — showing neutral sorting',
                      );
                    }}
                    className="w-5 h-5 text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <div
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl space-y-3"
                  title="Controls how much of your recommendations are personalized vs. fresh discoveries. Higher = more variety."
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                          Exploration ratio
                          <Info
                            className="w-4 h-4 text-gray-400 cursor-help"
                            title="Controls how much of your recommendations are personalized vs. fresh discoveries. Higher = more variety to avoid filter bubbles."
                            aria-label="Exploration ratio info"
                          />
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Keeps 10–30% of slots fresh to avoid filter bubbles. Default: 25%.
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-800/40 text-blue-700 dark:text-blue-200 text-xs font-semibold">
                      {Math.round(explorationRatio * 100)}% newness
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={0.3}
                    step={0.05}
                    value={explorationRatio}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setExplorationRatio(value);
                      persistSettings({ explorationRatio: value });
                    }}
                    className="w-full accent-blue-500"
                  />
                </div>

                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Marketing Analytics</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Help us improve with usage analytics</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Third-Party Cookies</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Allow cookies from advertising partners</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 border-2 border-red-200 dark:border-red-700">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                Delete Account
              </h2>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 dark:text-red-200 mb-2">
                      ⚠️ Permanent Action
                    </p>
                    <ul className="space-y-1 text-sm text-red-800 dark:text-red-300">
                      <li>• All your data will be permanently deleted</li>
                      <li>• Active orders will be cancelled</li>
                      <li>• Unused points and tier status will be permanently lost</li>
                      <li>• This action cannot be undone</li>
                      <li>• You have 7 days to cancel the deletion</li>
                    </ul>
                    <p className="text-xs text-red-700 dark:text-red-400 mt-3">
                      Some transaction records may be retained for legal or tax purposes.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleDeleteAccount}
                variant="primary"
                className="bg-red-500 hover:bg-red-600 flex items-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Delete Account (Requires MFA)
              </Button>
            </div>
          </div>
        </div>

        {/* Step-Up Modal */}
        <StepUpModal
          isOpen={showStepUp}
          onClose={() => setShowStepUp(false)}
          onSuccess={handleStepUpSuccess}
          purpose={stepUpAction === 'export' ? 'export your data' : 'delete your account'}
          action={stepUpAction === 'export' ? 'Export Data' : 'Delete Account'}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                  Delete Account?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  This action is permanent and cannot be undone. Type "DELETE MY ACCOUNT" to confirm.
                </p>
              </div>

              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE MY ACCOUNT"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30 mb-6 text-center font-mono"
              />

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText('');
                }} className="flex-1">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirmDelete}
                  disabled={deleteConfirmText !== 'DELETE MY ACCOUNT'}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  Delete Forever
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

