import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { Card, CardBody, Badge } from '../ui';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  quote: string;
  avatar: string;
  verified: boolean;
  purchasedItem: string;
}

/**
 * Testimonials Component
 * 
 * Displays customer reviews in an auto-rotating carousel.
 * Builds trust and social proof.
 */
export const Testimonials: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'New York, USA',
      rating: 5,
      quote: 'Recommendations were spot-on. Found exactly what I needed. Smooth checkout.',
      avatar: '👩',
      verified: true,
      purchasedItem: 'Wireless Headphones',
    },
    {
      id: 2,
      name: 'Michael Chen',
      location: 'San Francisco, USA',
      rating: 5,
      quote: 'Fast shipping and great quality. The suggestions led me to a few solid buys.',
      avatar: '👨',
      verified: true,
      purchasedItem: 'Smart Watch',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      location: 'Austin, USA',
      rating: 5,
      quote: 'Love the sustainable products section. Easy11 makes it simple to shop ethically without compromising on style.',
      avatar: '👩‍💼',
      verified: true,
      purchasedItem: 'Eco-Friendly Bag',
    },
    {
      id: 4,
      name: 'David Park',
      location: 'Seattle, USA',
      rating: 4,
      quote: 'Great selection and competitive prices. The AI assistant helped me find exactly what I was looking for!',
      avatar: '👨‍💻',
      verified: true,
      purchasedItem: 'Laptop',
    },
    {
      id: 5,
      name: 'Jessica Taylor',
      location: 'Boston, USA',
      rating: 5,
      quote: 'Customer service is outstanding! Had an issue with my order and they resolved it within hours. Highly recommend!',
      avatar: '👩‍🎨',
      verified: true,
      purchasedItem: 'Designer Watch',
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused || !inView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, inView, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="section bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800" ref={ref}>
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Trusted by over 50,000 happy shoppers worldwide
          </p>
        </motion.div>

        {/* Main Testimonial Card */}
        <div
          className="max-w-4xl mx-auto relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Card variant="elevated" className="relative overflow-hidden">
            <CardBody className="p-8 md:p-12">
              {/* Quote Icon */}
              <Quote className="w-16 h-16 text-blue-200 dark:text-blue-900 absolute top-8 left-8 opacity-50" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10"
                >
                  {/* Stars */}
                  <div className="flex items-center justify-center space-x-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < currentTestimonial.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-2xl font-medium text-gray-900 dark:text-white text-center mb-8 leading-relaxed">
                    "{currentTestimonial.quote}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-3xl">
                      {currentTestimonial.avatar}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <p className="font-heading font-bold text-gray-900 dark:text-white">
                          {currentTestimonial.name}
                        </p>
                        {currentTestimonial.verified && (
                          <CheckCircle className="w-5 h-5 text-teal-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentTestimonial.location}
                      </p>
                      {currentTestimonial.verified && (
                        <Badge variant="success" size="sm" className="mt-1">
                          Verified Purchase: {currentTestimonial.purchasedItem}
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </CardBody>
          </Card>

          {/* Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-blue-500'
                    : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { value: '4.8/5', label: 'Average Rating' },
            { value: '50K+', label: 'Reviews' },
            { value: '99%', label: 'Satisfaction' },
            { value: '100K+', label: 'Customers' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-heading font-extrabold text-blue-600 dark:text-blue-400 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;

