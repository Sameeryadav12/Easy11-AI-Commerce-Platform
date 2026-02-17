import { Link, Outlet, useLocation } from 'react-router-dom';

type Tab = {
  label: string;
  to: string;
  match: (pathname: string) => boolean;
};

const tabs: Tab[] = [
  {
    label: 'Overview',
    to: '/account/rewards',
    match: (p) => p === '/account/rewards',
  },
  {
    label: 'Points history',
    to: '/account/rewards/history',
    match: (p) => p.startsWith('/account/rewards/history'),
  },
  {
    label: 'Redemptions',
    to: '/account/rewards/redemptions',
    match: (p) => p.startsWith('/account/rewards/redemptions'),
  },
  {
    label: 'Challenges & badges',
    to: '/account/rewards/challenges',
    match: (p) => p.startsWith('/account/rewards/challenges'),
  },
  {
    label: 'Referrals',
    to: '/account/rewards/referrals',
    match: (p) => p.startsWith('/account/rewards/referrals'),
  },
];

export default function RewardsHubLayout() {
  const location = useLocation();

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = tab.match(location.pathname);
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`px-4 py-2 rounded-t-lg font-semibold text-sm transition-colors ${
                  active
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-b-0 border-gray-200 dark:border-gray-700'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <Outlet />
    </div>
  );
}

