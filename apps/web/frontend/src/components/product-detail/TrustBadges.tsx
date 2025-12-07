import { motion } from 'framer-motion';
import { Truck, Shield, RotateCcw, Leaf, Award, Star } from 'lucide-react';

/**
 * Trust Badges Component
 * 
 * Displays trust indicators and guarantees.
 * Builds confidence before product details.
 */
export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Free 2-Day Delivery',
      subtitle: 'On orders over $50',
      color: 'blue',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Checkout',
      subtitle: 'SSL encrypted',
      color: 'teal',
    },
    {
      icon: <RotateCcw className="w-6 h-6" />,
      title: '30-Day Returns',
      subtitle: 'Hassle-free',
      color: 'sky',
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: 'Eco-Friendly',
      subtitle: 'Sustainable packaging',
      color: 'green',
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: '2-Year Warranty',
      subtitle: 'Full coverage',
      color: 'purple',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: '4.8/5 Rating',
      subtitle: '10K+ reviews',
      color: 'yellow',
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    teal: 'from-teal-500 to-teal-600',
    sky: 'from-sky-500 to-sky-600',
    green: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-amber-500 to-amber-600',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 py-8">
      {badges.map((badge, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all cursor-default"
        >
          <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses[badge.color]} rounded-xl flex items-center justify-center text-white mb-3`}>
            {badge.icon}
          </div>
          <h4 className="font-heading font-semibold text-sm text-gray-900 dark:text-white mb-1">
            {badge.title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {badge.subtitle}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default TrustBadges;

