import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Zap, Heart, TrendingUp } from 'lucide-react';
import { Button } from '../ui';

interface HeroSlide {
  id: number;
  headline: string;
  subheadline: string;
  description: string;
  primaryCTA: string;
  secondaryCTA: string;
  primaryLink: string;
  secondaryLink: string;
  gradient: string;
  icon: React.ReactNode;
}

/**
 * Hero Section Component
 * 
 * The above-the-fold section with rotating promotional banners.
 * Features AI-driven personalization and smooth transitions.
 */
export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Hero slide variants – shopping-focused copy, no feature hype
  const slides: HeroSlide[] = [
    {
      id: 1,
      headline: 'Shop Smarter.',
      subheadline: 'Deals that fit you.',
      description: 'Find what you need with tailored picks and fast checkout. Trusted by thousands of shoppers.',
      primaryCTA: 'Start Shopping',
      secondaryCTA: 'All Products',
      primaryLink: '/products',
      secondaryLink: '/products',
      gradient: 'from-navy-500 via-blue-600 to-blue-700',
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      id: 2,
      headline: 'Spring Sale.',
      subheadline: 'Limited-time deals.',
      description: 'Exclusive offers on top picks. Save on electronics, clothing, and more.',
      primaryCTA: 'View Spring Deals',
      secondaryCTA: 'See All Products',
      primaryLink: '/products?sale=spring',
      secondaryLink: '/products',
      gradient: 'from-teal-600 via-teal-500 to-sky-500',
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      id: 3,
      headline: 'Sustainable Style.',
      subheadline: 'Eco-friendly picks.',
      description: 'Shop eco-friendly products without compromising on quality.',
      primaryCTA: 'Shop Sustainable',
      secondaryCTA: 'Learn More',
      primaryLink: '/products?category=sustainable',
      secondaryLink: '/sustainability',
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      icon: <Heart className="w-6 h-6" />,
    },
    {
      id: 4,
      headline: 'New Arrivals.',
      subheadline: 'Fresh inventory.',
      description: 'Latest products added daily. See what\'s new.',
      primaryCTA: 'See New Items',
      secondaryCTA: 'All Products',
      primaryLink: '/products?new=true',
      secondaryLink: '/products',
      gradient: 'from-violet-600 via-purple-600 to-fuchsia-600',
      icon: <TrendingUp className="w-6 h-6" />,
    },
  ];

  // Auto-rotate slides every 7 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const slide = slides[currentSlide];

  return (
    <section
      className={`relative bg-gradient-to-br ${slide.gradient} text-white overflow-hidden`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container-custom relative z-10 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Side - Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl lg:text-5xl xl:text-6xl font-heading font-extrabold mb-4 leading-tight"
              >
                {slide.headline}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-300 mt-2">
                  {slide.subheadline}
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg lg:text-xl text-blue-100 mb-6 max-w-xl mx-auto lg:mx-0"
              >
                {slide.description}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  variant="success"
                  onClick={() => (window.location.href = slide.primaryLink)}
                  className="group"
                >
                  {slide.primaryCTA}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  onClick={() => (window.location.href = slide.secondaryLink)}
                  className="bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:bg-white/30 text-white"
                >
                  {slide.secondaryCTA}
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12 flex flex-wrap gap-6 justify-center lg:justify-start text-sm"
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-teal-300" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-teal-300" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-teal-300" />
                  <span>Free Returns</span>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Right Side - Shop by category (each tile links somewhere) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="hidden lg:block"
          >
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <p className="text-sm font-medium text-blue-100 mb-4">Shop by category</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { emoji: '💻', label: 'Electronics', to: '/products?category=electronics' },
                  { emoji: '🎧', label: 'Audio', to: '/products?category=electronics' },
                  { emoji: '⌚', label: 'Watches', to: '/products?category=accessories' },
                  { emoji: '📱', label: 'Phones', to: '/products?category=electronics' },
                ].map(({ emoji, label, to }, i) => (
                  <Link
                    key={i}
                    to={to}
                    className="aspect-square bg-white/20 rounded-xl flex flex-col items-center justify-center hover:scale-[1.02] hover:bg-white/30 transition-all cursor-pointer text-white no-underline"
                  >
                    <span className="text-4xl mb-1">{emoji}</span>
                    <span className="text-xs font-medium">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center lg:justify-start space-x-2 mt-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="currentColor"
            className="text-gray-50 dark:text-gray-900"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;

