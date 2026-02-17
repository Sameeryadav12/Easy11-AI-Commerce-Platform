/**
 * Easy11 Homepage
 * 
 * The main landing page featuring:
 * - Hero section with rotating banners
 * - Featured categories
 * - Trending products
 * - Why choose us benefits
 * - Promotional banners
 * - Customer testimonials
 * - Newsletter signup
 * 
 * Built with React, TypeScript, Framer Motion, and TailwindCSS
 */

import { Link } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import LiveIntentWidgets from '../components/home/LiveIntentWidgets';
import PersonalizedRecommendations from '../components/home/PersonalizedRecommendations';
import HomeDynamicSections from '../components/personalization/HomeDynamicSections';
import { useAuthStore } from '../store/authStore';
import { useMemo } from 'react';
import FeaturedCategories from '../components/home/FeaturedCategories';
import TrendingProducts from '../components/home/TrendingProducts';
import WhyChooseUs from '../components/home/WhyChooseUs';
import PromotionalBanners from '../components/home/PromotionalBanners';
import Testimonials from '../components/home/Testimonials';
import NewsletterCTA from '../components/home/NewsletterCTA';

export const HomePage = () => {
  const { user } = useAuthStore();
  const sessionId = useMemo(() => {
    const existing = sessionStorage.getItem('easy11-session-id');
    if (existing) return existing;
    const generated = `sess_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem('easy11-session-id', generated);
    return generated;
  }, []);

  // Logged-in: shopping-first (entry points then hero). Guest: hero then discovery.
  const isLoggedIn = !!user?.id;

  return (
    <div className="min-h-screen">
      {isLoggedIn ? (
        <>
          {/* One clear message + one primary action above the fold */}
          <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="container-custom py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-gray-700 dark:text-gray-300">
                For you today, <span className="font-semibold text-gray-900 dark:text-white">{user?.name?.split(' ')[0] || 'there'}</span>.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shrink-0"
              >
                Continue shopping
              </Link>
            </div>
          </section>
          {/* Single personalized area: Because you viewed, Recommended for you, Based on your activity */}
          <section className="bg-gray-50 dark:bg-gray-900 py-12 lg:py-14" aria-label="Your feed">
            <div className="container-custom space-y-14">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Your feed</p>
              <LiveIntentWidgets embedded />
              <PersonalizedRecommendations variant="merged" />
              <HomeDynamicSections userId={user?.id ?? 'guest'} sessionId={sessionId} geo={user?.region} embedded />
            </div>
          </section>
          <HeroSection />
          <div className="bg-white dark:bg-gray-950">
            <FeaturedCategories />
          </div>
          <div className="bg-gray-50 dark:bg-gray-900">
            <TrendingProducts />
          </div>
          <div className="bg-white dark:bg-gray-950">
            <WhyChooseUs />
          </div>
          <div className="bg-gray-50 dark:bg-gray-900">
            <PromotionalBanners />
          </div>
          <div className="bg-white dark:bg-gray-950">
            <Testimonials />
          </div>
          <NewsletterCTA />
        </>
      ) : (
        <>
          <HeroSection />
          {/* Single personalized area for guests too */}
          <section className="bg-gray-50 dark:bg-gray-900 py-12 lg:py-14" aria-label="Your feed">
            <div className="container-custom space-y-14">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Your feed</p>
              <LiveIntentWidgets embedded />
              <PersonalizedRecommendations variant="merged" />
              <HomeDynamicSections userId="guest" sessionId={sessionId} geo={undefined} embedded />
            </div>
          </section>
          <div className="bg-white dark:bg-gray-950">
            <FeaturedCategories />
          </div>
          <div className="bg-gray-50 dark:bg-gray-900">
            <TrendingProducts />
          </div>
          <div className="bg-white dark:bg-gray-950">
            <WhyChooseUs />
          </div>
          <div className="bg-gray-50 dark:bg-gray-900">
            <PromotionalBanners />
          </div>
          <div className="bg-white dark:bg-gray-950">
            <Testimonials />
          </div>
          <NewsletterCTA />
        </>
      )}
    </div>
  );
};

export default HomePage;

