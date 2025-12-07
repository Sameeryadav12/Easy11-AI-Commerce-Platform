import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardBody } from '../ui';

interface Category {
  id: string;
  name: string;
  emoji: string;
  productCount: number;
  gradient: string;
  link: string;
}

/**
 * Featured Categories Component
 * 
 * Displays main product categories in a beautiful grid.
 * Lazy loads when scrolled into view for better performance.
 */
export const FeaturedCategories: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const categories: Category[] = [
    {
      id: 'electronics',
      name: 'Tech & Gadgets',
      emoji: '💻',
      productCount: 245,
      gradient: 'from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800',
      link: '/products?category=electronics',
    },
    {
      id: 'fashion',
      name: 'Fashion & Accessories',
      emoji: '👗',
      productCount: 512,
      gradient: 'from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800',
      link: '/products?category=clothing',
    },
    {
      id: 'home',
      name: 'Home & Lifestyle',
      emoji: '🏠',
      productCount: 328,
      gradient: 'from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800',
      link: '/products?category=home',
    },
    {
      id: 'fitness',
      name: 'Fitness & Wearables',
      emoji: '⌚',
      productCount: 189,
      gradient: 'from-teal-100 to-teal-200 dark:from-teal-900 dark:to-teal-800',
      link: '/products?category=fitness',
    },
    {
      id: 'beauty',
      name: 'Beauty & Personal Care',
      emoji: '💄',
      productCount: 421,
      gradient: 'from-rose-100 to-rose-200 dark:from-rose-900 dark:to-rose-800',
      link: '/products?category=beauty',
    },
    {
      id: 'sustainable',
      name: 'Sustainable Picks',
      emoji: '🌿',
      productCount: 156,
      gradient: 'from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800',
      link: '/products?category=sustainable',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="section" ref={ref}>
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Explore our curated collections
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link to={category.link}>
                <Card hover className="group cursor-pointer h-full overflow-hidden">
                  <CardBody className="p-0">
                    {/* Category Image/Emoji */}
                    <div
                      className={`aspect-video bg-gradient-to-br ${category.gradient} flex items-center justify-center relative overflow-hidden`}
                    >
                      <motion.span
                        className="text-8xl"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {category.emoji}
                      </motion.span>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>

                    {/* Category Info */}
                    <div className="p-6">
                      <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {category.productCount} products available
                      </p>
                      <div className="flex items-center text-blue-500 font-semibold group-hover:translate-x-2 transition-transform">
                        Shop Now
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCategories;

