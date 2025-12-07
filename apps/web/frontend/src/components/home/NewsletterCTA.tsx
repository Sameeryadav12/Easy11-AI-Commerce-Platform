import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Gift, Sparkles, Check } from 'lucide-react';
import { Button, Input } from '../ui';

/**
 * Newsletter CTA Component
 * 
 * Encourages users to subscribe to the newsletter with a rewards incentive.
 * Features email validation and success animation.
 */
export const NewsletterCTA: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      // TODO: Connect to backend API
      // await fetch('/api/v1/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => setIsSubscribed(false), 5000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
          className="w-full h-full"
        />
      </div>

      <div className="container-custom relative z-10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6"
          >
            <Gift className="w-10 h-10 text-white" />
          </motion.div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
            Join Easy11 Rewards
          </h2>
          
          {/* Subheadline */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Sparkles className="w-5 h-5 text-teal-300" />
            <p className="text-2xl text-blue-100 font-semibold">
              Get 10% Off Your First Order
            </p>
            <Sparkles className="w-5 h-5 text-teal-300" />
          </div>

          <p className="text-lg text-blue-100 mb-8">
            Plus exclusive deals, new arrivals, and AI-powered product recommendations delivered to your inbox
          </p>

          {/* Email Form */}
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white dark:bg-white text-gray-900 h-14"
                    leftIcon={<Mail className="w-5 h-5 text-gray-400" />}
                    error={error}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  isLoading={isSubmitting}
                  className="whitespace-nowrap h-14"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                </Button>
              </div>
              
              {/* Privacy Note */}
              <p className="text-sm text-blue-200 mt-4">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-white">
                    You're Subscribed!
                  </h3>
                </div>
                <p className="text-white/90">
                  Check your email for your exclusive 10% discount code!
                </p>
              </div>
            </motion.div>
          )}

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-white"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Gift className="w-6 h-6" />
              </div>
              <p className="font-semibold">Exclusive Deals</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="font-semibold">Early Access</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <p className="font-semibold">AI Recommendations</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterCTA;

