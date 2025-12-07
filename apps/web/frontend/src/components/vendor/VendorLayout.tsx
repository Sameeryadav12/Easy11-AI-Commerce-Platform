import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, ShoppingBag, BarChart2, Megaphone, Rocket, Smartphone, Settings, ShieldCheck, Gauge } from 'lucide-react';
import clsx from 'clsx';
import { useVendorStore } from '../../store/vendorStore';

const navItems = [
  { label: 'Dashboard', to: '/vendor/dashboard', icon: Gauge },
  { label: 'Products', to: '/vendor/products', icon: Package },
  { label: 'Orders', to: '/vendor/orders', icon: ShoppingBag },
  { label: 'Analytics', to: '/vendor/analytics', icon: BarChart2 },
  { label: 'Marketing', to: '/vendor/marketing/launch', icon: Megaphone },
  { label: 'Growth Ops', to: '/vendor/growth', icon: Rocket },
  { label: 'Mobile Ops', to: '/vendor/mobile', icon: Smartphone },
  { label: 'KYC', to: '/vendor/kyc', icon: ShieldCheck },
  { label: 'Settings', to: '/vendor/settings', icon: Settings },
];

interface VendorLayoutProps {
  children: ReactNode;
}

export default function VendorLayout({ children }: VendorLayoutProps) {
  const location = useLocation();
  const { currentVendor } = useVendorStore();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/vendor/dashboard"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 font-semibold text-white"
            >
              V
            </Link>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">Easy11 Vendor Portal</span>
              <span className="text-xs text-slate-500">Operate your storefront with confidence</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {currentVendor ? (
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{currentVendor.business_name}</p>
                <p className="text-xs text-slate-500">Tier • {currentVendor.tier?.toUpperCase() ?? 'N/A'}</p>
              </div>
            ) : (
              <Link
                to="/vendor/login"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/60">
          <div className="mx-auto flex w-full max-w-7xl items-center overflow-x-auto px-4">
            <nav className="flex flex-1 items-center gap-1 py-2 text-sm">
              {navItems.map(({ label, to, icon: Icon }) => {
                const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={clsx(
                      'flex items-center gap-2 rounded-lg px-3 py-2 transition-colors',
                      isActive
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="whitespace-nowrap">{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}
