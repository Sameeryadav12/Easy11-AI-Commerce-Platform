import { motion } from 'framer-motion';
import { Cookie, Settings, Shield, BarChart, Target, Calendar, Info } from 'lucide-react';

/**
 * Cookie Policy Page
 * 
 * Comprehensive cookie policy explaining what cookies we use,
 * why we use them, and how users can manage their cookie preferences.
 * Compliant with GDPR, CCPA, and ePrivacy Directive.
 */
export default function CookiePolicyPage() {
  const lastUpdated = 'January 15, 2025';

  const cookieTypes = [
    {
      category: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      required: true,
      examples: [
        'Authentication cookies (keep you logged in)',
        'Security cookies (protect against fraud)',
        'Load balancing cookies (distribute traffic)',
        'Session cookies (remember your cart)',
      ],
      purpose: 'Essential for website functionality and security',
      retention: 'Session or up to 1 year',
    },
    {
      category: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website.',
      required: false,
      examples: [
        'Page view tracking',
        'User behavior analysis',
        'Performance monitoring',
        'Error tracking',
      ],
      purpose: 'Improve website performance and user experience',
      retention: 'Up to 2 years',
    },
    {
      category: 'Functional Cookies',
      description: 'These cookies enable enhanced functionality and personalization.',
      required: false,
      examples: [
        'Language preferences',
        'Theme settings (dark/light mode)',
        'Shopping preferences',
        'Recently viewed items',
      ],
      purpose: 'Remember your preferences and settings',
      retention: 'Up to 1 year',
    },
    {
      category: 'Marketing Cookies',
      description: 'These cookies are used to deliver relevant advertisements and track campaign performance.',
      required: false,
      examples: [
        'Ad targeting',
        'Campaign measurement',
        'Retargeting',
        'Social media integration',
      ],
      purpose: 'Deliver personalized ads and measure effectiveness',
      retention: 'Up to 2 years',
    },
  ];

  const sections = [
    {
      id: 'what-are-cookies',
      title: 'What Are Cookies?',
      content: `Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.

Cookies allow websites to:
- Remember your preferences and settings
- Understand how you use the website
- Provide personalized content and advertisements
- Improve website functionality and performance

Cookies do not contain personal information that can identify you directly, but they may be linked to personal information we hold about you.`,
    },
    {
      id: 'how-we-use',
      title: 'How We Use Cookies',
      content: `Easy11 uses cookies for various purposes to enhance your experience:

**Website Functionality:**
- Keep you logged in to your account
- Remember items in your shopping cart
- Maintain your preferences and settings
- Ensure website security

**Analytics and Performance:**
- Understand how visitors use our website
- Identify areas for improvement
- Monitor website performance
- Track error rates and issues

**Personalization:**
- Provide personalized product recommendations
- Remember your browsing history
- Customize content based on your interests
- Improve search results

**Marketing:**
- Deliver relevant advertisements
- Measure campaign effectiveness
- Enable social media features
- Track conversions and engagement`,
    },
    {
      id: 'third-party',
      title: 'Third-Party Cookies',
      content: `In addition to our own cookies, we may also use various third-party cookies to report usage statistics and deliver advertisements. These third parties may set their own cookies or similar technologies on your device.

**Analytics Providers:**
- Google Analytics (website usage statistics)
- Other analytics tools (performance monitoring)

**Advertising Partners:**
- Social media platforms (Facebook, Instagram, etc.)
- Advertising networks (display ads, retargeting)
- Affiliate partners (tracking referrals)

**Service Providers:**
- Payment processors (transaction security)
- Customer support tools (chat functionality)
- Content delivery networks (faster loading)

These third parties may use cookies to collect information about your online activities across different websites. We do not control these third-party cookies, and this Cookie Policy does not cover them. Please refer to the privacy policies of these third parties for more information.`,
    },
    {
      id: 'manage-cookies',
      title: 'Managing Your Cookie Preferences',
      content: `You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer.

**Browser Settings:**
You can control cookies through your browser settings. Here's how to manage cookies in popular browsers:

- **Chrome:** Settings > Privacy and security > Cookies and other site data
- **Firefox:** Options > Privacy & Security > Cookies and Site Data
- **Safari:** Preferences > Privacy > Cookies and website data
- **Edge:** Settings > Privacy, search, and services > Cookies and site permissions

**Cookie Consent Banner:**
When you first visit our website, you'll see a cookie consent banner. You can:
- Accept all cookies
- Reject non-essential cookies
- Customize your preferences
- Change your preferences at any time

**Account Settings:**
You can also manage certain cookie preferences through your Easy11 account settings:
- Marketing preferences
- Analytics opt-out
- Personalization settings

**Important Note:**
Disabling certain cookies may impact your experience on our website. Essential cookies cannot be disabled as they are necessary for the website to function.`,
    },
    {
      id: 'do-not-track',
      title: 'Do Not Track Signals',
      content: `Some browsers include a "Do Not Track" (DNT) feature that signals to websites you visit that you do not want to have your online activity tracked. Currently, there is no standard for how DNT signals should be interpreted.

Easy11 does not currently respond to DNT signals. However, you can still control cookies through your browser settings and our cookie consent banner. We respect your privacy choices and provide tools to manage your cookie preferences.`,
    },
    {
      id: 'local-storage',
      title: 'Local Storage and Similar Technologies',
      content: `In addition to cookies, we may use other similar technologies such as:

**Local Storage:**
- Stores data locally in your browser
- Persists even after you close the browser
- Used for preferences and settings

**Session Storage:**
- Stores data for a single session
- Deleted when you close the browser
- Used for temporary data

**Web Beacons:**
- Small transparent images
- Used to track email opens and page views
- Help measure campaign effectiveness

**Pixel Tags:**
- Similar to web beacons
- Embedded in web pages or emails
- Track user interactions

These technologies work similarly to cookies and are subject to the same privacy considerations. You can manage them through your browser settings.`,
    },
    {
      id: 'updates',
      title: 'Updates to This Cookie Policy',
      content: `We may update this Cookie Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of any material changes by:

- Posting the updated Cookie Policy on this page
- Updating the "Last Updated" date
- Displaying a notice on our website
- Sending an email notification (for significant changes)

We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies. Your continued use of our website after changes become effective constitutes your acceptance of the updated Cookie Policy.`,
    },
    {
      id: 'contact',
      title: 'Contact Us',
      content: `If you have any questions about our use of cookies or this Cookie Policy, please contact us:

**Email:** privacy@easy11.com
**Phone:** 1-800-EASY-11
**Address:** 123 Commerce Street, San Francisco, CA 94105, United States

For cookie-related inquiries, you can also use our contact form or visit our support center.`,
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
            <Cookie className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Cookie Policy
            </h1>
            <p className="text-blue-100 text-lg">
              Learn about how we use cookies and how you can manage your preferences.
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
        {/* Cookie Types Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8 text-center">
            Types of Cookies We Use
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cookieTypes.map((type, index) => (
              <motion.div
                key={type.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {type.category === 'Essential Cookies' && (
                      <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    )}
                    {type.category === 'Analytics Cookies' && (
                      <BarChart className="w-6 h-6 text-green-600 dark:text-green-400" />
                    )}
                    {type.category === 'Functional Cookies' && (
                      <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    )}
                    {type.category === 'Marketing Cookies' && (
                      <Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    )}
                    <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                      {type.category}
                    </h3>
                  </div>
                  {type.required && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {type.description}
                </p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm">
                    <strong className="text-gray-900 dark:text-white">Purpose:</strong>{' '}
                    <span className="text-gray-600 dark:text-gray-400">{type.purpose}</span>
                  </p>
                  <p className="text-sm">
                    <strong className="text-gray-900 dark:text-white">Retention:</strong>{' '}
                    <span className="text-gray-600 dark:text-gray-400">{type.retention}</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Examples:
                  </p>
                  <ul className="space-y-1">
                    {type.examples.map((example, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Cookie className="w-5 h-5" />
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

        {/* Cookie Policy Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Cookie className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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

        {/* Cookie Management CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                  Manage Your Cookie Preferences
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  You can update your cookie preferences at any time through your browser settings or our cookie consent banner.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    <Settings className="w-5 h-5 mr-2" />
                    Update Cookie Preferences
                  </button>
                  <a
                    href="/account/privacy"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Privacy Settings
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

