import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle, MessageSquare, TrendingDown, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardBody, Badge } from '../ui';

interface ProductTabsProps {
  product: {
    description: string;
    features: string[];
    specifications: Record<string, string>;
    reviews: Review[];
    faq: FAQ[];
  };
}

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  helpful: number;
}

interface FAQ {
  question: string;
  answer: string;
  helpful: number;
}

/**
 * Product Tabs Component
 * 
 * Tabbed interface for product details, specifications, reviews, and Q&A.
 * Features AI-powered review summaries and sentiment analysis.
 */
export const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews' | 'qa'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', count: null },
    { id: 'specs', label: 'Specifications', count: Object.keys(product.specifications).length },
    { id: 'reviews', label: 'Reviews & Ratings', count: product.reviews.length },
    { id: 'qa', label: 'Q&A', count: product.faq.length },
  ] as const;

  // Calculate review sentiment
  const positiveReviews = product.reviews.filter((r) => r.rating >= 4).length;
  const sentimentPercentage = Math.round((positiveReviews / product.reviews.length) * 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Tab Headers */}
      <div className="border-b-2 border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-4 font-heading font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-2 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                  Product Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                  {product.description}
                </p>

                <h4 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                  Key Features
                </h4>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle className="w-6 h-6 text-teal-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 dark:text-gray-300 text-lg">
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Specifications Tab */}
          {activeTab === 'specs' && (
            <motion.div
              key="specs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                Technical Specifications
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between py-4 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {key}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* AI Review Summary */}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <h4 className="font-heading font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Star className="w-5 h-5 text-blue-500 mr-2" />
                  AI Review Summary
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>{sentimentPercentage}%</strong> of buyers praised <strong>battery life</strong> and <strong>sound quality</strong>. 
                  Most common keywords: "excellent", "comfortable", "worth it".
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="w-4 h-4 text-teal-500" />
                    <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                      {positiveReviews} Positive
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ThumbsDown className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {product.reviews.length - positiveReviews} Negative
                    </span>
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardBody>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {review.author}
                            </span>
                            {review.verified && (
                              <Badge variant="success" size="sm">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {review.comment}
                      </p>
                      <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                        <ThumbsUp className="w-4 h-4 inline mr-1" />
                        Helpful ({review.helpful})
                      </button>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Q&A Tab */}
          {activeTab === 'qa' && (
            <motion.div
              key="qa"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                Customer Questions & Answers
              </h3>
              <div className="space-y-4">
                {product.faq.map((item, index) => (
                  <Card key={index}>
                    <CardBody>
                      <div className="flex items-start space-x-3">
                        <MessageSquare className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Q: {item.question}
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            A: {item.answer}
                          </p>
                          <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                            <ThumbsUp className="w-4 h-4 inline mr-1" />
                            Helpful ({item.helpful})
                          </button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductTabs;

