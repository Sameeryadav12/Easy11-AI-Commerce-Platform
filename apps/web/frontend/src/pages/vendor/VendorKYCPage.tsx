/**
 * Vendor KYC Verification Page
 * Sprint 7: Document upload and identity verification
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle, FileText, Shield, Building2, CreditCard } from 'lucide-react';
import { useVendorStore } from '../../store/vendorStore';
import vendorAPI from '../../services/vendorAPI';
import { Button } from '../../components/ui';
import toast from 'react-hot-toast';

type KYCStep = 'intro' | 'government_id' | 'business_docs' | 'address_proof' | 'bank_docs' | 'review' | 'success';

export default function VendorKYCPage() {
  const { currentVendor, kycDocuments, setKYCDocuments } = useVendorStore();
  const [currentStep, setCurrentStep] = useState<KYCStep>('intro');
  const [isUploading, setIsUploading] = useState(false);
  
  // Document files
  const [governmentId, setGovernmentId] = useState<File | null>(null);
  const [businessRegistration, setBusinessRegistration] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const [bankStatement, setBankStatement] = useState<File | null>(null);

  const steps: { key: KYCStep; title: string; description: string; icon: any }[] = [
    { key: 'government_id', title: 'Government ID', description: 'Driver\'s license or passport', icon: Shield },
    { key: 'business_docs', title: 'Business Registration', description: 'ABN/ACN certificate', icon: Building2 },
    { key: 'address_proof', title: 'Proof of Address', description: 'Utility bill or bank statement', icon: FileText },
    { key: 'bank_docs', title: 'Bank Details', description: 'Bank statement for verification', icon: CreditCard },
  ];

  const handleFileUpload = (file: File | null, type: string) => {
    switch (type) {
      case 'government_id':
        setGovernmentId(file);
        break;
      case 'business_docs':
        setBusinessRegistration(file);
        break;
      case 'address_proof':
        setProofOfAddress(file);
        break;
      case 'bank_docs':
        setBankStatement(file);
        break;
    }
  };

  const handleNext = () => {
    const stepIndex = steps.findIndex((s) => s.key === currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].key);
    } else {
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    if (currentStep === 'review') {
      setCurrentStep(steps[steps.length - 1].key);
    } else {
      const stepIndex = steps.findIndex((s) => s.key === currentStep);
      if (stepIndex > 0) {
        setCurrentStep(steps[stepIndex - 1].key);
      } else {
        setCurrentStep('intro');
      }
    }
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    try {
      await vendorAPI.submitKYC({
        vendor_id: currentVendor?.id || 'vendor-123',
        documents: {
          government_id: governmentId!,
          business_registration: businessRegistration,
          proof_of_address: proofOfAddress!,
          bank_details: bankStatement!,
        },
        declaration: {
          is_owner: true,
          is_authorized: true,
          accepts_terms: true,
        },
      });
      
      setCurrentStep('success');
      toast.success('KYC documents submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit KYC documents');
    } finally {
      setIsUploading(false);
    }
  };

  const renderFileUpload = (
    type: string,
    file: File | null,
    icon: any,
    title: string,
    description: string
  ) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
          {React.createElement(icon, { className: 'w-8 h-8 text-blue-500' })}
        </div>
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => handleFileUpload(e.target.files?.[0] || null, type)}
            className="hidden"
            id={`upload-${type}`}
          />
          <label
            htmlFor={`upload-${type}`}
            className="cursor-pointer flex flex-col items-center"
          >
            {file ? (
              <>
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <p className="text-gray-900 dark:text-white font-medium">{file.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-900 dark:text-white font-medium">
                  Drop file here or click to upload
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  PDF, JPG, or PNG (Max 10MB)
                </p>
              </>
            )}
          </label>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            ✓ Ensure document is clear and all details are visible<br />
            ✓ File must be less than 10MB<br />
            ✓ Accepted formats: PDF, JPG, PNG
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        {currentStep !== 'government_id' && (
          <Button variant="secondary" onClick={handleBack} className="flex-1">
            Back
          </Button>
        )}
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!file}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container-custom py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
            KYC Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Complete your identity verification to start selling on Easy11
          </p>
        </div>

        {/* Progress Bar */}
        {currentStep !== 'intro' && currentStep !== 'success' && (
          <div className="mb-8">
            <div className="flex justify-between items-center max-w-3xl mx-auto">
              {steps.map((step, index) => {
                const stepIndex = steps.findIndex((s) => s.key === currentStep);
                const isComplete = index < stepIndex;
                const isCurrent = step.key === currentStep;
                
                return (
                  <div key={step.key} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                          isComplete
                            ? 'bg-green-500 text-white'
                            : isCurrent
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                        }`}
                      >
                        {isComplete ? '✓' : index + 1}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 transition-all ${
                          isComplete ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Intro */}
        {currentStep === 'intro' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                Let's Verify Your Identity
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                This process takes about 5 minutes and helps us keep Easy11 safe and secure.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white">You'll need:</h3>
              {steps.map((step) => (
                <div key={step.key} className="flex items-start gap-3">
                  <step.icon className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{step.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="primary"
              onClick={() => setCurrentStep('government_id')}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
            >
              Start Verification
            </Button>
          </div>
        )}

        {/* Government ID */}
        {currentStep === 'government_id' && renderFileUpload(
          'government_id',
          governmentId,
          Shield,
          'Government ID',
          'Upload your driver\'s license or passport'
        )}

        {/* Business Docs */}
        {currentStep === 'business_docs' && renderFileUpload(
          'business_docs',
          businessRegistration,
          Building2,
          'Business Registration',
          'Upload your ABN/ACN certificate'
        )}

        {/* Address Proof */}
        {currentStep === 'address_proof' && renderFileUpload(
          'address_proof',
          proofOfAddress,
          FileText,
          'Proof of Address',
          'Upload a recent utility bill or bank statement'
        )}

        {/* Bank Docs */}
        {currentStep === 'bank_docs' && renderFileUpload(
          'bank_docs',
          bankStatement,
          CreditCard,
          'Bank Details',
          'Upload a bank statement for account verification'
        )}

        {/* Review */}
        {currentStep === 'review' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Review & Submit
            </h2>

            <div className="space-y-4 mb-8">
              {[
                { label: 'Government ID', file: governmentId },
                { label: 'Business Registration', file: businessRegistration },
                { label: 'Proof of Address', file: proofOfAddress },
                { label: 'Bank Statement', file: bankStatement },
              ].map((doc) => (
                <div key={doc.label} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{doc.label}</p>
                      {doc.file && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{doc.file.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Declaration
              </h3>
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" defaultChecked />
                  <span>I am the authorized owner of this business</span>
                </label>
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" defaultChecked />
                  <span>All information provided is accurate and truthful</span>
                </label>
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" defaultChecked />
                  <span>I accept Easy11's Terms of Service and Vendor Agreement</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isUploading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
              >
                {isUploading ? 'Submitting...' : 'Submit for Review'}
              </Button>
            </div>
          </div>
        )}

        {/* Success */}
        {currentStep === 'success' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>
            
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Verification Submitted! 🎉
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Your documents are under review. We'll notify you within 1-2 business days.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                What happens next?
              </h3>
              <ol className="text-left space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>1. Our team reviews your documents (usually within 24 hours)</li>
                <li>2. You'll receive an email once approved</li>
                <li>3. You can then start uploading products and accepting orders</li>
                <li>4. First payout typically arrives after your first sale</li>
              </ol>
            </div>

            <Button
              variant="primary"
              onClick={() => window.location.href = '/vendor/dashboard'}
              className="w-full md:w-auto"
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

