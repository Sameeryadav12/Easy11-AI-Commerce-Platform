'use client';

import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import {
  AudioLines,
  BarChart3,
  CircleCheck,
  CircleSlash2,
  Globe,
  LineChartIcon,
  MicVocal,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import {
  voiceIntentStats,
  voiceErrorStats,
  regionPolicies,
  arReviewQueue,
  type RegionPolicyState,
  type ArAssetReview,
} from '@/lib/admin-data';
import { recordAuditEvent, type AuditEvent } from '@/lib/audit';
import type { AdminRole } from '@/lib/rbac';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type RegionAction = 'toggle_voice' | 'toggle_ar';
type ArAction = 'approve' | 'reject' | 'escalate';

const ACTION_ROLES: AdminRole[] = ['system_admin', 'ai_manager', 'compliance_officer'];

export default function VoiceArModeration() {
  const { data: session } = useSession();
  const actorRole = ((session?.user as { role?: AdminRole })?.role ?? 'support_agent') as AdminRole;
  const actorId = (session?.user as { id?: string })?.id ?? 'unknown-admin';
  const actorEmail = session?.user?.email ?? undefined;

  const [policies, setPolicies] = useState<RegionPolicyState[]>(() =>
    regionPolicies.map((policy) => ({ ...policy }))
  );
  const [assets, setAssets] = useState<ArAssetReview[]>(() =>
    arReviewQueue.map((asset) => ({ ...asset }))
  );
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>([]);

  const totalVoiceIntents = voiceIntentStats.reduce((sum, stat) => sum + stat.count24h, 0);
  const totalVoiceErrors = voiceErrorStats.reduce((sum, error) => sum + error.count24h, 0);

  const overallSuccessRate = totalVoiceIntents
    ? ((totalVoiceIntents - totalVoiceErrors) / totalVoiceIntents) * 100
    : 0;

  const canPerformActions = ACTION_ROLES.includes(actorRole);

  const handleAudit = async ({
    action,
    resource,
    metadata,
  }: {
    action: string;
    resource: string;
    metadata?: Record<string, unknown>;
  }) => {
    const eventPromise = recordAuditEvent({
      actorId,
      actorRole,
      actorEmail,
      action,
      resource,
      metadata,
    });

    try {
      const event = await toast.promise(eventPromise, {
        loading: 'Recording audit trail…',
        success: 'Action captured in audit log',
        error: 'Failed to record audit event',
      });
      setAuditTrail((prev) => [event, ...prev].slice(0, 8));
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegionAction = async (
    region: string,
    action: RegionAction,
    enabled: boolean
  ) => {
    if (!canPerformActions) {
      toast.error('Your role cannot modify region policies');
      return;
    }

    setPolicies((prev) =>
      prev.map((policy) => {
        if (policy.region !== region) return policy;
        if (action === 'toggle_voice') {
          return {
            ...policy,
            voiceEnabled: enabled,
            lastUpdated: new Date().toISOString(),
            note: enabled
              ? 'Voice re-enabled by admin'
              : 'Voice disabled pending review',
          };
        }
        return {
          ...policy,
          arEnabled: enabled,
          lastUpdated: new Date().toISOString(),
          note: enabled
            ? 'AR re-enabled by admin'
            : 'AR disabled pending asset audit',
        };
      })
    );

    await handleAudit({
      action: `voice_ar.policy.${action}`,
      resource: `region:${region}`,
      metadata: { enabled, action },
    });

    toast.success(
      `${action === 'toggle_voice' ? 'Voice' : 'AR'} ${
        enabled ? 'enabled' : 'disabled'
      } for ${region}`
    );
  };

  const handleAssetAction = async (assetId: string, action: ArAction) => {
    if (!canPerformActions) {
      toast.error('Your role cannot moderate AR assets');
      return;
    }

    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.assetId !== assetId) return asset;
        if (action === 'approve') {
          return { ...asset, status: 'Approved', issues: [] };
        }
        if (action === 'reject') {
          return { ...asset, status: 'Rejected' };
        }
        return { ...asset, status: 'Pending', issues: [...asset.issues, 'Escalated to safety team'] };
      })
    );

    await handleAudit({
      action: `voice_ar.asset.${action}`,
      resource: `ar_asset:${assetId}`,
      metadata: { action },
    });

    if (action === 'approve') {
      toast.success('Asset approved for production');
    } else if (action === 'reject') {
      toast.error('Asset rejected and vendor notified');
    } else {
      toast.success('Asset escalated to safety review');
    }
  };

  const disabledMessage = !canPerformActions
    ? 'Requires System Admin, AI Manager, or Compliance Officer role'
    : undefined;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Voice intents (24h)"
          value={totalVoiceIntents.toLocaleString()}
          icon={MicVocal}
          tone="text-sky-500"
          description="Across all supported locales"
        />
        <StatCard
          title="Voice success rate"
          value={`${overallSuccessRate.toFixed(1)}%`}
          icon={LineChartIcon}
          tone="text-emerald-500"
          description={`${totalVoiceErrors.toLocaleString()} errors recorded`}
        />
        <StatCard
          title="Regions with voice on"
          value={policies.filter((policy) => policy.voiceEnabled).length.toString()}
          icon={Globe}
          tone="text-blue-500"
          description="Voice access by region policy"
        />
        <StatCard
          title="AR assets pending"
          value={assets.filter((asset) => asset.status === 'Pending').length.toString()}
          icon={BarChart3}
          tone="text-violet-500"
          description="Awaiting moderation review"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Voice intent performance</CardTitle>
          <CardDescription>Top voice commands, success rate, and growth vs. last 24h.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Intent</th>
                <th className="px-4 py-3 text-left">Usage (24h)</th>
                <th className="px-4 py-3 text-left">Success</th>
                <th className="px-4 py-3 text-left">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {voiceIntentStats.map((stat) => (
                <tr key={stat.intent}>
                  <td className="px-4 py-3 font-semibold text-slate-900">{stat.intent}</td>
                  <td className="px-4 py-3">{stat.count24h.toLocaleString()}</td>
                  <td className="px-4 py-3">{(stat.successRate * 100).toFixed(1)}%</td>
                  <td
                    className={`px-4 py-3 ${
                      stat.growth >= 0 ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  >
                    {stat.growth >= 0 ? '+' : ''}
                    {(stat.growth * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Voice error breakdown</CardTitle>
            <CardDescription>Key failure categories requiring follow-up.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {voiceErrorStats.map((error) => (
              <div
                key={error.category}
                className="flex items-center justify-between rounded-2xl border border-rose-200/60 bg-rose-50 px-4 py-3 text-sm text-rose-600"
              >
                <div>
                  <p className="font-semibold text-rose-600">{error.category}</p>
                  <p className="text-xs text-rose-500">
                    {error.count24h.toLocaleString()} over the last 24 hours
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    error.delta >= 0 ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'
                  }`}
                >
                  {error.delta >= 0 ? '+' : ''}
                  {(error.delta * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Region policies</CardTitle>
            <CardDescription>Enable/disable voice and AR access per locale.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {policies.map((policy) => (
              <div
                key={policy.region}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {policy.region}
                    </p>
                    <p className="text-xs text-slate-400">
                      Updated {new Date(policy.lastUpdated).toLocaleString()}
                    </p>
                    {policy.note && (
                      <p className="mt-2 text-xs text-slate-500">{policy.note}</p>
                    )}
                  </div>
                  <Globe className="h-5 w-5 text-slate-400" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={policy.voiceEnabled ? 'default' : 'outline'}
                    className={`rounded-full ${
                      policy.voiceEnabled
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-200'
                    }`}
                    onClick={() => handleRegionAction(policy.region, 'toggle_voice', !policy.voiceEnabled)}
                    disabled={!canPerformActions}
                    title={disabledMessage}
                  >
                    {policy.voiceEnabled ? (
                      <CircleCheck className="mr-1 h-4 w-4" />
                    ) : (
                      <CircleSlash2 className="mr-1 h-4 w-4" />
                    )}
                    Voice {policy.voiceEnabled ? 'On' : 'Off'}
                  </Button>
                  <Button
                    size="sm"
                    variant={policy.arEnabled ? 'default' : 'outline'}
                    className={`rounded-full ${
                      policy.arEnabled
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-200'
                    }`}
                    onClick={() => handleRegionAction(policy.region, 'toggle_ar', !policy.arEnabled)}
                    disabled={!canPerformActions}
                    title={disabledMessage}
                  >
                    {policy.arEnabled ? (
                      <ShieldCheck className="mr-1 h-4 w-4" />
                    ) : (
                      <ShieldAlert className="mr-1 h-4 w-4" />
                    )}
                    AR {policy.arEnabled ? 'On' : 'Off'}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AR asset review queue</CardTitle>
            <CardDescription>Sandbox viewer integration ships in Sprint 17.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {assets.length === 0 ? (
              <div className="rounded-2xl border border-emerald-200/50 bg-emerald-500/10 px-4 py-6 text-center text-sm text-emerald-600">
                No pending AR assets in the queue.
              </div>
            ) : (
              assets.map((asset) => (
                <div
                  key={asset.assetId}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{asset.assetName}</p>
                      <p className="text-xs text-slate-500">
                        {asset.vendorName} · {asset.format} · Submitted{' '}
                        {new Date(asset.submittedAt).toLocaleString()}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        Quality grade: {asset.qualityGrade}
                      </p>
                      {asset.issues.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {asset.issues.map((issue) => (
                            <Badge key={issue} variant="outline" className="rounded-full border-amber-300 text-amber-600">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <AudioLines className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-emerald-200 text-emerald-600"
                      onClick={() => handleAssetAction(asset.assetId, 'approve')}
                      disabled={!canPerformActions}
                      title={disabledMessage}
                    >
                      <CircleCheck className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-rose-200 text-rose-600"
                      onClick={() => handleAssetAction(asset.assetId, 'reject')}
                      disabled={!canPerformActions}
                      title={disabledMessage}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-amber-200 text-amber-600"
                      onClick={() => handleAssetAction(asset.assetId, 'escalate')}
                      disabled={!canPerformActions}
                      title={disabledMessage}
                    >
                      <ShieldAlert className="mr-1 h-4 w-4" />
                      Escalate
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderation audit timeline</CardTitle>
            <CardDescription>Immutable trail of recent policy + asset decisions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {auditTrail.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                Take an action to populate the audit timeline.
              </div>
            ) : (
              auditTrail.map((event) => (
                <div
                  key={event.hash}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{event.action}</p>
                    <p className="text-xs text-slate-500">
                      {event.resource} · {new Date(event.timestamp).toLocaleString()}
                    </p>
                    {event.metadata && (
                      <p className="mt-1 text-xs text-slate-500">
                        {JSON.stringify(event.metadata)}
                      </p>
                    )}
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-slate-500">
                    {event.hash.slice(0, 8)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tone: string;
};

function StatCard({ title, value, description, icon: Icon, tone }: StatCardProps) {
  return (
    <Card className="border border-slate-200/70 dark:border-slate-800/60">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
            {title}
          </CardTitle>
          <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{value}</p>
        </div>
        <Icon className={`h-5 w-5 ${tone}`} />
      </CardHeader>
      <CardContent>
        <p className="text-xs text-slate-500 dark:text-slate-300">{description}</p>
      </CardContent>
    </Card>
  );
}


