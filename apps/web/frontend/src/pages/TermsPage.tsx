import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, AlertCircle, CheckCircle, XCircle, Mail, Calendar, ArrowUp, Printer } from 'lucide-react';

/** Shared contact info - keep consistent across legal pages */
const LEGAL_CONTACT = {
  email: 'legal@easy11.com',
  support: 'support@easy11.com',
  privacy: 'privacy@easy11.com',
  address: 'Melbourne, Victoria, Australia',
};

/**
 * Terms of Service Page
 * 
 * Comprehensive terms of service document outlining the legal agreement
 * between Easy11 and its users. Covers usage rights, responsibilities,
 * and limitations.
 */
export default function TermsPage() {
  const lastUpdated = 'January 15, 2025';
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const sections = [
    {
      id: 'agreement',
      title: 'Agreement to Terms',
      content: `By accessing or using Easy11's website, services, or applications (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.

These Terms constitute a legally binding agreement between you and Easy11. We may modify these Terms at any time, and such modifications will be effective immediately upon posting. Your continued use of the Service after any such modifications constitutes your acceptance of the modified Terms.`,
    },
    {
      id: 'eligibility',
      title: 'Eligibility',
      content: `You must be at least 18 years old (or the age of majority in your jurisdiction) to use our Service. By using the Service, you represent and warrant that:

- You are of legal age to form a binding contract
- You have the authority to enter into these Terms
- Your use of the Service will not violate any applicable law or regulation
- All information you provide is accurate, current, and complete

If you are using the Service on behalf of a company or organization, you represent that you have the authority to bind that entity to these Terms.`,
    },
    {
      id: 'account',
      title: 'User Accounts',
      content: `To access certain features of the Service, you may be required to create an account. You are responsible for:

**Account Security:**
- Maintaining the confidentiality of your account credentials
- All activities that occur under your account
- Notifying us immediately of any unauthorized use
- Ensuring your account information is accurate and up-to-date

**Account Termination:**
We reserve the right to suspend or terminate your account at any time for violations of these Terms, fraudulent activity, or any other reason we deem necessary to protect the Service and other users.`,
    },
    {
      id: 'use-of-service',
      title: 'Use of Service',
      content: `You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:

- Violate any applicable laws or regulations
- Infringe upon the rights of others
- Transmit any harmful, offensive, or illegal content
- Attempt to gain unauthorized access to the Service
- Interfere with or disrupt the Service or servers
- Use automated systems to access the Service without permission
- Copy, modify, or create derivative works of the Service
- Reverse engineer or attempt to extract source code
- Use the Service for any commercial purpose without authorization

We reserve the right to investigate and prosecute violations of these Terms to the fullest extent of the law.`,
    },
    {
      id: 'products',
      title: 'Products and Pricing',
      content: `**Product Information:**
- We strive to provide accurate product descriptions, images, and pricing
- Product availability is subject to change without notice
- Prices are subject to change at any time
- We reserve the right to refuse or cancel any order

**Pricing:**
- All prices are displayed in the currency specified
- Prices do not include shipping, taxes, or other fees unless stated
- We are not responsible for pricing errors and reserve the right to correct them

**Product Availability:**
- Products are subject to availability
- We may limit quantities or discontinue products at any time
- If a product becomes unavailable after you place an order, we will notify you and provide a refund`,
    },
    {
      id: 'orders',
      title: 'Orders and Payment',
      content: `**Order Acceptance:**
- Your order is an offer to purchase products from us
- We reserve the right to accept or reject any order
- Order confirmation does not constitute acceptance
- We may cancel orders due to errors, fraud, or unavailability

**Payment:**
- Payment must be received before we process your order
- We accept various payment methods as displayed at checkout
- You represent that you are authorized to use the payment method
- You agree to pay all charges incurred in connection with your account

**Order Cancellation:**
- You may cancel orders within 1 hour of placement
- After processing begins, cancellation may not be possible
- Refunds will be processed according to our refund policy`,
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      content: `**Our Content:**
- All content on the Service, including text, graphics, logos, images, and software, is the property of Easy11 or its licensors
- Content is protected by copyright, trademark, and other intellectual property laws
- You may not use our content without our express written permission

**Your Content:**
- You retain ownership of content you submit to the Service
- By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content
- You represent that you have the right to grant such license
- We may remove any content that violates these Terms or is otherwise objectionable`,
    },
    {
      id: 'ai-features',
      title: 'AI-Powered Features',
      content: `Easy11 uses artificial intelligence and machine learning to provide personalized recommendations and services. By using these features, you understand and agree that:

- AI recommendations are suggestions based on algorithms and data analysis
- We do not guarantee the accuracy or suitability of AI-generated content
- You are responsible for verifying product information before purchase
- AI features may use your data to improve recommendations
- We may update or modify AI features at any time

You may opt out of certain AI features through your account settings, though this may limit functionality.`,
    },
    {
      id: 'third-party',
      title: 'Third-Party Services',
      content: `Our Service may contain links to third-party websites, services, or resources. We are not responsible for:

- The availability, accuracy, or content of third-party services
- Any transactions between you and third parties
- Any loss or damage arising from your use of third-party services

Your interactions with third parties are solely between you and the third party. We encourage you to review the terms and privacy policies of any third-party services you use.`,
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers',
      content: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:

- WARRANTIES OF MERCHANTABILITY
- FITNESS FOR A PARTICULAR PURPOSE
- NON-INFRINGEMENT
- ACCURACY OR RELIABILITY

We do not warrant that the Service will be uninterrupted, secure, or error-free. We do not guarantee that any defects will be corrected or that the Service will meet your requirements.`,
    },
    {
      id: 'limitation',
      title: 'Limitation of Liability',
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, EASY11 AND ITS AFFILIATES SHALL NOT BE LIABLE FOR:

- INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES
- LOSS OF PROFITS, DATA, USE, OR OTHER INTANGIBLE LOSSES
- DAMAGES RESULTING FROM YOUR USE OR INABILITY TO USE THE SERVICE
- DAMAGES RESULTING FROM UNAUTHORIZED ACCESS TO OR USE OF YOUR ACCOUNT

Our total liability to you for all claims arising from or related to the Service shall not exceed the amount you paid to us in the 12 months preceding the claim, or $100, whichever is greater.

Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above limitations may not apply to you.`,
    },
    {
      id: 'indemnification',
      title: 'Indemnification',
      content: `You agree to indemnify, defend, and hold harmless Easy11, its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or relating to:

- Your use of the Service
- Your violation of these Terms
- Your violation of any rights of another party
- Your content or conduct

This indemnification obligation will survive termination of these Terms and your use of the Service.`,
    },
    {
      id: 'termination',
      title: 'Termination',
      content: `**By You:**
- You may stop using the Service at any time
- You may delete your account through account settings
- Some provisions may survive termination

**By Us:**
We may terminate or suspend your access to the Service immediately, without prior notice, for any reason, including:

- Violation of these Terms
- Fraudulent or illegal activity
- Extended periods of inactivity
- At our sole discretion

Upon termination, your right to use the Service will cease immediately. We may delete your account and data, subject to our Privacy Policy and applicable law.`,
    },
    {
      id: 'governing-law',
      title: 'Governing Law',
      content: `These Terms shall be governed by and construed in accordance with the laws of the State of Victoria, Australia, without regard to its conflict of law provisions.

Any disputes arising from or relating to these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of Victoria, Australia.

If you are located outside Australia, you agree that any disputes will be resolved in accordance with applicable local laws and regulations.`,
    },
    {
      id: 'changes',
      title: 'Changes to Terms',
      content: `We reserve the right to modify these Terms at any time. We will notify you of material changes by:

- Posting the updated Terms on this page
- Updating the "Last Updated" date
- Sending an email notification (for significant changes)
- Displaying a notice on the Service

Your continued use of the Service after changes become effective constitutes your acceptance of the modified Terms. If you do not agree to the changes, you must stop using the Service.`,
    },
    {
      id: 'contact',
      title: 'Contact Information',
      content: `If you have any questions about these Terms of Service, please contact us:

**Email:** legal@easy11.com
**Support:** support@easy11.com
**Privacy:** privacy@easy11.com
**Address:** Melbourne, Victoria, Australia

For general inquiries, please use our contact form or visit our support center.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Scale className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-blue-100 text-lg">
              Please read these terms carefully before using our service.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-blue-100 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Last Updated: {lastUpdated}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Important Legal Notice
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  These Terms of Service constitute a legally binding agreement. By using Easy11's services, 
                  you agree to be bound by these terms. Please read them carefully and contact us if you have 
                  any questions.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Layout: sticky Quick Nav + content */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Quick Navigation - sticky on desktop */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Quick Navigation
              </h2>
              <nav className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline py-1"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
              <button
                type="button"
                onClick={() => window.print()}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>
            </div>
          </motion.aside>

          {/* Terms Content */}
          <div className="flex-1 min-w-0 max-w-4xl space-y-12">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
              className="scroll-mt-28 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                {section.id === 'disclaimers' && <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />}
                {section.id === 'limitation' && <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />}
                {section.id === 'eligibility' && <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />}
                {!['disclaimers', 'limitation', 'eligibility'].includes(section.id) && (
                  <Scale className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                )}
                {section.title}
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {section.content.split('\n\n').map((paragraph, pIndex) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    // Bold heading
                    const text = paragraph.replace(/\*\*/g, '');
                    return (
                      <h3 key={pIndex} className="font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                        {text}
                      </h3>
                    );
                  } else if (paragraph.includes('**')) {
                    // Paragraph with bold text
                    const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={pIndex} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        {parts.map((part, partIndex) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return (
                              <strong key={partIndex} className="font-semibold text-gray-900 dark:text-white">
                                {part.replace(/\*\*/g, '')}
                              </strong>
                            );
                          }
                          return <span key={partIndex}>{part}</span>;
                        })}
                      </p>
                    );
                  } else {
                    // Regular paragraph
                    return (
                      <p key={pIndex} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    );
                  }
                })}
              </div>
            </motion.section>
          ))}
          </div>
        </div>

        {/* Acceptance Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Questions About These Terms?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              If you have any questions or concerns about these Terms of Service, please don't hesitate to contact our legal team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`mailto:${LEGAL_CONTACT.email}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Legal Team
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                General Contact
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Back to top - floating button */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 print:hidden"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}

