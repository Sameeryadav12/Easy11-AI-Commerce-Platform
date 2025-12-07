import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Leaf } from 'lucide-react';
import { Button } from '../ui';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  gradient: string;
  icon: React.ReactNode;
}

/**
 * Promotional Banners Component
 * 
 * Displays marketing-driven promotional banners.
 * Admin-controllable content with countdown timers.
 */
export const PromotionalBanners: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const banners: Banner[] = [
    {
      id: 'summer-sale',
      title: 'Summer Electronics Sale',
      subtitle: 'Up to 30% off on selected items',
      cta: 'Shop Electronics',
      link: '/products?category=electronics&sale=summer',
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      icon: <Flame className="w-8 h-8" />,
    },
    {
      id: 'sustainable',
      title: 'Sustainable Collection',
      subtitle: 'Eco-friendly products for conscious shoppers',
      cta: 'Shop Sustainable',
      link: '/products?category=sustainable',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      icon: <Leaf className="w-8 h-8" />,
    },
  ];

  return (
    <section className="section" ref={ref}>
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-6">
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Link to={banner.link}>
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${banner.gradient} p-8 lg:p-12 group cursor-pointer h-full min-h-[300px] flex flex-col justify-between`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div
                      style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)',
                        backgroundSize: '32px 32px',
                      }}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl mb-6 text-white"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {banner.icon}
                    </motion.div>

                    {/* Text */}
                    <h3 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-3">
                      {banner.title}
                    </h3>
                    <p className="text-lg text-white/90 mb-6">
                      {banner.subtitle}
                    </p>

                    {/* CTA */}
                    <Button
                      variant="secondary"
                      className="bg-white text-gray-900 hover:bg-white/90 group-hover:translate-x-2 transition-transform"
                    >
                      {banner.cta}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanners;

