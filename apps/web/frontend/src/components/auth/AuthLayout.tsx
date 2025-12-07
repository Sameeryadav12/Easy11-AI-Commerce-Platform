import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Sparkles, CheckCircle, Zap } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const benefits = [
    {
      icon: Shield,
      title: 'Secure & Encrypted',
      description: 'Your data is protected with enterprise-grade security',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Shopping',
      description: 'Personalized recommendations just for you',
    },
    {
      icon: Zap,
      title: 'Fast & Easy',
      description: 'Quick checkout with saved preferences',
    },
    {
      icon: CheckCircle,
      title: 'Trusted by Thousands',
      description: 'Join our growing community of happy shoppers',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Trust & Benefits (Desktop) */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-navy via-blue-600 to-teal-500 p-12 flex-col justify-between text-white">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-heading font-bold text-2xl">E</span>
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold">Easy11</h1>
              <p className="text-sm text-white/80">AI-Powered Commerce</p>
            </div>
          </Link>

          {/* Main Content */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-heading font-bold mb-6 leading-tight"
            >
              Shop Smarter with AI-Powered Intelligence
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-white/90 mb-12"
            >
              Join thousands of customers who trust Easy11 for personalized shopping experiences.
            </motion.p>

            {/* Benefits */}
            <div className="space-y-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                      <p className="text-white/80 text-sm">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="text-white/60 text-sm">
            <p>© 2025 Easy11. All rights reserved.</p>
            <div className="flex space-x-4 mt-2">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/support" className="hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <Link
              to="/"
              className="lg:hidden flex items-center justify-center space-x-3 mb-8"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-heading font-bold text-2xl">E</span>
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                  Easy11
                </h1>
              </div>
            </Link>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
            >
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
                )}
              </div>

              {/* Form Content */}
              {children}
            </motion.div>

            {/* Mobile Benefits (Optional) */}
            <div className="lg:hidden mt-6 space-y-3">
              {benefits.slice(0, 2).map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <Icon className="w-5 h-5 text-blue-500" />
                    <span>{benefit.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

