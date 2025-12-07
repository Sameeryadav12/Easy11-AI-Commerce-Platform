import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import ComplianceConsole from '@/components/dashboard/ComplianceConsole';

export const metadata: Metadata = {
  title: 'Compliance & Consent - Easy11 Admin',
  description: 'Manage SARs, retention policies, and consent statuses.',
};

export default function CompliancePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Compliance & Consent
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Track GDPR/CCPA requests, manage retention policies, and audit data exports. This is the
            single pane for Compliance, Support, and Legal teams.
          </p>
        </div>
        <Badge className="rounded-full bg-emerald-600 px-4 py-2 text_sm text-white">
          SOC 2 evidence ready
        </Badge>
      </div>

      <ComplianceConsole />
    </div>
  );
}

