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
  Rocket,
  Building2,
  Mail,
  MapPin,
  Phone,
  Lock,
  RefreshCw,
  CheckCircle,
  Newspaper
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
              Building a smarter, secure, and customer-focused commerce platform powered by AI.
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

            {/* Trust Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
              >
                <Globe className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">18+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Countries Served</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
              >
                <Users className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12,000+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Customers</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
              >
                <Award className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">250+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Verified Vendors</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
              >
                <Zap className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Customer Rating</p>
              </motion.div>
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
                To democratize intelligent commerce through ethical commerce, transparent marketplace practices, 
                and seller accountability. We make AI-powered shopping accessible to everyone while ensuring 
                fair pricing, sustainable operations, and a customer-centric platform.
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
                To become a trusted, innovative e-commerce platform where AI and human creativity work together 
                for ethical commerce, transparent operations, and fair treatment of both buyers and sellers. 
                We aim to deliver personalized, sustainable, and accessible shopping experiences.
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
                      <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {milestone.year}
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

        {/* Buyer Protection */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-6 text-center flex items-center justify-center gap-2">
              <Shield className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              Our Buyer Protection Promise
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-2xl mx-auto">
              Shop with confidence. We stand behind every purchase on Easy11.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <RefreshCw className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">30-Day Return Guarantee</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Return eligible items within 30 days for a full refund.</p>
                </div>
              </div>
              <div className="flex gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <Lock className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Secure Payment & SSL Checkout</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Encrypted checkout and PCI-DSS compliant payment processing.</p>
                </div>
              </div>
              <div className="flex gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">5–7 Day Refund Processing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Refunds processed within 5–7 business days of approval.</p>
                </div>
              </div>
              <div className="flex gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 md:col-span-2 lg:col-span-1">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Verified Vendor Policy</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">All vendors are verified to maintain marketplace quality.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Meet the Founders */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.88 }}
          >
            <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-12 text-center">
              Meet the Founders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  O
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">Ocean</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-2">
                  Co-founder and technologist focused on building scalable, ethical commerce infrastructure. 
                  Passionate about making AI work for everyday shoppers.
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs italic">
                  Why Easy11: "We wanted to build a marketplace that treats both buyers and sellers fairly."
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  S
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">Sameer</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-2">
                  Co-founder and product lead driving customer experience and marketplace trust. 
                  Believes in transparent, sustainable commerce.
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs italic">
                  Why Easy11: "We started Easy11 to create a smarter, more trustworthy way to shop online."
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Media & Press */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="bg-gray-100 dark:bg-gray-800/50 p-8 rounded-xl border border-gray-200 dark:border-gray-700 text-center"
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
              <Newspaper className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              Featured & Partners
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Easy11 partners with verified payment providers and is committed to industry-standard security.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-gray-500 dark:text-gray-400">
              <span className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium">
                PCI-DSS Compliant Payments
              </span>
              <span className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium">
                Partnered with Verified Gateways
              </span>
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

        {/* Company Information - Legal entity transparency */}
        <section className="mt-20 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.95 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Company Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
              <div className="space-y-3">
                <p className="font-semibold text-gray-900 dark:text-white">Easy11 Commerce Pty Ltd</p>
                <p>Registered in Australia</p>
                <p>ABN: XX XXX XXX XXX</p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  Melbourne, Victoria
                </p>
              </div>
              <div className="space-y-3">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <a href="mailto:support@easy11.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                    support@easy11.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  Support: Available via contact form
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex flex-wrap items-center gap-2">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                Easy11 complies with GDPR and CCPA data protection standards. All payments are processed through PCI-DSS compliant gateways.
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

