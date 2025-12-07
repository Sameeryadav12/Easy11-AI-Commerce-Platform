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

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section - Above the fold */}
      <HeroSection />

      {/* 1.5. Live Intent Widgets - Recently Viewed + Resume Cart */}
      <LiveIntentWidgets />

      {/* 2. Personalized Recommendations */}
      <PersonalizedRecommendations />

      {/* 2.5 Session-aware sections */}
      <HomeDynamicSections userId={user?.id ?? 'guest'} sessionId={sessionId} geo={user?.region} />

      {/* 3. Featured Categories - Main navigation */}
      <FeaturedCategories />

      {/* 4. Trending Products - Social proof & discovery */}
      <TrendingProducts />

      {/* 5. Why Choose Us - Value propositions */}
      <WhyChooseUs />

      {/* 6. Promotional Banners - Marketing & conversions */}
      <PromotionalBanners />

      {/* 7. Testimonials - Trust & credibility */}
      <Testimonials />

      {/* 8. Newsletter CTA - Retention & growth */}
      <NewsletterCTA />
    </div>
  );
};

export default HomePage;

