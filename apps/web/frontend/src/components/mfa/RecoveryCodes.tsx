/**
 * Recovery Codes Component
 * Sprint 2: MFA - Display and download recovery codes
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Download, Copy, Check, AlertTriangle, CheckCircle } from 'lucide-react';
import mfaAPI from '../../services/mfaAPI';
import { useMFAStore } from '../../store/mfaStore';
import { copyToClipboard, downloadTextFile } from '../../utils/mfaUtils';
import { Button } from '../ui';
import toast from 'react-hot-toast';

interface RecoveryCodesProps {
  onComplete: () => void;
  isRegenerate?: boolean;
}

export default function RecoveryCodes({ onComplete, isRegenerate = false }: RecoveryCodesProps) {
  const [codes, setCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const { setRecoveryCodes } = useMFAStore();

  useEffect(() => {
    generateCodes();
  }, []);

  const generateCodes = async () => {
    setIsLoading(true);
    try {
      const result = await mfaAPI.generateRecoveryCodes();
      setCodes(result.codes);
      setRecoveryCodes(result);
    } catch (err: any) {
      console.error('Failed to generate recovery codes:', err);
      toast.error('Failed to generate recovery codes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAll = async () => {
    const text = `Easy11 Recovery Codes\nGenerated: ${new Date().toLocaleString()}\n\n${codes.join('\n')}\n\nKeep these codes safe! Each code can only be used once.`;
    
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      toast.success('Recovery codes copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    } else {
      toast.error('Failed to copy codes');
    }
  };

  const handleDownload = () => {
    const text = `Easy11 Recovery Codes\nGenerated: ${new Date().toLocaleString()}\n\n${codes.join('\n')}\n\nIMPORTANT:\n• Keep these codes safe and secure\n• Each code can only be used once\n• Store them in a password manager or secure location\n• If you lose access to your authentication method, you'll need these codes\n\nEasy11 Security Team`;
    
    downloadTextFile(text, `easy11-recovery-codes-${Date.now()}.txt`);
    setDownloaded(true);
    toast.success('Recovery codes downloaded!');
  };

  const handleComplete = () => {
    if (!confirmed) {
      toast.error('Please confirm you\'ve saved your recovery codes');
      return;
    }

    onComplete();
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-12 h-12 text-blue-500 animate-pulse" />
        </div>
        <p className="text-gray-600 dark:text-gray-300">Generating recovery codes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-3">
            {isRegenerate ? 'New Recovery Codes Generated' : 'Save Your Recovery Codes'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            These codes can be used to access your account if you lose your authentication method
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-xl p-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">
                ⚠️ Critical Security Information
              </h3>
              <ul className="space-y-1 text-sm text-red-800 dark:text-red-300">
                <li>• <strong>Each code can only be used once</strong></li>
                <li>• <strong>Store them in a secure location</strong> (password manager, encrypted file)</li>
                <li>• <strong>Never share these codes</strong> with anyone, including Easy11 staff</li>
                <li>• <strong>This is the only time they'll be shown</strong> in plain text</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recovery Codes Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {codes.map((code, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between"
              >
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  #{index + 1}
                </span>
                <code className="text-lg font-mono font-bold text-gray-900 dark:text-white tracking-wider">
                  {code}
                </code>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={handleCopyAll}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy All
                </>
              )}
            </Button>
            <Button
              variant="primary"
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Download className="w-5 h-5" />
              {downloaded ? 'Downloaded!' : 'Download'}
            </Button>
          </div>
        </div>

        {/* Confirmation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 w-5 h-5 text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              <strong className="block mb-1">I've saved my recovery codes securely</strong>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                I understand that these codes won't be shown again and I'm responsible for keeping them safe.
              </span>
            </span>
          </label>
        </div>

        {/* Storage Recommendations */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <Shield className="w-5 h-5 text-blue-500 mr-2" />
            Recommended Storage Options
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Password Manager:</strong> 1Password, Bitwarden, LastPass (Secure Notes)</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Encrypted File:</strong> Save the downloaded file in an encrypted folder</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Physical Copy:</strong> Print and store in a safe place (not recommended as primary)</span>
            </li>
          </ul>
        </div>

        {/* Complete Button */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            onClick={handleComplete}
            disabled={!confirmed}
            className="px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Security Settings
          </Button>
        </div>

        {/* Security Note */}
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          🔒 You can regenerate codes anytime from your security settings (requires MFA verification)
        </p>
      </motion.div>
    </div>
  );
}

