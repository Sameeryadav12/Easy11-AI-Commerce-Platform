 'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { AlertTriangle, Archive, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';
import {
  sarQueue,
  consentSnapshot,
  retentionPolicies,
  type SarRequest,
  type RetentionPolicy,
} from '@/lib/admin-data';
import { recordAuditEvent, type AuditEvent } from '@/lib/audit';
import type { AdminRole } from '@/lib/rbac';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ACTION_ROLES: AdminRole[] = ['system_admin', 'compliance_officer'];

export default function ComplianceConsole() {
  const { data: session } = useSession();
  const actorRole = ((session?.user as { role?: AdminRole })?.role ?? 'support_agent') as AdminRole;
  const actorId = (session?.user as { id?: string })?.id ?? 'unknown-admin';
  const actorEmail = session?.user?.email ?? undefined;

  const [requests, setRequests] = useState<SarRequest[]>(() => sarQueue.map((sar) => ({ ...sar })));
  const [policies, setPolicies] = useState<RetentionPolicy[]>(() =>
    retentionPolicies.map((policy) => ({ ...policy }))
  );
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>([]);

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
        loading: 'Recording compliance log…',
        success: 'Audit entry created',
        error: 'Failed to record audit event',
      });
      setAuditTrail((prev) => [event, ...prev].slice(0, 8));
    } catch (error) {
      console.error(error);
    }
  };

  const updateSarStatus = async (sarId: string, status: SarRequest['status']) => {
    if (!canPerformActions) {
      toast.error('Your role cannot update SARs');
      return;
    }

    setRequests((prev) =>
      prev.map((sar) =>
        sar.id === sarId
          ? {
              ...sar,
              status,
              notes:
                status === 'Completed'
                  ? [...sar.notes, 'Export delivered & hash recorded']
                  : [...sar.notes, `Status changed to ${status}`],
            }
          : sar
      )
    );

    await handleAudit({
      action: 'compliance.sar.update_status',
      resource: `sar:${sarId}`,
      metadata: { status },
    });

    toast.success(`SAR ${sarId} marked ${status}`);
  };

  const triggerRetentionRun = async (policyType: string) => {
    if (!canPerformActions) {
      toast.error('Your role cannot trigger retention tasks');
      return;
    }

    await handleAudit({
      action: 'compliance.retention.trigger',
      resource: `retention:${policyType}`,
      metadata: { policyType },
    });

    toast.success('Retention automation task dispatched');
  };

  const togglePolicyStatus = async (policyType: string) => {
    if (!canPerformActions) {
      toast.error('Your role cannot modify retention policies');
      return;
    }

    setPolicies((prev) =>
      prev.map((policy) =>
        policy.dataType === policyType
          ? {
              ...policy,
              status: policy.status === 'Enforced' ? 'Pending' : 'Enforced',
              lastUpdated: new Date().toISOString(),
            }
          : policy
      )
    );

    await handleAudit({
      action: 'compliance.retention.toggle',
      resource: `retention:${policyType}`,
      metadata: {},
    });
    toast.success('Policy status updated');
  };

  const disabledMessage = !canPerformActions
    ? 'Requires System Admin or Compliance Officer role'
    : undefined;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Open SARs"
          value={requests.filter((sar) => sar.status !== 'Completed').length.toString()}
          description="Must be resolved within 7 days"
        />
        <SummaryCard
          title="Completed SARs (24h)"
          value={requests.filter((sar) => sar.status === 'Completed').length.toString()}
          description="Auto-hashed exports available"
        />
        <SummaryCard
          title="Retention policies"
          value={`${policies.filter((policy) => policy.status === 'Enforced').length} enforced`}
          description="Automation via Prefect scheduled weekly"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject access requests</CardTitle>
          <CardDescription>Track SARs, approvals, and export status by region.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {requests.map((sar) => (
            <div
              key={sar.id}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {sar.id} · {sar.region}
                  </p>
                  <p className="text-xs text-slate-500">
                    Requested by {sar.requestedBy} ·{' '}
                    {new Date(sar.submittedAt).toLocaleString()}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Owner: {sar.owner} · {sar.status}
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-slate-500">
                    {sar.notes.map((note, index) => (
                      <p key={note + index}>• {note}</p>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-emerald-200 text-emerald-600"
                    onClick={() => updateSarStatus(sar.id, 'Processing')}
                    disabled={!canPerformActions}
                    title={disabledMessage}
                  >
                    <FileText className="mr-1 h-4 w-4" />
                    Processing
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-slate-300 text-slate-600"
                    onClick={() => updateSarStatus(sar.id, 'Completed')}
                    disabled={!canPerformActions}
                    title={disabledMessage}
                  >
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    Complete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Consent snapshot</CardTitle>
            <CardDescription>Aggregated opt-in rates across key privacy buckets.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {consentSnapshot.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                  {item.value}
                </p>
                <p className="text-xs text-slate-500">{item.delta}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retention policies</CardTitle>
            <CardDescription>Define automated retention rules per data type.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            {policies.map((policy) => (
              <div
                key={policy.dataType}
                className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {policy.dataType}
                    </p>
                    <p className="text-xs text-slate-500">
                      Retention: {policy.retention}
                    </p>
                    <p className="text-xs text-slate-500">
                      Updated {new Date(policy.lastUpdated).toLocaleString()}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">{policy.notes}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={policy.status === 'Enforced' ? 'border-emerald-200 text-emerald-600' : 'border-amber-200 text-amber-600'}
                  >
                    {policy.status}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-slate-300 text-slate-600"
                    onClick={() => togglePolicyStatus(policy.dataType)}
                    disabled={!canPerformActions}
                    title={disabledMessage}
                  >
                    <ShieldCheck className="mr-1 h-4 w-4" />
                    Toggle status
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-blue-200 text-blue-600"
                    onClick={() => triggerRetentionRun(policy.dataType)}
                    disabled={!canPerformActions}
                    title={disabledMessage}
                  >
                    <Archive className="mr-1 h-4 w-4" />
                    Trigger run
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance audit timeline</CardTitle>
          <CardDescription>Immutable record of recent SAR and retention actions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {auditTrail.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              Perform an action to populate the audit timeline.
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


