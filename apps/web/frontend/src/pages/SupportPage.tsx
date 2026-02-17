import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText, 
  Search, 
  BookOpen,
  Clock,
  Shield,
  Zap,
  Package,
  RefreshCw,
  CreditCard,
  Eye,
  Calendar,
  ChevronRight,
  Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';

/** Help article shape – shared for search and category pages */
export type HelpArticle = {
  title: string;
  category: string;
  categorySlug: string;
  views: string;
  link: string;
  preview: string;
  lastUpdated: string;
};

/** Quick help topic with article count */
export type HelpTopic = {
  title: string;
  description: string;
  icon: any;
  link: string;
  categorySlug: string;
  articleCount: number;
  color: string;
};

/** Shared help articles data */
export const HELP_ARTICLES: HelpArticle[] = [
  { title: 'How to Track Your Order', category: 'Shipping', categorySlug: 'shipping', views: '12.5k', link: '/track-order?from=support', preview: 'Enter your order number to see real-time delivery status and estimated arrival.', lastUpdated: 'Jan 2025' },
  { title: 'Return Policy & Process', category: 'Returns', categorySlug: 'returns', views: '8.2k', link: '/shipping?from=support', preview: 'Learn how to start a return and when to expect your refund.', lastUpdated: 'Jan 2025' },
  { title: 'Creating an Account', category: 'Account', categorySlug: 'account', views: '15.3k', link: '/auth/register', preview: 'Sign up to track orders, manage addresses, and get personalized recommendations.', lastUpdated: 'Dec 2024' },
  { title: 'Payment Methods Accepted', category: 'Payment', categorySlug: 'payments', views: '6.7k', link: '/faq?from=support', preview: 'We accept credit cards, PayPal, Apple Pay, and more.', lastUpdated: 'Jan 2025' },
  { title: 'Password Reset Guide', category: 'Security', categorySlug: 'account', views: '9.1k', link: '/auth/forgot-password', preview: 'Recover access to your account with our secure password reset flow.', lastUpdated: 'Jan 2025' },
  { title: 'Shipping Options & Costs', category: 'Shipping', categorySlug: 'shipping', views: '11.4k', link: '/shipping?from=support', preview: 'Standard, express, and overnight shipping options explained.', lastUpdated: 'Jan 2025' },
  { title: 'Wrong Item Received?', category: 'Returns', categorySlug: 'returns', views: '5.2k', link: '/contact?from=support&type=wrong-item', preview: 'Steps to request a replacement or refund if you received the wrong product.', lastUpdated: 'Jan 2025' },
  { title: 'Refund Timeline', category: 'Returns', categorySlug: 'returns', views: '4.1k', link: '/contact?from=support&type=refund-delay', preview: 'How long refunds take and what to do if yours is delayed.', lastUpdated: 'Dec 2024' },
  { title: 'Delivery Issues', category: 'Shipping', categorySlug: 'shipping', views: '3.8k', link: '/contact?from=support&type=delivery-issue', preview: 'Report missing, late, or damaged deliveries.', lastUpdated: 'Jan 2025' },
  { title: 'Product Specifications', category: 'Products', categorySlug: 'products', views: '4.2k', link: '/products', preview: 'Find product details, specs, and availability on product pages.', lastUpdated: 'Jan 2025' },
  { title: 'Website Not Loading', category: 'Technical', categorySlug: 'technical', views: '2.1k', link: '/contact?from=support&type=technical', preview: 'Troubleshoot slow loading or error pages.', lastUpdated: 'Dec 2024' },
];

/** Article count per category for Quick Help Topics */
const ARTICLE_COUNTS: Record<string, number> = {
  shipping: HELP_ARTICLES.filter((a) => a.categorySlug === 'shipping').length + 2,
  returns: HELP_ARTICLES.filter((a) => a.categorySlug === 'returns').length + 1,
  account: HELP_ARTICLES.filter((a) => a.categorySlug === 'account').length + 3,
  payments: 4,
  products: 5,
  technical: 6,
};

/**
 * Support Center Page
 * 
 * Central hub for customer support resources and contact options.
 * Features:
 * - Search bar with live suggestions
 * - Quick help topics (clickable category pages)
 * - Support channels
 * - Help articles
 * - Track order shortcut
 * - Report a problem
 * - Legal (privacy, data request, account deletion)
 */
export default function SupportPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { articles: [], topics: [] };
    const articles = HELP_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.preview.toLowerCase().includes(q)
    ).slice(0, 5);
    return { articles, topics: [] };
  }, [searchQuery]);

  const quickHelpTopics: HelpTopic[] = [
    { title: 'Orders & Shipping', description: 'Track orders, shipping options, delivery times', icon: Package, link: '/support/category/shipping', categorySlug: 'shipping', articleCount: ARTICLE_COUNTS.shipping, color: 'blue' },
    { title: 'Returns & Refunds', description: 'Return policy, refund process, exchanges', icon: RefreshCw, link: '/support/category/returns', categorySlug: 'returns', articleCount: ARTICLE_COUNTS.returns, color: 'green' },
    { title: 'Account & Security', description: 'Password reset, account settings, security', icon: Shield, link: '/support/category/account', categorySlug: 'account', articleCount: ARTICLE_COUNTS.account, color: 'purple' },
    { title: 'Payment & Billing', description: 'Payment methods, billing questions, invoices', icon: CreditCard, link: '/support/category/payments', categorySlug: 'payments', articleCount: ARTICLE_COUNTS.payments, color: 'amber' },
    { title: 'Product Questions', description: 'Product details, specifications, availability', icon: Search, link: '/support/category/products', categorySlug: 'products', articleCount: ARTICLE_COUNTS.products, color: 'pink' },
    { title: 'Technical Support', description: 'Website issues, app problems, troubleshooting', icon: Zap, link: '/support/category/technical', categorySlug: 'technical', articleCount: ARTICLE_COUNTS.technical, color: 'indigo' },
  ];

  const supportChannels = [
    { title: 'Live Chat', description: 'Chat with our support team in real-time', icon: MessageSquare, availability: 'Chat available during business hours', action: 'Start Chat', color: 'blue', available: true },
    { title: 'Email Support', description: 'Submit a ticket and get a tracking ID. We respond within 24 hours.', icon: Mail, availability: 'Ticket ID + confirmation email', action: 'Submit Ticket', color: 'green', available: true },
    { title: 'Phone Support', description: 'Speak directly with our support team', icon: Phone, availability: 'Mon-Fri, 9am-6pm EST · Avg wait ~3 min · English & Spanish', action: 'Call Now', color: 'purple', available: true },
    { title: 'Help Center', description: 'Browse our comprehensive knowledge base', icon: BookOpen, availability: 'Available 24/7', action: 'Browse Articles', color: 'amber', available: true },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/faq?from=support&q=${encodeURIComponent(searchQuery.trim())}`);
  };

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

      {/* Search Bar - under hero */}
      <div className="container-custom -mt-6 relative z-10">
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onSubmit={handleSearchSubmit}
          className="relative max-w-2xl mx-auto"
        >
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Search help topics…"
              className="w-full pl-12 pr-4 py-4 text-gray-900 dark:text-white bg-transparent focus:outline-none focus:ring-0 placeholder-gray-500"
              aria-label="Search help topics"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
          <AnimatePresence>
            {searchFocused && searchQuery.trim() && searchSuggestions.articles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {searchSuggestions.articles.map((a) => (
                  <Link
                    key={a.title}
                    to={a.link}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{a.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{a.category}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>

      <div className="container-custom py-12">
        {/* Track Order Shortcut */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-16"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
            <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              Track your order instantly
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = (e.currentTarget.querySelector('input[name="orderNumber"]') as HTMLInputElement)?.value?.trim();
                if (input) navigate(`/track-order?from=support&order=${encodeURIComponent(input)}`);
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                name="orderNumber"
                placeholder="Enter order number (e.g. E11-12345678)"
                className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                aria-label="Order number"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Track
              </button>
            </form>
          </div>
        </motion.section>

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
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {topic.description}
                      </p>
                      <span className="text-sm text-gray-500 dark:text-gray-500">{topic.articleCount} articles</span>
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
                      <Link to="/contact?from=support" className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center">
                        {channel.action}
                      </Link>
                    ) : channel.title === 'Email Support' ? (
                      <Link
                        to="/contact?from=support"
                        className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                      >
                        {channel.action}
                      </Link>
                    ) : channel.title === 'Phone Support' ? (
                      <a
                        href="tel:+1800327911"
                        className="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center"
                      >
                        {channel.action}
                      </a>
                    ) : (
                      <Link
                        to="/faq?from=support"
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

        {/* Report a Problem */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Report a Problem
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Quick one-click support for common issues:</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contact?from=support&type=wrong-item"
              className="inline-flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all"
            >
              <Package className="w-5 h-5 text-amber-500" />
              <span className="font-medium text-gray-900 dark:text-white">Wrong item received</span>
            </Link>
            <Link
              to="/contact?from=support&type=refund-delay"
              className="inline-flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all"
            >
              <RefreshCw className="w-5 h-5 text-green-500" />
              <span className="font-medium text-gray-900 dark:text-white">Refund delayed</span>
            </Link>
            <Link
              to="/contact?from=support&type=delivery-issue"
              className="inline-flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all"
            >
              <Truck className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-gray-900 dark:text-white">Delivery issue</span>
            </Link>
          </div>
        </motion.section>

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
              {HELP_ARTICLES.slice(0, 6).map((article) => (
                <Link
                  key={article.title}
                  to={article.link}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">{article.preview}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                        <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">{article.category}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {article.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Updated {article.lastUpdated}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/faq?from=support"
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
            <div className="flex flex-col items-center mb-8">
              <Link
                to="/contact?from=support"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                <MessageSquare className="w-6 h-6" />
                Start Live Chat
              </Link>
              <p className="text-blue-100 mt-2 text-sm">Fastest way to get help · During business hours</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
              <div>
                <Mail className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <Link to="/contact?from=support" className="text-blue-100 hover:text-white underline">
                  support@easy11.com
                </Link>
                <p className="text-sm text-blue-100 mt-1">Submit ticket · Get tracking ID</p>
              </div>
              <div>
                <Phone className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <a href="tel:+1800327911" className="text-blue-100 hover:text-white underline">
                  1-800-EASY-11
                </a>
                <p className="text-sm text-blue-100 mt-1">Mon-Fri, 9am-6pm EST</p>
              </div>
              <div>
                <MessageSquare className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Contact Form</h3>
                <Link to="/contact?from=support" className="text-blue-100 hover:text-white underline">
                  Open form
                </Link>
                <p className="text-sm text-blue-100 mt-1">Response within 24 hours</p>
              </div>
            </div>

            {/* Legal: Privacy, Data Request, Account Deletion */}
            <div className="mt-10 pt-6 border-t border-blue-500/40">
              <h3 className="text-sm font-semibold text-blue-100 mb-3 text-center">Privacy & Your Rights</h3>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
                <Link to="/privacy?section=rights" className="text-blue-100 hover:text-white underline">
                  Privacy Rights
                </Link>
                <Link to="/contact?from=support&topic=data-request" className="text-blue-100 hover:text-white underline">
                  Data Request
                </Link>
                <Link to="/account/privacy" className="text-blue-100 hover:text-white underline">
                  Account Deletion
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

