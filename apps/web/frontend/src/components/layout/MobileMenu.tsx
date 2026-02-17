import { Link } from 'react-router-dom';
import { X, Home, Package, ShoppingBag, User, LogIn, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore();

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Drawer */}
      <div className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 z-50 shadow-2xl lg:hidden animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-heading font-bold text-2xl">E</span>
            </div>
            <h2 className="text-xl font-heading font-bold text-navy dark:text-white">
              Easy11
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* User Section - tap to go to account */}
        {user && (
          <Link
            to="/account"
            onClick={handleLinkClick}
            className="block p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* Navigation Links */}
        <nav className="p-6 space-y-2 overflow-y-auto max-h-[calc(100vh-240px)]">
          <Link
            to="/"
            onClick={handleLinkClick}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Home</span>
          </Link>

          <Link
            to="/products"
            onClick={handleLinkClick}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="font-medium text-gray-700 dark:text-gray-300">All Products</span>
          </Link>

          <div className="pt-2 pb-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-2">
              Categories
            </p>
            <Link
              to="/products?category=electronics"
              onClick={handleLinkClick}
              className="flex items-center space-x-3 p-3 pl-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-gray-700 dark:text-gray-300">Electronics</span>
            </Link>
            <Link
              to="/products?category=clothing"
              onClick={handleLinkClick}
              className="flex items-center space-x-3 p-3 pl-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-gray-700 dark:text-gray-300">Clothing</span>
            </Link>
            <Link
              to="/products?category=accessories"
              onClick={handleLinkClick}
              className="flex items-center space-x-3 p-3 pl-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-gray-700 dark:text-gray-300">Accessories</span>
            </Link>
          </div>

          <Link
            to="/products?featured=true"
            onClick={handleLinkClick}
            className="flex items-center space-x-3 p-3 rounded-lg bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span className="font-semibold text-teal-600 dark:text-teal-400">🔥 Featured Deals</span>
          </Link>

          <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

          {user ? (
            <>
              <Link
                to="/account"
                onClick={handleLinkClick}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">My Account</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <LogIn className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Sign In</span>
              </Link>
              <Link
                to="/register"
                onClick={handleLinkClick}
                className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-blue-600 dark:text-blue-400">Sign Up</span>
              </Link>
            </>
          )}
        </nav>

        {/* Footer in Drawer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            © 2025 Easy11. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;

