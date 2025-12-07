import type { Metadata } from 'next';
import { Building2, FlagTriangleRight, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VendorManagement from '@/components/dashboard/VendorManagement';
import { vendorDirectory, vendorFraudWatchlist } from '@/lib/admin-data';

export const metadata: Metadata = {
  title: 'Vendor Control - Easy11 Admin',
  description: 'Approve, suspend, and monitor vendors with risk intelligence.',
};

const activeAndReview = vendorDirectory.filter((vendor) =>
  ['Active', 'Under Review'].includes(vendor.status)
).length;
const pendingKyc = vendorDirectory.filter((vendor) => vendor.kycStatus === 'Pending').length;
const escalatedWatchlist = vendorFraudWatchlist.filter(
  (item) => item.triageStatus === 'Escalated'
).length;
const averageDisputeRate =
  vendorDirectory.length > 0
    ? vendorDirectory.reduce((sum, vendor) => sum + vendor.disputeRate, 0) / vendorDirectory.length
    : 0;
const riskHighlights = [
  {
    label: 'Active + Under Review',
    value: `${activeAndReview} vendors`,
    detail: `Avg dispute rate ${(averageDisputeRate * 100).toFixed(2)}%`,
  },
  {
    label: 'Fraud Watchlist',
    value: `${vendorFraudWatchlist.length} vendors`,
    detail: `${escalatedWatchlist} escalated · ${vendorFraudWatchlist.length - escalatedWatchlist} under triage`,
  },
  {
    label: 'KYC Pending',
    value: `${pendingKyc} submissions`,
    detail: 'Auto-notifications dispatched every 6h',
  },
];

const playbooks = [
  'Escalate breach → compliance review within 2h.',
  'Auto-credit high dispute ratio vendors and notify finance.',
  'Trigger re-verification after 3 SLA misses in 7 days.',
];

export default function VendorsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Vendor Control
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Search, segment, and take action on the entire vendor network. Risk scores refresh every
            10 minutes with anomaly detection across refunds, disputes, and fulfilment.
          </p>
        </div>
        <Badge className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-900">
          Next: approval workflows (Week 2)
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {riskHighlights.map((highlight) => (
          <Card key={highlight.label} className="border border-slate-200/70 dark:border-slate-800/60">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                  {highlight.label}
                </CardTitle>
                <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                  {highlight.value}
                </p>
              </div>
              <Building2 className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500 dark:text-slate-300">{highlight.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <VendorManagement />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 border border-slate-200/70 dark:border-slate-800/60">
          <CardHeader>
            <CardTitle>Operational playbooks</CardTitle>
            <CardDescription>Codify how Easy11 responds to risk signals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {playbooks.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <FlagTriangleRight className="h-4 w-4 text-blue-500" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border border-slate-200/70 dark:border-slate-800/60">
          <CardHeader>
            <CardTitle>Live alerts feed</CardTitle>
            <CardDescription>First-class integration lands in Sprint 17.</CardDescription>
          </CardHeader>
          <CardContent className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              Streaming alert feed placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


