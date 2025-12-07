import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import MobileMenu from './layout/MobileMenu';
import CartDrawer from './cart/CartDrawer';
import ChatWidget from './ai/ChatWidget';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isVendorRoute = location.pathname.startsWith('/vendor');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {!isVendorRoute && (
        <>
          <Header onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
          <CartDrawer />
          <ChatWidget />
        </>
      )}
      <main className="flex-grow">
        {children}
      </main>
      {!isVendorRoute && <Footer />}
    </div>
  );
}
