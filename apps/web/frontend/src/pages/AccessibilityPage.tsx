import { motion } from 'framer-motion';
import { 
  Accessibility, 
  Eye, 
  Ear, 
  MousePointerClick, 
  Keyboard, 
  Monitor, 
  CheckCircle,
  AlertCircle,
  Info,
  Settings,
  HelpCircle
} from 'lucide-react';

/**
 * Accessibility Page
 * 
 * Comprehensive accessibility statement explaining Easy11's commitment
 * to accessibility, WCAG compliance, and available features for users
 * with disabilities.
 */
export default function AccessibilityPage() {
  const lastUpdated = 'January 15, 2025';
  const lastAuditDate = 'January 2025';

  const features = [
    {
      title: 'Keyboard Navigation',
      description: 'Full website functionality accessible via keyboard. Tab through all interactive elements, use Enter/Space to activate, and Escape to close modals.',
      icon: Keyboard,
      color: 'blue',
    },
    {
      title: 'Screen Reader Support',
      description: 'Designed to support screen readers including JAWS, NVDA, VoiceOver, and TalkBack. Proper ARIA labels and semantic HTML throughout.',
      icon: Ear,
      color: 'green',
    },
    {
      title: 'High Contrast Mode',
      description: 'Dark mode and high contrast options available. Adjustable text size and color contrast ratios meet WCAG AA standards.',
      icon: Eye,
      color: 'purple',
    },
    {
      title: 'Alternative Text',
      description: 'All images include descriptive alt text. Decorative images are marked appropriately to be ignored by assistive technologies.',
      icon: Monitor,
      color: 'amber',
    },
    {
      title: 'Focus Indicators',
      description: 'Clear visual focus indicators on all interactive elements. Keyboard focus is always visible and follows logical tab order.',
      icon: MousePointerClick,
      color: 'pink',
    },
    {
      title: 'Text Alternatives',
      description: 'Video content includes captions. Audio content includes transcripts. All multimedia has text alternatives available.',
      icon: Accessibility,
      color: 'indigo',
    },
  ];

  const standards = [
    {
      level: 'WCAG 2.1 Level AA',
      status: 'Striving',
      description: 'We strive to meet WCAG 2.1 Level AA standards across all pages and features. We conduct regular audits and address issues as identified.',
      icon: CheckCircle,
    },
    {
      level: 'Section 508',
      status: 'Striving',
      description: 'We strive to meet Section 508 of the Rehabilitation Act requirements for federal accessibility.',
      icon: CheckCircle,
    },
    {
      level: 'ADA Compliance',
      status: 'Ongoing',
      description: 'We are committed to ensuring our website is accessible to individuals with disabilities under the ADA.',
      icon: CheckCircle,
    },
  ];

  const sections = [
    {
      id: 'commitment',
      title: 'Our Commitment to Accessibility',
      content: `Easy11 is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to achieve these goals.

We believe that the internet should be available and accessible to everyone, and we are committed to providing a website that is accessible to the widest possible audience, regardless of technology or ability.

Our goal is to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards, which explain how to make web content more accessible for people with disabilities.`,
    },
    {
      id: 'features',
      title: 'Accessibility Features',
      content: `We have implemented various accessibility features to make Easy11 more accessible:

**Navigation:**
- Skip to main content links
- Consistent navigation structure
- Breadcrumb navigation
- Clear page titles and headings

**Content:**
- Descriptive link text
- Proper heading hierarchy
- Sufficient color contrast
- Resizable text (up to 200% without loss of functionality)

**Forms:**
- Clear labels and instructions
- Error messages that identify the field and describe the error
- Required field indicators
- Keyboard-accessible form controls

**Multimedia:**
- Captions for video content
- Transcripts for audio content
- Alternative text for images
- No auto-playing media with sound`,
    },
    {
      id: 'assistive-technologies',
      title: 'Assistive Technologies',
      content: `Easy11 is designed to work with various assistive technologies:

**Screen Readers:**
- JAWS (Windows)
- NVDA (Windows)
- VoiceOver (macOS, iOS)
- TalkBack (Android)
- Narrator (Windows)

**Browser Accessibility Features:**
- Zoom and magnification tools
- High contrast modes
- Custom color schemes
- Font size adjustments

**Keyboard Navigation:**
- Full keyboard accessibility
- Logical tab order
- Keyboard shortcuts
- Focus management

**Voice Control:**
- Voice navigation support
- Voice command compatibility
- Speech recognition tools`,
    },
    {
      id: 'known-issues',
      title: 'Known Issues and Improvements',
      content: `We are aware that some parts of Easy11 may not be fully accessible. We are actively working to address these issues:

**Areas Under Improvement:**
- Some third-party widgets may not be fully accessible
- Certain interactive elements may need additional ARIA labels
- Some forms may require enhanced error messaging
- Video player controls may need keyboard improvements

**Our Process:**
- Regular accessibility audits
- User testing with assistive technologies
- Continuous monitoring and improvements
- Feedback integration from users

**Last Accessibility Audit:** ${lastAuditDate}

If you encounter any accessibility barriers, please contact us so we can address them.`,
    },
    {
      id: 'feedback',
      title: 'Feedback and Reporting Issues',
      content: `We welcome your feedback on the accessibility of Easy11. If you encounter accessibility barriers, please let us know:

**How to Report:**
- Email: accessibility@easy11.com
- Phone: 1-800-EASY-11 (ask for Accessibility Support)
- Contact Form: Use our general contact form and select "Accessibility" as the topic

**What to Include:**
- The URL of the page where you encountered the issue
- A description of the problem
- The assistive technology you were using
- Your contact information (if you'd like a response)

We aim to respond to accessibility feedback as quickly as possible.`,
    },
    {
      id: 'third-party',
      title: 'Third-Party Content',
      content: `Some content on Easy11 may be provided by third parties. While we strive to ensure all content is accessible, we cannot guarantee the accessibility of:

- Third-party widgets and plugins
- Embedded social media content
- External advertisements
- Partner website content

We work with our partners to encourage accessibility, but we cannot control all third-party content. If you encounter accessibility issues with third-party content, please report them to us, and we will work with the provider to address them.`,
    },
    {
      id: 'updates',
      title: 'Ongoing Improvements',
      content: `Accessibility is an ongoing effort. We regularly:

**Conduct Audits:**
- Automated accessibility testing
- Manual testing with assistive technologies
- User testing with people with disabilities
- Expert accessibility reviews

**Implement Improvements:**
- Fix identified issues promptly
- Update features for better accessibility
- Train our team on accessibility best practices
- Stay current with accessibility standards

**Monitor Compliance:**
- Track accessibility metrics
- Review user feedback
- Update our accessibility statement
- Report on progress

We are committed to continuous improvement and welcome your input to help us make Easy11 more accessible.`,
    },
    {
      id: 'contact',
      title: 'Contact Us',
      content: `If you have questions or concerns about accessibility on Easy11, please contact us:

**Accessibility Team:**
- Email: accessibility@easy11.com
- Phone: 1-800-EASY-11 (ask for Accessibility Support)
- Hours: Monday-Friday, 9am-6pm EST

**General Support:**
- Email: support@easy11.com
- Contact Form: /contact
- Support Center: /support

We are committed to providing accessible customer service and will work with you to ensure you can access our services.`,
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
            <Accessibility className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Accessibility Statement
            </h1>
            <p className="text-blue-100 text-lg">
              Easy11 is committed to making our website accessible to everyone.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-blue-100 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>We strive to meet WCAG 2.1 Level AA standards</span>
              </div>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>Last Updated: {lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Last tested: {lastAuditDate}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Compliance Standards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8 text-center">
            Compliance Standards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {standards.map((standard, index) => {
              const Icon = standard.icon;
              return (
                <motion.div
                  key={standard.level}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {standard.level}
                      </h3>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {standard.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {standard.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Accessibility Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8 text-center">
            Accessibility Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
                amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
                pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
                indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
              };
              const colors = colorClasses[feature.color as keyof typeof colorClasses] || colorClasses.blue;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className={`p-3 ${colors} rounded-lg w-fit mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
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

        {/* Accessibility Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Accessibility className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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

        {/* Help Section */}
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
                  Need Accessibility Assistance?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  If you encounter any accessibility barriers or need assistance using Easy11, we're here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:accessibility@easy11.com"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Contact Accessibility Team
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    General Support
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

