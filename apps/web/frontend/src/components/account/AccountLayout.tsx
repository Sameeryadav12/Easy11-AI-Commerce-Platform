import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  RotateCcw,
  Heart,
  Gift,
  Share2,
  Target,
  History,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useRewardsStore } from '../../store/rewardsStore';
import ThemeToggle from '../ThemeToggle';

interface AccountLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  badge?: number | string;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { points, tier } = useRewardsStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(2); // Mock notifications

  const navigationItems: NavItem[] = [
    { label: 'Dashboard', path: '/account', icon: LayoutDashboard },
    { label: 'My Orders', path: '/account/orders', icon: Package, badge: 2 },
    { label: 'Returns & Refunds', path: '/account/returns', icon: RotateCcw },
    { label: 'Wishlist', path: '/account/wishlist', icon: Heart, badge: 3 },
    { label: 'Rewards & Wallet', path: '/account/rewards', icon: Gift },
    { label: 'Referrals & Invites', path: '/account/referrals', icon: Share2 },
    { label: 'Challenges & Badges', path: '/account/rewards/challenges', icon: Target },
    { label: 'Points History', path: '/account/rewards/history', icon: History },
    { label: 'Profile & Security', path: '/account/profile', icon: User },
    { label: 'Settings', path: '/account/settings', icon: Settings },
    { label: 'Support', path: '/account/support', icon: HelpCircle },
  ];

  const isActive = (path: string) => {
    if (path === '/account') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-heading font-bold text-xl">E</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-heading font-bold text-navy dark:text-white">
                  Easy11
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  My Account
                </p>
              </div>
            </Link>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Menu */}
              <div className="hidden lg:flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {tier} • {points} pts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all group ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${active ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {!item.badge && active && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />

              {/* Sidebar */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-2xl z-50 lg:hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                    Menu
                  </h2>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {tier} • {points} points
                      </p>
                    </div>
                  </div>
                </div>

                <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                          active
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}

                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all mt-4"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="container-custom py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

