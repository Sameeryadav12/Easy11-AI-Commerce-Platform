import type { Metadata } from 'next';
import { Activity, BarChart3, LineChart, Network } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analyticsMetrics, monitoringStreams } from '@/lib/admin-data';

export const metadata: Metadata = {
  title: 'Systems Analytics - Easy11 Admin',
  description: 'Monitor platform metrics, alerts, and health snapshots.',
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Systems Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Unified Grafana + Superset insights. Threshold-based alerts forward to Slack, email, and
            SMS once activated later this sprint.
          </p>
        </div>
        <Badge className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-slate-900">
          Weekly health snapshot · auto email upcoming
        </Badge>
      </div>

      <Card className="border border-slate-200/70 dark:border-slate-800/60">
        <CardHeader>
          <CardTitle>Telemetry overview</CardTitle>
          <CardDescription>Live sampling every 60s from the analytics warehouse.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {analyticsMetrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-slate-200/80 px-4 py-3 dark:border-slate-700"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                {metric.label}
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                {metric.value}
              </p>
              <p
                className={`text-xs ${
                  metric.tone === 'positive'
                    ? 'text-emerald-500'
                    : metric.tone === 'negative'
                    ? 'text-rose-500'
                    : 'text-slate-500 dark:text-slate-300'
                }`}
              >
                {metric.delta}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-slate-200/70 dark:border-slate-800/60">
        <CardHeader>
          <CardTitle>Monitoring streams</CardTitle>
          <CardDescription>Click-through dashboards land with live GraphQL hooks.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {monitoringStreams.map((stream) => (
            <div
              key={stream.name}
              className="rounded-2xl border border-slate-200/80 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300"
            >
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                {stream.name === 'Traffic' && <Activity className="h-3.5 w-3.5" />}
                {stream.name === 'Financial' && <BarChart3 className="h-3.5 w-3.5" />}
                {stream.name === 'Operational' && <Network className="h-3.5 w-3.5" />}
                {stream.name}
              </div>
              <p>{stream.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-slate-200/70 dark:border-slate-800/60">
        <CardHeader>
          <CardTitle>Health dashboard embeds</CardTitle>
          <CardDescription>Superset + Grafana integration placeholder for now.</CardDescription>
        </CardHeader>
        <CardContent className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-400 dark:border-slate-700">
          <div className="flex flex-col items-center gap-2">
            <LineChart className="h-5 w-5" />
            Drop-in iframe embed arrives with analytics gateway (Week 6).
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


