import { Metadata } from 'next';
import DashboardOverview from '@/components/dashboard/DashboardOverview';

export const metadata: Metadata = {
  title: 'Dashboard - Easy11 Admin',
  description: 'Overview of key metrics and analytics',
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Command Center
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Unified visibility across commerce health, AI systems, and compliance workload. All signals sync every 60 seconds.
        </p>
      </div>

      <DashboardOverview />
    </div>
  );
}

