import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, DownloadCloud, Calendar } from 'lucide-react';
import { Button, Card, CardBody, CardHeader } from '../../components/ui';
import { useRewardsStore } from '../../store/rewardsStore';
import { useOrdersStore } from '../../store/ordersStore';
import type { RewardTransaction, RewardTransactionType } from '../../types/rewards';

const typeLabels: Record<RewardTransactionType, string> = {
  earned: 'Earned',
  redeemed: 'Redeemed',
  reversed: 'Reversed',
  expired: 'Expired',
};

function getTransactionLabel(txn: RewardTransaction): string {
  if (txn.type === 'earned' && txn.status === 'pending') return 'Earned (pending)';
  if (txn.type === 'earned' && txn.status === 'available') return 'Earned (available)';
  return typeLabels[txn.type];
}

export default function RewardsHistoryPage() {
  const { transactions, summary, ledger, syncFromOrders } = useRewardsStore((state) => ({
    transactions: state.transactions,
    summary: state.summary,
    ledger: state.ledger,
    syncFromOrders: state.syncFromOrders,
  }));
  const orders = useOrdersStore((state) => state.orders);

  // Account-based: backfill ledger from orders when empty so history shows after login.
  useEffect(() => {
    if (ledger.length === 0 && orders.length > 0) syncFromOrders(orders);
  }, [ledger.length, orders, syncFromOrders]);

  const [typeFilter, setTypeFilter] = useState<'all' | RewardTransactionType | 'earned_pending' | 'earned_available'>('all');
  const [rangeFilter, setRangeFilter] = useState<'30' | '90' | '365'>('30');

  const filteredTransactions = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - Number(rangeFilter));

    return transactions.filter((txn) => {
      const date = new Date(txn.date);
      if (date < cutoff) return false;
      if (typeFilter === 'earned_pending' && (txn.type !== 'earned' || txn.status !== 'pending')) return false;
      if (typeFilter === 'earned_available' && (txn.type !== 'earned' || txn.status !== 'available')) return false;
      if (typeFilter !== 'all' && typeFilter !== 'earned_pending' && typeFilter !== 'earned_available' && txn.type !== typeFilter) return false;
      return true;
    });
  }, [transactions, typeFilter, rangeFilter]);

  const handleExport = () => {
    const header = 'Date,Type,Points,Description,Order ID\n';
    const rows = filteredTransactions
      .map((txn) =>
        [
          new Date(txn.date).toISOString(),
          getTransactionLabel(txn),
          txn.points,
          `"${(txn.description ?? '').replace(/"/g, '""')}"`,
          txn.orderId ?? '',
        ].join(',')
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `easy11-points-history-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-teal-500 dark:text-teal-300">
              Ledger · Sprint 4
            </p>
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Points history & ledger
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
              Audit every earn and redemption event. Export your ledger for financial records or support.
            </p>
          </div>
          <Button variant="secondary" onClick={handleExport} className="flex items-center gap-2">
            <DownloadCloud className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <Card>
          <CardBody className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
            <LedgerSummary label="Available points" value={summary.availablePoints.toLocaleString()} detail="Ready to redeem" />
            <LedgerSummary
              label="Estimated value"
              value={`$${summary.estimatedValue.toFixed(2)}`}
              detail="1 point = $0.01 store credit"
            />
            <LedgerSummary
              label="Pending points"
              value={summary.pendingPoints.toLocaleString()}
              detail="Unlocks after delivery (prevents abuse from returns/cancels)"
            />
            <LedgerSummary
              label="Expiring soon"
              value={summary.expiringPoints ? summary.expiringPoints.toLocaleString() : '0'}
              detail={summary.expiringOn ? `On ${new Date(summary.expiringOn).toLocaleDateString()}` : 'Nothing expiring'}
            />
          </CardBody>
        </Card>
      </motion.div>

      <Card>
        <CardHeader className="flex flex-col gap-4 border-b border-gray-100 px-6 py-5 dark:border-gray-800 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter ledger</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'earned_pending', 'earned_available', 'earned', 'redeemed', 'reversed', 'expired'] as const).map((type) => (
              <Button
                key={type}
                variant={typeFilter === type ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTypeFilter(type)}
              >
                {type === 'all' ? 'All activity' : type === 'earned_pending' ? 'Earned (pending)' : type === 'earned_available' ? 'Earned (available)' : typeLabels[type as RewardTransactionType]}
              </Button>
            ))}
            <div className="ml-2 flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              <Calendar className="h-4 w-4" />
              <select
                value={rangeFilter}
                onChange={(event) => setRangeFilter(event.target.value as '30' | '90' | '365')}
                className="bg-transparent text-sm outline-none"
              >
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last 12 months</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardBody className="divide-y divide-gray-100 p-0 dark:divide-gray-800">
          {filteredTransactions.length === 0 && (
            <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No events in this window. Adjust filters to see more history.
            </div>
          )}

          {filteredTransactions.map((txn) => (
            <div key={txn.id} className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{txn.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(txn.date).toLocaleString()} ·{' '}
                  {getTransactionLabel(txn)}
                  {txn.orderId ? ` · Order #${txn.orderId}` : ''}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`text-sm font-semibold ${
                    txn.points > 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'
                  }`}
                >
                  {txn.points > 0 ? '+' : ''}
                  {txn.points}
                </span>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}

interface LedgerSummaryProps {
  label: string;
  value: string;
  detail: string;
}

function LedgerSummary({ label, value, detail }: LedgerSummaryProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-heading font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{detail}</p>
    </div>
  );
}


