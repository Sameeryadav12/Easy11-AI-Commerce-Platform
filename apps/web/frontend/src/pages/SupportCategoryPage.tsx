import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  RefreshCw,
  Shield,
  CreditCard,
  Search,
  Zap,
  FileText,
  ChevronRight,
  Eye,
  Calendar,
} from 'lucide-react';
import { HELP_ARTICLES } from './SupportPage';

const CATEGORY_CONFIG: Record<string, { title: string; icon: any; description: string }> = {
  shipping: {
    title: 'Orders & Shipping',
    icon: Package,
    description: 'Track orders, shipping options, delivery times, and delivery issues.',
  },
  returns: {
    title: 'Returns & Refunds',
    icon: RefreshCw,
    description: 'Return policy, refund process, and exchanges.',
  },
  account: {
    title: 'Account & Security',
    icon: Shield,
    description: 'Password reset, account settings, and security.',
  },
  payments: {
    title: 'Payment & Billing',
    icon: CreditCard,
    description: 'Payment methods, billing questions, and invoices.',
  },
  products: {
    title: 'Product Questions',
    icon: Search,
    description: 'Product details, specifications, and availability.',
  },
  technical: {
    title: 'Technical Support',
    icon: Zap,
    description: 'Website issues, app problems, and troubleshooting.',
  },
};

export default function SupportCategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? CATEGORY_CONFIG[slug] : null;
  const articles = slug ? HELP_ARTICLES.filter((a) => a.categorySlug === slug) : [];

  if (!slug || !config) {
    return (
      <div className="container-custom py-12">
        <p className="text-gray-600 dark:text-gray-400">Category not found.</p>
        <Link to="/support" className="text-blue-600 dark:text-blue-400 mt-4 inline-block">
          ← Back to Support Center
        </Link>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className="container-custom py-12">
      <Link
        to="/support"
        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        ← Back to Support Center
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              {config.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{config.description}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {articles.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {articles.map((article, i) => (
                <li key={article.title}>
                  <Link
                    to={article.link}
                    className="flex items-center gap-4 p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                  >
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0">
                      <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                        {article.preview}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
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
                    <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p>No articles in this category yet.</p>
              <Link to="/faq?from=support" className="text-blue-600 dark:text-blue-400 mt-2 inline-block">
                Browse FAQ →
              </Link>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            to="/faq?from=support"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all FAQ articles
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact?from=support"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Contact Support
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
