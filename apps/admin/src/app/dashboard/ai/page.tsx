import type { Metadata } from 'next';
import { RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'AI Control Center - Easy11 Admin',
  description: 'Monitor model status, adjust exploration, and track drift.',
};

const modelSnapshots = [
  {
    name: 'Personalization Ranker',
    version: 'v2.4.1',
    status: 'Healthy',
    drift: '+0.6%',
    retrainEta: 'Next run: 6h',
  },
  {
    name: 'Voice NLU',
    version: 'v1.2.9',
    status: 'Attention',
    drift: '+3.8%',
    retrainEta: 'Manual approval required',
  },
  {
    name: 'Pricing Elasticity',
    version: 'v3.0.3',
    status: 'Healthy',
    drift: '+1.1%',
    retrainEta: 'Nightly',
  },
];

const controls = [
  {
    label: 'Exploration ratio',
    value: '18%',
    description: 'Current personalization randomness across surfaces.',
  },
  {
    label: 'Blocklists',
    value: '5 active policies',
    description: 'Product lines excluded from recommendations.',
  },
  {
    label: 'Feedback queue',
    value: '27 items',
    description: 'User reports pending review before retrain.',
  },
];

export default function AIControlPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            AI Control Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Observe model performance, tune levers, and coordinate approvals. All changes will
            require dual admin sign-off starting Sprint 17.
          </p>
        </div>
        <Badge className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm text-white">
          Governance mode: Preview
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {modelSnapshots.map((model) => (
          <Card key={model.name} className="border border-slate-200/70 dark:border-slate-800/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">{model.name}</CardTitle>
              <CardDescription>{model.version}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span className="font-medium text-emerald-500">{model.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Drift</span>
                <span className="font-medium text-amber-500">{model.drift}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Retrain</span>
                <span>{model.retrainEta}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-slate-200/70 dark:border-slate-800/60">
          <CardHeader>
            <CardTitle>Control levers</CardTitle>
            <CardDescription>Forthcoming interactive controls preview.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            {controls.map((control) => (
              <div
                key={control.label}
                className="flex items-start justify-between rounded-2xl border border-slate-200/80 px-4 py-3 dark:border-slate-700"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{control.label}</p>
                  <p className="text-xs">{control.description}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {control.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-slate-200/70 dark:border-slate-800/60">
          <CardHeader>
            <CardTitle>Action queue</CardTitle>
            <CardDescription>Approval workflow placeholder ahead of Sprint 17.</CardDescription>
          </CardHeader>
          <CardContent className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-400 dark:border-slate-700">
            <div className="flex flex-col items-center gap-2 text-center">
              <RefreshCcw className="h-5 w-5" />
              Manual retrain + rollback queue arrives next iteration.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


