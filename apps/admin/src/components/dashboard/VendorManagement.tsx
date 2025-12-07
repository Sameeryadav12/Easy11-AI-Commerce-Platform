'use client';

import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Search, ShieldAlert, ShieldCheck, Zap, RefreshCcw, Ban, Check } from 'lucide-react';
import {
  vendorDirectory,
  vendorFraudWatchlist,
  type VendorRecord,
  type VendorStatus,
  type VendorWatchItem,
} from '@/lib/admin-data';
import { recordAuditEvent, type AuditEvent } from '@/lib/audit';
import type { AdminRole } from '@/lib/rbac';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type VendorAction = 'approve' | 'suspend' | 'escalate';
type WatchlistAction = 'mark_safe' | 'escalate';

const STATUS_FILTERS: { label: string; value: VendorStatus | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Under Review', value: 'Under Review' },
  { label: 'Suspended', value: 'Suspended' },
  { label: 'Pending', value: 'Pending' },
];

const riskBg = (score: number) => {
  if (score >= 75) return 'bg-rose-500/10 text-rose-500';
  if (score >= 50) return 'bg-amber-500/10 text-amber-500';
  return 'bg-emerald-500/10 text-emerald-500';
};

export default function VendorManagement() {
  const { data: session } = useSession();
  const actorRole = ((session?.user as { role?: AdminRole })?.role ?? 'support_agent') as AdminRole;
  const actorId = (session?.user as { id?: string })?.id ?? 'unknown-admin';
  const actorEmail = session?.user?.email ?? undefined;

  const [vendors, setVendors] = useState<VendorRecord[]>(() =>
    vendorDirectory.map((vendor) => ({ ...vendor }))
  );
  const [watchItems, setWatchItems] = useState<VendorWatchItem[]>(() => [...vendorFraudWatchlist]);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<VendorStatus | 'All'>('All');

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesSearch =
        !search ||
        vendor.name.toLowerCase().includes(search.toLowerCase()) ||
        vendor.id.toLowerCase().includes(search.toLowerCase()) ||
        vendor.category.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'All' || vendor.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [vendors, search, statusFilter]);

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
        success: 'Action recorded in audit log',
        error: 'Failed to record audit event',
      });
      setAuditTrail((prev) => [event, ...prev].slice(0, 8));
    } catch (error) {
      console.error(error);
    }
  };

  const handleVendorAction = async (vendorId: string, action: VendorAction) => {
    setVendors((prev) =>
      prev.map((vendor) => {
        if (vendor.id !== vendorId) return vendor;
        if (action === 'approve') {
          return {
            ...vendor,
            status: 'Active',
            kycStatus: 'Verified',
            lastAction: 'Approved by admin · just now',
            riskScore: Math.max(vendor.riskScore - 10, 5),
          };
        }
        if (action === 'suspend') {
          return {
            ...vendor,
            status: 'Suspended',
            lastAction: 'Suspended pending review · just now',
            riskScore: Math.min(vendor.riskScore + 15, 99),
          };
        }
        return {
          ...vendor,
          status: 'Under Review',
          lastAction: 'Escalated to compliance · just now',
          riskScore: Math.min(vendor.riskScore + 5, 99),
        };
      })
    );

    await handleAudit({
      action: `vendor.${action}`,
      resource: `vendor:${vendorId}`,
      metadata: {
        action,
        vendorId,
      },
    });

    if (action === 'approve') {
      toast.success('Vendor approved');
    } else if (action === 'suspend') {
      toast.error('Vendor suspended');
    } else {
      toast.success('Vendor escalated for review');
    }
  };

  const handleWatchlistAction = async (item: VendorWatchItem, action: WatchlistAction) => {
    if (action === 'mark_safe') {
      setWatchItems((prev) => prev.filter((watch) => watch.vendorId !== item.vendorId));
      await handleAudit({
        action: 'watchlist.mark_safe',
        resource: `vendor:${item.vendorId}`,
        metadata: { reason: item.reason, riskScore: item.riskScore },
      });
      toast.success('Vendor removed from watchlist');
    } else {
      setWatchItems((prev) =>
        prev.map((watch) =>
          watch.vendorId === item.vendorId ? { ...watch, triageStatus: 'Escalated' } : watch
        )
      );
      await handleAudit({
        action: 'watchlist.escalate',
        resource: `vendor:${item.vendorId}`,
        metadata: { reason: item.reason, riskScore: item.riskScore },
      });
      toast.error('Vendor escalation recorded');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Vendor directory</CardTitle>
            <CardDescription>
              Search, triage, and action the Easy11 vendor network. All actions trigger audit events.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-40 bg-transparent placeholder:text-slate-400 focus:outline-none"
                placeholder="Search vendors…"
              />
            </div>
            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  className={cnFilter(statusFilter === filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 bg-white text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Vendor</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Sales (24h)</th>
                  <th className="px-4 py-3 text-left">Refunds</th>
                  <th className="px-4 py-3 text-left">Risk score</th>
                  <th className="px-4 py-3 text-left">Last action</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{vendor.name}</span>
                        <span className="text-xs text-slate-500">
                          {vendor.id} · {vendor.category} · {vendor.location}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="rounded-full border-slate-200 text-xs">
                        {vendor.status}
                      </Badge>
                      <p className="text-[11px] text-slate-400">KYC: {vendor.kycStatus}</p>
                    </td>
                    <td className="px-4 py-3">${vendor.sales24h.toLocaleString()}</td>
                    <td className="px-4 py-3">{(vendor.refundsRate * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3">
                      <span className={cnRiskBadge(riskBg(vendor.riskScore))}>
                        {vendor.riskScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{vendor.lastAction}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-emerald-200 text-emerald-600"
                          onClick={() => handleVendorAction(vendor.id, 'approve')}
                          disabled={loadingStatus(actorRole, 'approve')}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-amber-200 text-amber-600"
                          onClick={() => handleVendorAction(vendor.id, 'escalate')}
                        >
                          <RefreshCcw className="mr-1 h-4 w-4" />
                          Escalate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-rose-200 text-rose-600"
                          onClick={() => handleVendorAction(vendor.id, 'suspend')}
                        >
                          <Ban className="mr-1 h-4 w-4" />
                          Suspend
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredVendors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">
                      No vendors match the current filters. Try adjusting your search or status.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fraud watchlist</CardTitle>
            <CardDescription>
              AI surfaced vendors needing manual review. Mark safe or escalate directly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {watchItems.length === 0 && (
              <div className="rounded-2xl border border-emerald-200/50 bg-emerald-500/10 px-4 py-6 text-center text-sm text-emerald-600">
                All caught-up! No active fraud alerts.
              </div>
            )}
            {watchItems.map((item) => (
              <div
                key={item.vendorId}
                className="rounded-2xl border border-amber-200/60 bg-amber-50 px-4 py-4 text-sm text-slate-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{item.vendorName}</p>
                    <p className="text-xs text-slate-500">
                      Risk {item.riskScore} · {item.triageStatus} ·{' '}
                      {new Date(item.triggeredAt).toLocaleString()}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{item.reason}</p>
                  </div>
                  <ShieldAlert className="h-5 w-5 text-amber-500" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-emerald-200 text-emerald-600"
                    onClick={() => handleWatchlistAction(item, 'mark_safe')}
                    disabled={loadingStatus(actorRole, 'approve')}
                  >
                    <ShieldCheck className="mr-1 h-4 w-4" />
                    Mark safe
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-rose-200 text-rose-600"
                    onClick={() => handleWatchlistAction(item, 'escalate')}
                  >
                    <Zap className="mr-1 h-4 w-4" />
                    Escalate
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent admin actions</CardTitle>
            <CardDescription>
              Snapshot of the most recent actions taken in this session (hash chain verified).
            </CardDescription>
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
                  className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{event.action}</p>
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

function cnFilter(active: boolean) {
  return [
    'rounded-full px-3 py-1 text-xs font-medium transition',
    active
      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800',
  ].join(' ');
}

function cnRiskBadge(baseClass: string) {
  return `inline-flex min-w-[3rem] justify-center rounded-full px-2 py-1 text-xs font-semibold ${baseClass}`;
}

function loadingStatus(role: AdminRole, action: VendorAction) {
  if (role === 'support_agent' && (action === 'approve' || action === 'suspend')) {
    return true;
  }
  return false;
}


