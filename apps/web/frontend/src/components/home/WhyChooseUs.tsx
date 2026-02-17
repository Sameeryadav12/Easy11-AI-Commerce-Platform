import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles, Shield, Zap, HeartHandshake, RefreshCw, Award } from 'lucide-react';
import { Card, CardBody } from '../ui';

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

/**
 * Why Choose Us Component
 * 
 * Highlights the key benefits and unique value propositions of Easy11.
 * Animates into view when scrolled to.
 */
export const WhyChooseUs: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const benefits: Benefit[] = [
    {
      icon: <Sparkles className="w-10 h-10" />,
      title: 'Recommendations for you',
      description: 'Picks based on your activity and tastes. Updated as you browse.',
      color: 'blue',
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: 'Secure payments',
      description: 'Encrypted checkout. Your data is protected.',
      color: 'teal',
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: 'Fast delivery',
      description: 'Tracked shipping. Same-day options in select areas.',
      color: 'sky',
    },
    {
      icon: <RefreshCw className="w-10 h-10" />,
      title: '30-day returns',
      description: 'Return any item within 30 days, no questions asked.',
      color: 'purple',
    },
    {
      icon: <HeartHandshake className="w-10 h-10" />,
      title: 'Support when you need it',
      description: 'Chat, email, or call. We’re here to help.',
      color: 'rose',
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: 'Quality we stand behind',
      description: 'Every product is vetted. We back what we sell.',
      color: 'amber',
    },
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900',
      text: 'text-blue-600 dark:text-blue-400',
    },
    teal: {
      bg: 'bg-teal-100 dark:bg-teal-900',
      text: 'text-teal-600 dark:text-teal-400',
    },
    sky: {
      bg: 'bg-sky-100 dark:bg-sky-900',
      text: 'text-sky-600 dark:text-sky-400',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900',
      text: 'text-purple-600 dark:text-purple-400',
    },
    rose: {
      bg: 'bg-rose-100 dark:bg-rose-900',
      text: 'text-rose-600 dark:text-rose-400',
    },
    amber: {
      bg: 'bg-amber-100 dark:bg-amber-900',
      text: 'text-amber-600 dark:text-amber-400',
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
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Why Shop with Easy11?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Reliable service, clear policies, and picks that fit you.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const colors = colorClasses[benefit.color as keyof typeof colorClasses];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-xl transition-shadow duration-300">
                  <CardBody>
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className={`w-20 h-20 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 ${colors.text}`}
                    >
                      {benefit.icon}
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                      {benefit.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '50K+', label: 'Happy Customers' },
            { value: '10K+', label: 'Products' },
            { value: '4.8/5', label: 'Average Rating' },
            { value: '99%', label: 'Satisfaction Rate' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

