'use client';

import { BrainCircuit, ShieldCheck, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';

const kpiCards = [
  {
    title: 'GMV (Last 24h)',
    value: formatCurrency(382_450),
    delta: '+12.4%',
    tone: 'text-emerald-500',
    meta: 'vs. prior period',
    sparkline: [62, 71, 68, 74, 81, 79, 85],
  },
  {
    title: 'Vendors Requiring Attention',
    value: '14',
    delta: '-3 this week',
    tone: 'text-amber-500',
    meta: 'SLA breaches & disputes',
    sparkline: [18, 22, 20, 19, 17, 16, 14],
  },
  {
    title: 'AI Personalization Lift',
    value: '+6.8 pts',
    delta: '+0.9 pts',
    tone: 'text-blue-500',
    meta: 'CTR vs. control',
    sparkline: [3.1, 3.3, 4.2, 4.6, 5.1, 5.8, 6.8],
  },
  {
    title: 'Compliance SLA',
    value: '97.2%',
    delta: '0 SAR > 5 days',
    tone: 'text-emerald-500',
    meta: 'Requests resolved within SLA',
    sparkline: [93, 94, 95, 96, 97, 97, 97.2],
  },
];

const proactiveAlerts = [
  {
    title: 'Churn risk rising for Platinum customers',
    detail: '10% drop in repeat purchases over 7 days · Trigger outreach playbook',
    severity: 'medium',
  },
  {
    title: 'Voice command rejection spike',
    detail: 'Region: EU-West · 32% of intents failing confirmation · investigate NLU model',
    severity: 'high',
  },
  {
    title: 'Pending SAR approvals',
    detail: '3 new subject access requests awaiting compliance officer sign-off',
    severity: 'low',
  },
];

const upcomingWorkstreams = [
  {
    title: 'Re-personalize high-value segment',
    owner: 'AI Manager',
    due: 'Due tomorrow',
    icon: BrainCircuit,
  },
  {
    title: 'Review AR asset backlog',
    owner: 'Creative Ops',
    due: 'In 2 days',
    icon: ShieldCheck,
  },
  {
    title: 'Launch loyalty win-back experiment',
    owner: 'Growth Team',
    due: 'Next Monday',
    icon: Target,
  },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <Card
            key={card.title}
            className="overflow-hidden border border-slate-200/70 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {card.title}
              </CardTitle>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{card.value}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className={`text-xs font-medium ${card.tone}`}>{card.delta}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{card.meta}</p>
              <div className="flex h-12 items-end gap-1">
                {card.sparkline.map((point, index) => (
                  <span
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${card.title}-${index}`}
                    className="flex-1 rounded-full bg-gradient-to-t from-blue-100 via-blue-200 to-blue-500 dark:from-cyan-900/20 dark:via-cyan-600/40 dark:to-cyan-400/80"
                    style={{ height: `${point}%` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 border border-slate-200/70 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
          <CardHeader className="pb-2">
            <CardTitle>Proactive alerts</CardTitle>
            <CardDescription>Signals requiring human review in the last hour</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {proactiveAlerts.map((alert) => (
              <div
                key={alert.title}
                className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {alert.title}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{alert.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border border-slate-200/70 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
          <CardHeader className="pb-2">
            <CardTitle>Upcoming workflows</CardTitle>
            <CardDescription>What’s scheduled for the next 72 hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingWorkstreams.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between rounded-2xl border border-slate-200/80 px-4 py-3 dark:border-slate-700"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">
                    Owner · {item.owner}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <item.icon className="h-4 w-4 text-slate-400" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-300">
                    {item.due}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 border border-slate-200/70 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Revenue overview</CardTitle>
            <CardDescription>Full chart instrumentation lands in Sprint 17</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-400 dark:border-slate-700">
              Interactive Grafana Embed – placeholder for now
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border border-slate-200/70 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Latest admin activity</CardTitle>
            <CardDescription>Audit log events synced every 30 seconds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {(index % 2 === 0 ? 'Compliance Officer' : 'AI Manager') + ' • '}
                    <span className="font-normal text-slate-500 dark:text-slate-300">
                      {index % 2 === 0 ? 'Approved SAR export' : 'Adjusted exploration ratio'}
                    </span>
                  </p>
                  <p className="text-xs text-slate-400">{index * 7 + 3} minutes ago</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  Hash:{' '}
                  {('0x' + Math.random().toString(16).slice(2, 8)).toUpperCase()}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

