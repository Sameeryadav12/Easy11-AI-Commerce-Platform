import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText, 
  Search, 
  BookOpen,
  Clock,
  Users,
  Shield,
  Zap,
  Package,
  RefreshCw,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Support Center Page
 * 
 * Central hub for customer support resources and contact options.
 * Features:
 * - Quick help topics
 * - Support channels
 * - Help articles
 * - Contact options
 * - Live chat availability
 */
export default function SupportPage() {
  const quickHelpTopics = [
    {
      title: 'Orders & Shipping',
      description: 'Track orders, shipping options, delivery times',
      icon: Package,
      link: '/shipping',
      color: 'blue',
    },
    {
      title: 'Returns & Refunds',
      description: 'Return policy, refund process, exchanges',
      icon: RefreshCw,
      link: '/shipping',
      color: 'green',
    },
    {
      title: 'Account & Security',
      description: 'Password reset, account settings, security',
      icon: Shield,
      link: '/account/security',
      color: 'purple',
    },
    {
      title: 'Payment & Billing',
      description: 'Payment methods, billing questions, invoices',
      icon: CreditCard,
      link: '/account/payments',
      color: 'amber',
    },
    {
      title: 'Product Questions',
      description: 'Product details, specifications, availability',
      icon: Search,
      link: '/products',
      color: 'pink',
    },
    {
      title: 'Technical Support',
      description: 'Website issues, app problems, troubleshooting',
      icon: Zap,
      link: '/contact',
      color: 'indigo',
    },
  ];

  const supportChannels = [
    {
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: MessageSquare,
      availability: 'Available 24/7',
      action: 'Start Chat',
      color: 'blue',
      available: true,
    },
    {
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      icon: Mail,
      availability: 'Response within 24 hours',
      action: 'Send Email',
      color: 'green',
      available: true,
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our support team',
      icon: Phone,
      availability: 'Mon-Fri, 9am-6pm EST',
      action: 'Call Now',
      color: 'purple',
      available: true,
    },
    {
      title: 'Help Center',
      description: 'Browse our comprehensive knowledge base',
      icon: BookOpen,
      availability: 'Available 24/7',
      action: 'Browse Articles',
      color: 'amber',
      available: true,
    },
  ];

  const helpArticles = [
    {
      title: 'How to Track Your Order',
      category: 'Shipping',
      views: '12.5k',
      link: '/track-order',
    },
    {
      title: 'Return Policy & Process',
      category: 'Returns',
      views: '8.2k',
      link: '/shipping',
    },
    {
      title: 'Creating an Account',
      category: 'Account',
      views: '15.3k',
      link: '/auth/register',
    },
    {
      title: 'Payment Methods Accepted',
      category: 'Payment',
      views: '6.7k',
      link: '/faq',
    },
    {
      title: 'Password Reset Guide',
      category: 'Security',
      views: '9.1k',
      link: '/auth/forgot-password',
    },
    {
      title: 'Shipping Options & Costs',
      category: 'Shipping',
      views: '11.4k',
      link: '/shipping',
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
            <HelpCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Support Center
            </h1>
            <p className="text-blue-100 text-lg">
              We're here to help! Find answers, get support, or contact our team.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Quick Help Topics */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8 text-center">
              Quick Help Topics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickHelpTopics.map((topic, index) => {
                const Icon = topic.icon;
                const colorClasses = {
                  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                  green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
                  amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
                  pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
                  indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
                };
                const colors = colorClasses[topic.color as keyof typeof colorClasses] || colorClasses.blue;
                return (
                  <motion.div
                    key={topic.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <Link
                      to={topic.link}
                      className="block bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group"
                    >
                      <div className={`p-3 ${colors} rounded-lg w-fit mb-4`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {topic.description}
                      </p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Support Channels */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8 text-center">
              Get in Touch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportChannels.map((channel, index) => {
                const Icon = channel.icon;
                const colorClasses = {
                  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                  green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
                  amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
                };
                const colors = colorClasses[channel.color as keyof typeof colorClasses] || colorClasses.blue;
                return (
                  <motion.div
                    key={channel.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className={`p-3 ${colors} rounded-lg w-fit mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                      {channel.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      {channel.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <Clock className="w-4 h-4" />
                      {channel.availability}
                    </div>
                    {channel.title === 'Live Chat' ? (
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        {channel.action}
                      </button>
                    ) : channel.title === 'Email Support' ? (
                      <a
                        href="mailto:support@easy11.com"
                        className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                      >
                        {channel.action}
                      </a>
                    ) : channel.title === 'Phone Support' ? (
                      <a
                        href="tel:+1800327911"
                        className="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center"
                      >
                        {channel.action}
                      </a>
                    ) : (
                      <Link
                        to="/faq"
                        className="block w-full px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors text-center"
                      >
                        {channel.action}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Popular Help Articles */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                Popular Help Articles
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {helpArticles.map((article) => (
                <Link
                  key={article.title}
                  to={article.link}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {article.views} views
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                View All Articles
                <FileText className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Contact Information */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-xl"
          >
            <h2 className="text-3xl font-heading font-bold mb-6 text-center">
              Still Need Help?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <a
                  href="mailto:support@easy11.com"
                  className="text-blue-100 hover:text-white underline"
                >
                  support@easy11.com
                </a>
                <p className="text-sm text-blue-100 mt-1">Response within 24 hours</p>
              </div>
              <div className="text-center">
                <Phone className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <a
                  href="tel:+1800327911"
                  className="text-blue-100 hover:text-white underline"
                >
                  1-800-EASY-11
                </a>
                <p className="text-sm text-blue-100 mt-1">Mon-Fri, 9am-6pm EST</p>
              </div>
              <div className="text-center">
                <MessageSquare className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <button className="text-blue-100 hover:text-white underline">
                  Start Chat
                </button>
                <p className="text-sm text-blue-100 mt-1">Available 24/7</p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Form
                <MessageSquare className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

