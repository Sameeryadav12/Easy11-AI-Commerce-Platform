import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    // Fallback for browsers not supporting 'instant'
    if (window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
  };

  const handleSocialClick = (platform: string, url: string) => {
    // Scroll to top before opening social link
    scrollToTop();
    // Small delay to ensure scroll happens before opening new tab
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 100);
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Easy11 */}
          <div>
            <h4 className="text-white font-heading font-bold text-lg mb-4">
              About Easy11
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Shop smarter with AI-powered recommendations. 
              Your trusted commerce partner for quality products.
            </p>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleSocialClick('facebook', 'https://facebook.com')}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleSocialClick('twitter', 'https://twitter.com')}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleSocialClick('instagram', 'https://instagram.com')}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleSocialClick('youtube', 'https://youtube.com')}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-heading font-bold text-lg mb-4">
              Shop
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" onClick={scrollToTop} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=electronics" onClick={scrollToTop} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=clothing" onClick={scrollToTop} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Clothing
                </Link>
              </li>
              <li>
                <Link to="/products?category=accessories" onClick={scrollToTop} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/products?featured=true" onClick={scrollToTop} className="text-teal-400 hover:text-teal-300 transition-colors cursor-pointer">
                  Featured Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-heading font-bold text-lg mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" onClick={scrollToTop} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" onClick={scrollToTop} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" onClick={scrollToTop} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/track-order" onClick={scrollToTop} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/support" onClick={scrollToTop} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Support Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-heading font-bold text-lg mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" onClick={scrollToTop} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" onClick={scrollToTop} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" onClick={scrollToTop} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" onClick={scrollToTop} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/accessibility" onClick={scrollToTop} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Easy11. All rights reserved. Built with ❤️ by Ocean & Sameer
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-gray-500 text-sm">Powered by AI</span>
              <div className="flex space-x-4">
                <img src="/payments/visa.svg" alt="Visa" className="h-6 opacity-70" onError={(e) => (e.currentTarget.style.display = 'none')} />
                <img src="/payments/mastercard.svg" alt="Mastercard" className="h-6 opacity-70" onError={(e) => (e.currentTarget.style.display = 'none')} />
                <img src="/payments/paypal.svg" alt="PayPal" className="h-6 opacity-70" onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

