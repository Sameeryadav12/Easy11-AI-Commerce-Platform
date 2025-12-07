import { motion } from 'framer-motion';
import { 
  Target, 
  Zap, 
  Shield, 
  Heart, 
  Users, 
  Award, 
  TrendingUp,
  Globe,
  Lightbulb,
  Rocket
} from 'lucide-react';

/**
 * About Us Page
 * 
 * Tells the story of Easy11, our mission, values, and vision.
 * Features:
 * - Company story
 * - Mission and values
 * - Key features
 * - Team highlights
 * - Milestones
 */
export default function AboutPage() {
  const values = [
    {
      title: 'Innovation',
      description: 'We leverage cutting-edge AI and technology to create the best shopping experience.',
      icon: Lightbulb,
      color: 'blue',
    },
    {
      title: 'Customer First',
      description: 'Every decision we make is centered around our customers\' needs and satisfaction.',
      icon: Heart,
      color: 'pink',
    },
    {
      title: 'Trust & Security',
      description: 'Your data and privacy are protected with enterprise-grade security measures.',
      icon: Shield,
      color: 'green',
    },
    {
      title: 'Sustainability',
      description: 'We\'re committed to ethical commerce and environmental responsibility.',
      icon: Globe,
      color: 'emerald',
    },
  ];

  const features = [
    {
      title: 'AI-Powered Recommendations',
      description: 'Personalized product suggestions based on your preferences and behavior.',
      icon: Zap,
    },
    {
      title: 'Voice Commerce',
      description: 'Shop hands-free with voice commands and natural language processing.',
      icon: Users,
    },
    {
      title: 'AR Try-On',
      description: 'Visualize products in your space before you buy with augmented reality.',
      icon: Rocket,
    },
    {
      title: 'Smart Analytics',
      description: 'Data-driven insights help you make informed purchasing decisions.',
      icon: TrendingUp,
    },
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Company Founded',
      description: 'Easy11 was born with a vision to revolutionize e-commerce through AI.',
    },
    {
      year: '2024',
      title: 'Platform Launch',
      description: 'Launched our AI-powered commerce platform with personalization features.',
    },
    {
      year: '2025',
      title: 'Voice & AR Integration',
      description: 'Introduced voice commerce and AR try-on capabilities.',
    },
    {
      year: '2025',
      title: 'Global Expansion',
      description: 'Expanded to serve customers worldwide with international shipping.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              About Easy11
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Revolutionizing e-commerce through AI-powered personalization, voice commerce, and innovative shopping experiences.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-blue-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Secure & Trusted</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span>Global Reach</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-16">
        {/* Our Story */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-6 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
                Easy11 was founded in 2024 with a simple yet powerful vision: to make online shopping smarter, 
                more intuitive, and more personalized than ever before. We recognized that traditional e-commerce 
                platforms were missing the mark when it came to understanding and serving individual customers.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
                By combining cutting-edge artificial intelligence, machine learning, and innovative technologies 
                like voice commerce and augmented reality, we've created a platform that doesn't just sell products—it 
                understands you, learns from your preferences, and delivers a shopping experience tailored specifically 
                to your needs.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                Today, Easy11 serves customers and vendors worldwide, providing a seamless, secure, and sustainable 
                commerce ecosystem that benefits everyone in the supply chain. We're not just building a marketplace; 
                we're shaping the future of how people discover, explore, and purchase products online.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                  Our Mission
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                To democratize intelligent commerce by making AI-powered shopping accessible to everyone, 
                while building a sustainable, ethical, and customer-centric platform that transforms how 
                people discover and purchase products online.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Rocket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                  Our Vision
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                To become the world's most trusted and innovative e-commerce platform, where AI and human 
                creativity work together to deliver unparalleled shopping experiences that are personalized, 
                sustainable, and accessible to all.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-12 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                const colorClasses = {
                  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                  pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
                  green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                  emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
                };
                const colors = colorClasses[value.color as keyof typeof colorClasses] || colorClasses.blue;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
                  >
                    <div className={`p-4 ${colors} rounded-lg w-fit mx-auto mb-4`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Key Features */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-12 text-center">
              What Makes Us Different
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex gap-4"
                  >
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Milestones */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-12 text-center">
              Our Journey
            </h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

              {/* Milestones */}
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex gap-6">
                    {/* Timeline Dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {milestone.year.slice(-2)}
                      </div>
                    </div>

                    {/* Milestone Content */}
                    <div className="flex-1 pt-2">
                      <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-12 rounded-xl text-center"
        >
          <h2 className="text-3xl font-heading font-bold mb-4">
            Join Us on This Journey
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Whether you're a customer looking for the perfect product or a vendor wanting to reach new audiences, 
            Easy11 is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Shopping
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-700 text-white border-2 border-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

