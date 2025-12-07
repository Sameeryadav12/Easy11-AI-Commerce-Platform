import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Camera } from 'lucide-react';
import { Button } from '../ui';
import ThemeToggle from '../ThemeToggle';
import VisualSearch from '../search/VisualSearch';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import VoiceCommandButton from '../voice/VoiceCommandButton';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate();
  const { items, openDrawer } = useCartStore();
  const { user, logout } = useAuthStore();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear search after navigation
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-heading font-bold text-2xl">E</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-heading font-bold text-navy dark:text-white">
                Easy11
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                AI Commerce
              </p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full flex items-center space-x-2">
              <div className="relative flex-1">
                <Search 
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    isSearchFocused ? 'text-blue-500' : 'text-gray-400'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search for products, brands, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
              {/* Visual Search Button */}
              <button
                type="button"
                onClick={() => setIsVisualSearchOpen(true)}
                className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white transition-all shadow-md hover:shadow-lg group"
                aria-label="Visual search"
                title="Search by image"
              >
                <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              {/* Search Submit Button */}
              <button
                type="submit"
                className="p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-all shadow-md hover:shadow-lg"
                aria-label="Search"
                title="Search products"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Right Side Navigation */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search Icon - Mobile */}
            <button
              onClick={() => {
                const query = prompt('Search for products:');
                if (query && query.trim()) {
                  navigate(`/products?search=${encodeURIComponent(query.trim())}`);
                }
              }}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Voice - Mobile */}
            <div className="md:hidden">
              <VoiceCommandButton />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Voice Commerce */}
            <div className="hidden md:block">
              <VoiceCommandButton />
            </div>

            {/* Shopping Cart */}
            <button
              onClick={openDrawer}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scale-in">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="hidden lg:flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.name}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* User Icon - Mobile */}
            {!user && (
              <button
                onClick={() => navigate('/login')}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="User account"
              >
                <User className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 pb-4 border-t border-gray-100 dark:border-gray-800 pt-4">
          <Link
            to="/"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors"
          >
            All Products
          </Link>
          <Link
            to="/products?category=electronics"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors"
          >
            Electronics
          </Link>
          <Link
            to="/products?category=clothing"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors"
          >
            Clothing
          </Link>
          <Link
            to="/products?category=accessories"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors"
          >
            Accessories
          </Link>
          <Link
            to="/products?featured=true"
            className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors"
          >
            🔥 Featured Deals
          </Link>
        </nav>
      </div>

      {/* Visual Search Modal */}
      <VisualSearch
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
      />
    </header>
  );
};

export default Header;

