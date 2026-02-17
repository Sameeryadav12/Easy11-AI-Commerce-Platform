import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Mail, Calendar } from 'lucide-react';

/**
 * Privacy Policy Page
 * 
 * Comprehensive privacy policy document explaining how Easy11 collects,
 * uses, and protects user data. Compliant with GDPR, CCPA, and other
 * privacy regulations.
 */
export default function PrivacyPolicyPage() {
  const lastUpdated = 'January 15, 2025';

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: `Welcome to Easy11. We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our products and services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.`,
    },
    {
      id: 'information-we-collect',
      title: 'Information We Collect',
      content: `We collect information that you provide directly to us, information we obtain automatically when you use our services, and information from third parties.

**Information You Provide:**
- Account information (name, email address, password)
- Profile information (shipping addresses, payment methods, preferences)
- Communications (customer service inquiries, feedback)
- Content you create (reviews, wishlists, saved searches)

**Information We Collect Automatically:**
- Device information (IP address, browser type, operating system)
- Usage data (pages visited, time spent, clicks, search queries)
- Location data (general geographic location based on IP)
- Cookies and tracking technologies

**Information from Third Parties:**
- Social media platforms (if you connect your account)
- Payment processors (transaction information)
- Analytics providers (usage statistics)`,
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      content: `We use the information we collect to:
- Provide, maintain, and improve our services
- Process transactions and send related information
- Send you technical notices, updates, and support messages
- Respond to your comments, questions, and requests
- Provide personalized product recommendations using AI
- Monitor and analyze trends, usage, and activities
- Detect, prevent, and address technical issues and fraud
- Comply with legal obligations and enforce our terms`,
    },
    {
      id: 'data-sharing',
      title: 'Sharing Your Information',
      content: `We do not sell your personal information. We may share your information in the following circumstances:

**Service Providers:** We share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.

**Business Transfers:** If we are involved in a merger, acquisition, or sale of assets, your information may be transferred.

**Legal Requirements:** We may disclose your information if required to do so by law or in response to valid requests by public authorities.

**With Your Consent:** We may share your information with your consent or at your direction.`,
    },
    {
      id: 'data-security',
      title: 'Data Security',
      content: `We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:

- Encryption of data in transit and at rest
- Regular security assessments and updates
- Access controls and authentication requirements
- Employee training on data protection
- Incident response procedures

However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.`,
    },
    {
      id: 'legal-basis',
      title: 'Legal Basis for Processing (GDPR)',
      content: `For individuals in the European Economic Area (EEA) and UK, we process your personal data based on the following legal bases under the General Data Protection Regulation (GDPR):

**Contract:** Processing necessary to perform our contract with you (e.g., order fulfillment, account management).

**Legitimate Interests:** Processing for our legitimate business interests (e.g., fraud prevention, service improvement), where such interests are not overridden by your rights.

**Consent:** Where you have given clear consent for specific processing (e.g., marketing, non-essential cookies).

**Legal Obligation:** Processing required to comply with applicable law.

**Vital Interests:** Processing necessary to protect your vital interests or those of another person.

You may withdraw consent at any time. Withdrawal does not affect the lawfulness of processing before withdrawal.`,
    },
    {
      id: 'data-protection-officer',
      title: 'Data Protection Officer',
      content: `For questions about our data practices, GDPR compliance, or to exercise your rights, you may contact our Data Protection Officer (DPO) at:

**Email:** dpo@easy11.com
**Privacy Team:** privacy@easy11.com

Our DPO handles inquiries related to data protection, privacy rights, and regulatory compliance.`,
    },
    {
      id: 'ccpa-rights',
      title: 'California Consumer Privacy Rights (CCPA)',
      content: `If you are a California resident, the California Consumer Privacy Act (CCPA) grants you additional rights:

**Right to Know:** You can request disclosure of the categories and specific pieces of personal information we have collected about you.

**Right to Delete:** You can request deletion of your personal information, subject to certain exceptions.

**Right to Opt-Out of Sale or Sharing:** We do not sell your personal information. You can opt out of "sharing" for cross-context behavioral advertising via our "Do Not Sell or Share My Personal Information" link in the footer.

**Right to Correct:** You can request correction of inaccurate personal information.

**Right to Non-Discrimination:** We will not discriminate against you for exercising your CCPA rights.

To exercise these rights, contact us at privacy@easy11.com or use the privacy controls in your account. We will verify your identity before processing requests.`,
    },
    {
      id: 'australia-privacy',
      title: 'Australia Privacy Act',
      content: `Easy11 operates in Australia and complies with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).

**Collection:** We collect personal information only as reasonably necessary for our functions and activities, and by lawful and fair means.

**Use and Disclosure:** We use and disclose personal information only for the primary purpose of collection or for related purposes you would reasonably expect.

**Data Quality and Security:** We take reasonable steps to ensure personal information is accurate, complete, and up to date, and protected from misuse, loss, and unauthorized access.

**Access and Correction:** You have the right to access and correct your personal information. Contact us at privacy@easy11.com.

**Complaints:** If you have a privacy complaint, contact us first. If you are not satisfied, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC).`,
    },
    {
      id: 'your-rights',
      title: 'Your Privacy Rights',
      content: `Depending on your location, you may have certain rights regarding your personal information:

**Access:** You can request access to the personal information we hold about you.

**Correction:** You can request correction of inaccurate or incomplete information.

**Deletion:** You can request deletion of your personal information, subject to certain exceptions.

**Portability:** You can request a copy of your data in a structured, machine-readable format.

**Opt-Out:** You can opt out of certain data processing activities, such as marketing communications and personalized advertising.

**Objection:** You can object to processing of your personal information for certain purposes.

To exercise these rights, please contact us at privacy@easy11.com or use the privacy controls in your account settings.`,
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking Technologies',
      content: `We use cookies and similar tracking technologies to collect and store information about your preferences and activity on our website. Cookies are small data files stored on your device.

**Types of Cookies We Use:**
- Essential cookies (required for website functionality)
- Analytics cookies (help us understand how visitors use our site)
- Preference cookies (remember your settings and preferences)
- Marketing cookies (used to deliver relevant advertisements)

You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features of our website.`,
    },
    {
      id: 'children',
      title: 'Children\'s Privacy',
      content: `Our services are not intended for children under the age of 13 (or 16 in the EU). We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately, and we will take steps to delete such information.`,
    },
    {
      id: 'international',
      title: 'International Data Transfers',
      content: `Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. We take appropriate safeguards to ensure your information receives an adequate level of protection, including:

- Standard contractual clauses approved by data protection authorities
- Adequacy decisions by relevant authorities
- Other appropriate safeguards as required by law`,
    },
    {
      id: 'retention',
      title: 'Data Retention',
      content: `We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.

Factors we consider when determining retention periods include:
- The nature and sensitivity of the information
- The purposes for which we process it
- Legal and regulatory requirements
- The potential risk of harm from unauthorized use or disclosure`,
    },
    {
      id: 'changes',
      title: 'Changes to This Privacy Policy',
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically.`,
    },
    {
      id: 'contact',
      title: 'Contact Us',
      content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

**Email:** privacy@easy11.com
**Support:** support@easy11.com
**Legal:** legal@easy11.com
**Address:** Melbourne, Victoria, Australia

For EU residents, you also have the right to lodge a complaint with your local data protection authority.`,
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
            <Shield className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-blue-100 text-lg">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
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
        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Quick Navigation
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Privacy Policy Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                {section.id === 'data-security' && <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
                {section.id === 'your-rights' && <Eye className="w-8 h-8 text-green-600 dark:text-green-400" />}
                {section.id === 'contact' && <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />}
                {!['data-security', 'your-rights', 'contact'].includes(section.id) && (
                  <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Additional Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/account/privacy"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Privacy Settings
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your privacy preferences and data settings
                </p>
              </a>
              <a
                href="/contact"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Contact Privacy Team
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Have questions? Reach out to our privacy team
                </p>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

