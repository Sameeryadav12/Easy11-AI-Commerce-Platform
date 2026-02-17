import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle, ShoppingBag, CreditCard, Truck, Shield, User } from 'lucide-react';
import { Input } from '../components/ui';
import BreadcrumbBack from '../components/navigation/BreadcrumbBack';

/**
 * FAQ Page
 * 
 * Frequently Asked Questions page with searchable accordion-style Q&A.
 * Features:
 * - Search functionality
 * - Categorized questions
 * - Expandable answers
 * - Common e-commerce questions
 */
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'shipping' | 'orders' | 'payments' | 'account' | 'returns';
}

const VALID_FAQ_CATEGORIES = ['general', 'shipping', 'orders', 'payments', 'account', 'returns'] as const;

const faqData: FAQItem[] = [
  // General
  {
    id: '1',
    question: 'What is Easy11?',
    answer: 'Easy11 is an AI-powered e-commerce platform that provides personalized shopping experiences, intelligent product recommendations, and seamless commerce solutions for customers and vendors alike.',
    category: 'general',
  },
  {
    id: '2',
    question: 'How does AI personalization work?',
    answer: 'Our AI analyzes your browsing history, purchase patterns, and preferences to recommend products tailored specifically to you. The more you shop, the better our recommendations become.',
    category: 'general',
  },
  {
    id: '3',
    question: 'Is my data secure?',
    answer: 'Yes, we take data security seriously. We use industry-standard encryption, comply with GDPR and CCPA regulations, and never share your personal information with third parties without your consent.',
    category: 'general',
  },
  // Shipping
  {
    id: '4',
    question: 'What are your shipping options?',
    answer: 'We offer standard shipping (5-7 business days), express shipping (2-3 business days), and overnight shipping (next business day). Shipping costs vary based on the option selected and your location.',
    category: 'shipping',
  },
  {
    id: '5',
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to most countries worldwide. International shipping times vary by destination (typically 7-14 business days). Additional customs fees may apply depending on your country.',
    category: 'shipping',
  },
  {
    id: '6',
    question: 'How can I track my order?',
    answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order by logging into your account and visiting the "Orders" section.',
    category: 'shipping',
  },
  // Orders
  {
    id: '7',
    question: 'How long does it take to process an order?',
    answer: 'Most orders are processed within 1-2 business days. During peak seasons or sales, processing may take up to 3 business days. You\'ll receive an email confirmation once your order is processed.',
    category: 'orders',
  },
  {
    id: '8',
    question: 'Can I modify or cancel my order?',
    answer: 'You can modify or cancel your order within 1 hour of placing it by contacting our support team. After that, your order may already be in processing and cannot be changed.',
    category: 'orders',
  },
  {
    id: '9',
    question: 'What if I receive the wrong item?',
    answer: 'If you receive the wrong item, please contact our support team immediately. We\'ll arrange for a return and send you the correct item at no additional cost.',
    category: 'orders',
  },
  // Payments
  {
    id: '10',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers for larger orders.',
    category: 'payments',
  },
  {
    id: '11',
    question: 'Is my payment information secure?',
    answer: 'Yes, all payment information is encrypted and processed through secure payment gateways. We never store your full credit card details on our servers.',
    category: 'payments',
  },
  {
    id: '12',
    question: 'Do you offer payment plans?',
    answer: 'Yes, we offer "Buy Now, Pay Later" options through our partners for eligible purchases. You can select this option at checkout.',
    category: 'payments',
  },
  // Account
  {
    id: '13',
    question: 'How do I create an account?',
    answer: 'Click the "Sign Up" button in the top right corner, fill in your information, verify your email, and you\'re all set! Creating an account gives you access to order tracking, wishlists, and personalized recommendations.',
    category: 'account',
  },
  {
    id: '14',
    question: 'I forgot my password. How do I reset it?',
    answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a secure link to reset your password.',
    category: 'account',
  },
  {
    id: '15',
    question: 'How do I update my account information?',
    answer: 'Log into your account, go to "Account Settings," and you can update your personal information, shipping addresses, payment methods, and preferences.',
    category: 'account',
  },
  // Returns
  {
    id: '16',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy on most items. Items must be unused, in original packaging, and with tags attached. Some items (like personalized products) may not be eligible for return.',
    category: 'returns',
  },
  {
    id: '17',
    question: 'How do I return an item?',
    answer: 'Log into your account, go to "Orders," select the item you want to return, and click "Return Item." We\'ll provide you with a return label and instructions.',
    category: 'returns',
  },
  {
    id: '18',
    question: 'How long does it take to process a refund?',
    answer: 'Once we receive your returned item, we\'ll process your refund within 5-7 business days. The refund will be issued to your original payment method and may take additional time to appear in your account.',
    category: 'returns',
  },
];

const categories = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'general', label: 'General', icon: HelpCircle },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'account', label: 'Account', icon: User },
  { id: 'returns', label: 'Returns', icon: Shield },
];

export default function FAQPage() {
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get('from');
  const qParam = searchParams.get('q') || '';
  const fromSupport = fromParam === 'support' || fromParam === 'account-support';
  const supportBackUrl = fromParam === 'account-support' ? '/account/support' : '/support';

  const [searchQuery, setSearchQuery] = useState(qParam);
  const categoryParam = searchParams.get('category');
  const initialCategory =
    categoryParam && VALID_FAQ_CATEGORIES.includes(categoryParam as (typeof VALID_FAQ_CATEGORIES)[number])
      ? categoryParam
      : 'all';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (categoryParam && VALID_FAQ_CATEGORIES.includes(categoryParam as (typeof VALID_FAQ_CATEGORIES)[number])) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    if (qParam) setSearchQuery(qParam);
  }, [qParam]);

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFAQs = faqData.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {fromSupport && (
        <div className="container-custom pt-4 pb-0">
          <BreadcrumbBack
            parentLabel="Support"
            parentUrl={supportBackUrl}
            currentPage="FAQ"
          />
        </div>
      )}
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-blue-100 text-lg">
              Find answers to common questions about shopping, shipping, returns, and more.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
              className="w-full"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence>
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((item, index) => {
                const isOpen = openItems.has(item.id);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white pr-4">
                        {item.question}
                      </h3>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform ${
                          isOpen ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No questions found matching your search. Try different keywords or{' '}
                  <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                    contact us
                  </a>{' '}
                  for assistance.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Still Need Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-4xl mx-auto mt-12 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
        >
          <div className="text-center">
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
              Still have questions?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="mailto:support@easy11.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Email Support
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

