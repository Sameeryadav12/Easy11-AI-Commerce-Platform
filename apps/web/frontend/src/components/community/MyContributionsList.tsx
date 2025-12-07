import { ClipboardList, ExternalLink } from 'lucide-react';
import { Card, CardBody, Badge } from '../ui';
import type { Contribution } from '../../types/community';

interface MyContributionsListProps {
  contributions: Contribution[];
}

const statusStyles: Record<Contribution['status'], string> = {
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200',
  rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200',
  flagged: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200',
};

export function MyContributionsList({ contributions }: MyContributionsListProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
          <ClipboardList className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-blue-500 dark:text-blue-300">
            Contribution history
          </p>
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            Your community impact
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track reviews, answers, and looks you’ve shared, plus loyalty rewards earned.
          </p>
        </div>
      </div>

      <Card>
        <CardBody className="divide-y divide-gray-100 p-0 dark:divide-gray-800">
          {contributions.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
              You haven’t contributed yet. Leave a review, answer a question, or share a look to start earning rewards.
            </div>
          ) : (
            contributions.map((contribution) => (
              <a
                key={contribution.id}
                href={contribution.link}
                className="block transition hover:bg-gray-50 dark:hover:bg-gray-900/60"
              >
                <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500">
                      <span>{contribution.type}</span>
                      <span>•</span>
                      <span>{new Date(contribution.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {contribution.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {contribution.productName}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[contribution.status]}`}
                      >
                        {contribution.status}
                      </span>
                      {typeof contribution.rewardPoints === 'number' && (
                        <Badge variant="success" size="sm">
                          +{contribution.rewardPoints} pts
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-300">
                    View
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
              </a>
            ))
          )}
        </CardBody>
      </Card>
    </section>
  );
}


