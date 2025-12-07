import { Badge } from '../../components/ui';
import type { RefundSummary } from '../../types/vendor';

interface RefundSummaryCardProps {
  refund?: RefundSummary;
}

export function RefundSummaryCard({ refund }: RefundSummaryCardProps) {
  if (!refund) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/40 dark:bg-amber-900/20">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300">Refund initiated</p>
          <p className="text-lg font-heading font-semibold text-amber-900 dark:text-amber-100">
            {refund.amount.toLocaleString(undefined, { style: 'currency', currency: refund.currency })}
          </p>
        </div>
        <Badge variant="warning" size="sm">
          {refund.status}
        </Badge>
      </div>
      <div className="mt-2 text-xs text-amber-800/80 dark:text-amber-200/80">
        <p>Initiated: {new Date(refund.initiated_at).toLocaleString()}</p>
        {refund.processed_at && <p>Processed: {new Date(refund.processed_at).toLocaleString()}</p>}
        {refund.reason && <p>Reason: {refund.reason}</p>}
      </div>
    </div>
  );
}


