import type { Metadata } from 'next';
import VoiceArModeration from '@/components/dashboard/VoiceArModeration';
import { Badge } from '@/components/ui/badge';
import { voiceIntentStats, voiceErrorStats, regionPolicies } from '@/lib/admin-data';

export const metadata: Metadata = {
  title: 'Voice & AR Moderation - Easy11 Admin',
  description: 'Review voice intents, AR assets, and regional policies.',
};

const voiceIntentTotal = voiceIntentStats.reduce((sum, stat) => sum + stat.count24h, 0);
const voiceErrorTotal = voiceErrorStats.reduce((sum, stat) => sum + stat.count24h, 0);
const regionsPaused = regionPolicies.filter((policy) => !policy.voiceEnabled).length;

export default function VoiceArPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Voice & AR Moderation
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Privacy-safe insights across voice interactions and AR assets. Only metadata is stored;
            raw audio/video never leaves the device.
          </p>
        </div>
        <Badge className="rounded-full bg-cyan-600 px-4 py-2 text-sm text-white">
          Region policy sync: 12 min ago
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Voice intents (24h)"
          value={voiceIntentTotal.toLocaleString()}
          description="Command volume across all regions"
        />
        <SummaryCard
          title="Voice error rate"
          value={
            voiceIntentTotal === 0
              ? '0%'
              : `${((voiceErrorTotal / voiceIntentTotal) * 100).toFixed(1)}%`
          }
          description={`${voiceErrorTotal.toLocaleString()} errors across ASR/NLU`}
        />
        <SummaryCard
          title="Regions paused"
          value={`${regionsPaused}`}
          description="Voice channels pending privacy approval"
        />
      </div>

      <VoiceArModeration />
    </div>
  );
}

type SummaryCardProps = {
  title: string;
  value: string;
  description: string;
};

function SummaryCard({ title, value, description }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-4 text-sm text-slate-600 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 dark:text-slate-300">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs">{description}</p>
    </div>
  );
}

import type { Metadata } from 'next';
import { AudioLines, Camera, MonitorSmartphone, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Voice & AR Moderation - Easy11 Admin',
  description: 'Review voice intents, AR assets, and regional policies.',
};

const voiceSummary = [
  { label: 'Voice intents today', value: '12,483', detail: '↑ 18% vs. 7-day avg' },
  { label: 'Error rate', value: '4.3%', detail: 'ASR rejects trending down' },
  { label: 'Regions paused', value: '1 (DE)', detail: 'Awaiting privacy review' },
];

const arQuality = [
  {
    vendor: 'AR-1845',
    asset: 'Nimbus Sunglasses GLB',
    grade: 'B',
    action: 'Lighting issues detected',
  },
  {
    vendor: 'AR-2051',
    asset: 'Aurora Runner USDZ',
    grade: 'A',
    action: 'Approved automatically',
  },
  {
    vendor: 'AR-1984',
    asset: 'Voyager Backpack GLB',
    grade: 'Review',
    action: 'Manual moderation required',
  },
];

export default function VoiceArPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Voice & AR Moderation
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Privacy-safe insights across voice interactions and AR assets. Only metadata is stored;
            raw audio/video never leaves the device.
          </p>
        </div>
        <Badge className="rounded-full bg-cyan-600 px-4 py-2 text-sm text-white">
          Region policy sync: 12 min ago
        </Badge>
      </div>

      <Card className="border border-slate-200/70 dark:border-slate-800/60">
        <CardHeader>
          <CardTitle>Voice console</CardTitle>
          <CardDescription>High-level stats (intent heatmap arrives next phase).</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {voiceSummary.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200/80 px-4 py-3 dark:border-slate-700"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                {item.label}
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                {item.value}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-300">{item.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-slate-200/70 dark:border-slate-800/60">
          <CardHeader>
            <CardTitle>AR asset review queue</CardTitle>
            <CardDescription>Sandbox viewer integration scheduled for Week 4.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {arQuality.map((asset) => (
              <div
                key={asset.asset}
                className="flex items-start justify-between rounded-2xl border border-slate-200/80 px-4 py-3 text-sm dark:border-slate-700"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{asset.asset}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">
                    Vendor {asset.vendor} · {asset.action}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {asset.grade}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-slate-200/70 dark:border-slate-800/60">
          <CardHeader>
            <CardTitle>Policy toggles</CardTitle>
            <CardDescription>Region & channel switches land with RBAC in Sprint 17.</CardDescription>
          </CardHeader>
          <CardContent className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-400 dark:border-slate-700">
            <div className="flex flex-col items-center gap-3 text-center">
              <ShieldCheck className="h-5 w-5" />
              Policy control UI placeholder · step-up approvals required for production.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200/70 dark:border-slate-800/60">
        <CardHeader>
          <CardTitle>Device coverage & privacy notes</CardTitle>
          <CardDescription>Summary for product, compliance, and support teams.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3 text-sm text-slate-600 dark:text-slate-300">
          <div className="rounded-2xl border border-slate-200/80 px-4 py-3 dark:border-slate-700">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
              <AudioLines className="h-3.5 w-3.5" />
              Voice
            </p>
            <p className="mt-2">
              Apple Speech + Azure fallback. No raw transcripts stored; intents only.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 px-4 py-3 dark:border-slate-700">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
              <Camera className="h-3.5 w-3.5" />
              AR Assets
            </p>
            <p className="mt-2">
              Vendors upload GLB/USDZ with automated quality grading. Manual moderation queue fed by
              SafeScan.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 px-4 py-3 dark:border-slate-700">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
              <MonitorSmartphone className="h-3.5 w-3.5" />
              Device Matrix
            </p>
            <p className="mt-2">
              Baseline coverage: iOS (ARKit), Android (ARCore). Desktop fallback uses 2D overlays and
              privacy banners.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


