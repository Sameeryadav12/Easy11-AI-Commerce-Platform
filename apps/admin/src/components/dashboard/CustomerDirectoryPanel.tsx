'use client';

import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Filter, Search, AlertTriangle, Mail, RefreshCcw, UserX } from 'lucide-react';
import {
  customerDirectory,
  type CustomerRecord,
  customerSegments,
} from '@/lib/admin-data';
import { recordAuditEvent, type AuditEvent } from '@/lib/audit';
import type { AdminRole } from '@/lib/rbac';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type RiskFilter = 'all' | 'high' | 'medium' | 'low';
type CustomerAction = 'flag' | 'reset_mfa' | 'send_outreach';

const riskLevel = (risk: number): RiskFilter => {
  if (risk >= 0.7) return 'high';
  if (risk >= 0.4) return 'medium';
  return 'low';
};

const riskBadgeClass = (risk: number) => {
  if (risk >= 0.7) return 'bg-rose-500/10 text-rose-500';
  if (risk >= 0.4) return 'bg-amber-500/10 text-amber-500';
  return 'bg-emerald-500/10 text-emerald-500';
};

export default function CustomerDirectoryPanel() {
  const { data: session } = useSession();
  const actorRole = ((session?.user as { role?: AdminRole })?.role ?? 'support_agent') as AdminRole;
  const actorId = (session?.user as { id?: string })?.id ?? 'unknown-admin';
  const actorEmail = session?.user?.email ?? undefined;

  const [customers, setCustomers] = useState<CustomerRecord[]>(() =>
    customerDirectory.map((customer) => ({ ...customer }))
  );
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');
  const [search, setSearch] = useState('');
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>([]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        !search ||
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.id.toLowerCase().includes(search.toLowerCase());

      const customerRisk = riskLevel(customer.churnRisk);
      const matchesRisk = riskFilter === 'all' || customerRisk === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [customers, riskFilter, search]);

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
        success: 'Action recorded',
        error: 'Failed to record audit event',
      });
      setAuditTrail((prev) => [event, ...prev].slice(0, 8));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCustomerAction = async (customerId: string, action: CustomerAction) => {
    setCustomers((prev) =>
      prev.map((customer) => {
        if (customer.id !== customerId) return customer;
        if (action === 'flag') {
          return {
            ...customer,
            status: 'At Risk',
            interventions: [...customer.interventions, 'Flagged for retention playbook'],
          };
        }
        if (action === 'reset_mfa') {
          return {
            ...customer,
            interventions: [...customer.interventions, 'MFA reset initiated'],
          };
        }
        return {
          ...customer,
          interventions: [...customer.interventions, 'Outreach email scheduled'],
        };
      })
    );

    await handleAudit({
      action: `customer.${action}`,
      resource: `customer:${customerId}`,
      metadata: { action },
    });

    if (action === 'flag') {
      toast.error('Customer flagged for retention');
    } else if (action === 'reset_mfa') {
      toast.success('MFA reset instructions sent');
    } else {
      toast.success('Outreach campaign queued');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Customer directory</CardTitle>
            <CardDescription>
              Search customers, review churn signals, and launch interventions.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-48 bg-transparent placeholder:text-slate-400 focus:outline-none"
                placeholder="Search customers…"
              />
            </div>
            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Filter className="h-3 w-3" />
                Risk
              </span>
              {(['all', 'high', 'medium', 'low'] as RiskFilter[]).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setRiskFilter(filter)}
                  className={riskButtonClass(filter, riskFilter)}
                >
                  {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
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
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Tier</th>
                  <th className="px-4 py-3 text-left">Churn risk</th>
                  <th className="px-4 py-3 text-left">Lifetime value</th>
                  <th className="px-4 py-3 text-left">Last purchase</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{customer.name}</span>
                        <span className="text-xs text-slate-500">
                          {customer.email} · {customer.region} · {customer.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="rounded-full border-slate-200 text-xs">
                        {customer.loyaltyTier}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskBadgeClass(customer.churnRisk)}`}>
                        {(customer.churnRisk * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">${customer.lifetimeValue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(customer.lastPurchase).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={customer.status === 'At Risk' ? 'border-amber-200 text-amber-600' : customer.status === 'Lost' ? 'border-rose-200 text-rose-600' : 'border-emerald-200 text-emerald-600'}
                      >
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-rose-200 text-rose-600"
                          onClick={() => handleCustomerAction(customer.id, 'flag')}
                        >
                          <AlertTriangle className="mr-1 h-4 w-4" />
                          Flag
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-blue-200 text-blue-600"
                          onClick={() => handleCustomerAction(customer.id, 'reset_mfa')}
                        >
                          <RefreshCcw className="mr-1 h-4 w-4" />
                          Reset MFA
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-emerald-200 text-emerald-600"
                          onClick={() => handleCustomerAction(customer.id, 'send_outreach')}
                        >
                          <Mail className="mr-1 h-4 w-4" />
                          Outreach
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">
                      No customers match the current filters.
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
            <CardTitle>Segment overview</CardTitle>
            <CardDescription>Target segments surfaced by RFM modelling.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {customerSegments.map((segment) => (
              <div
                key={segment.name}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {segment.name}
                </p>
                <p className="text-xs text-slate-500">
                  Members: {segment.count.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">
                  Avg value: ${segment.avgValue.toLocaleString()}
                </p>
                <p className="mt-2 text-xs text-slate-500">{segment.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Action timeline</CardTitle>
            <CardDescription>Most recent interventions captured in the immutable audit log.</CardDescription>
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
                  className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
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

function riskButtonClass(filter: RiskFilter, current: RiskFilter) {
  const base = 'rounded-full px-3 py-1 text-xs font-medium transition';
  if (filter === current) {
    return `${base} bg-slate-900 text-white dark:bg-white dark:text-slate-900`;
  }
  return `${base} text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800`;
}


