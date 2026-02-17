import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import MobileMenu from './layout/MobileMenu';
import CartDrawer from './cart/CartDrawer';
import ChatWidget from './ai/ChatWidget';
import CookieConsentBanner from './consent/CookieConsentBanner';
import CookiePreferencesTrigger from './consent/CookiePreferencesTrigger';
import ApiUnavailableBanner from './ApiUnavailableBanner';
import { useCookieScripts } from '../hooks/useCookieScripts';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  useCookieScripts();
  const isVendorRoute = location.pathname.startsWith('/vendor');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Skip to main content - first focusable element for keyboard/screen reader users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ApiUnavailableBanner />
      {!isVendorRoute && (
        <>
          <Header onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
          <CartDrawer />
          <ChatWidget />
          <CookieConsentBanner />
          <CookiePreferencesTrigger />
        </>
      )}
      <main id="main-content" className="flex-grow" tabIndex={-1}>
        {children}
      </main>
      {!isVendorRoute && <Footer />}
    </div>
  );
}
