import type { Metadata } from 'next';
import { FileText, Hash, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Activity Explorer - Easy11 Admin',
  description: 'Immutable audit log of every admin action and system event.',
};

const sampleEvents = [
  {
    actor: 'Michelle K. (Compliance)',
    action: 'Approved SAR export for user #49821',
    resource: 'compliance.sar.approve',
    timestamp: new Date(),
  },
  {
    actor: 'Arjun P. (AI Manager)',
    action: 'Adjusted personalization exploration ratio from 20% → 18%',
    resource: 'ai.personalization.update',
    timestamp: new Date(Date.now() - 1000 * 60 * 7),
  },
  {
    actor: 'System',
    action: 'Detected impossible travel login · auto challenged',
    resource: 'security.anomaly.impossible-travel',
    timestamp: new Date(Date.now() - 1000 * 60 * 22),
  },
];

export default function ActivityExplorerPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Activity Explorer
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Signed, append-only audit trail. Hash-chain support is wired—UI for filters and exports
            lands later in Sprint 16.
          </p>
        </div>
        <Badge className="rounded-full bg-purple-600 px-4 py-2 text-sm text-white">
          Immutable log · Hash verified
        </Badge>
      </div>

      <Card className="border border-slate-200/70 dark:border-slate-800/60">
        <CardHeader>
          <CardTitle>Recent actions</CardTitle>
          <CardDescription>Live data will come from the audit gateway.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          {sampleEvents.map((event, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className="rounded-2xl border border-slate-200/80 px-4 py-3 dark:border-slate-700"
            >
              <p className="font-semibold text-slate-900 dark:text-white">{event.actor}</p>
              <p>{event.action}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  {event.resource}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  {formatDate(event.timestamp)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5" />
                  0x{Math.random().toString(16).slice(2, 8).toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-slate-200/70 dark:border-slate-800/60">
        <CardHeader>
          <CardTitle>Export & search</CardTitle>
          <CardDescription>Full querying arrives with the GraphQL admin gateway.</CardDescription>
        </CardHeader>
        <CardContent className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-400 dark:border-slate-700">
          Coming soon: filters, CSV export, SIEM webhooks.
        </CardContent>
      </Card>
    </div>
  );
}


