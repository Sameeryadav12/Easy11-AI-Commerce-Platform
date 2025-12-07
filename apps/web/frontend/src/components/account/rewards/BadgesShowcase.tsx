import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import type { LoyaltyBadge } from '../../../types/rewards';

interface BadgesShowcaseProps {
  badges: LoyaltyBadge[];
  limit?: number;
}

const rarityStyles: Record<
  LoyaltyBadge['rarity'],
  { border: string; text: string; shimmer: string }
> = {
  common: {
    border: 'border-gray-200 dark:border-gray-700',
    text: 'text-gray-600 dark:text-gray-300',
    shimmer: 'bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800',
  },
  rare: {
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-600 dark:text-blue-300',
    shimmer: 'bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 dark:from-blue-900/40 dark:via-blue-800/40 dark:to-blue-900/40',
  },
  epic: {
    border: 'border-purple-300 dark:border-purple-700',
    text: 'text-purple-600 dark:text-purple-300',
    shimmer: 'bg-gradient-to-r from-purple-100 via-pink-50 to-purple-100 dark:from-purple-900/40 dark:via-pink-800/30 dark:to-purple-900/40',
  },
};

export function BadgesShowcase({ badges, limit }: BadgesShowcaseProps) {
  const visibleBadges = limit ? badges.slice(0, limit) : badges;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 p-3 text-white shadow-lg">
          <Trophy className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
            Your achievements
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showcase badges earned across challenges, referrals, and loyalty milestones.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleBadges.map((badge) => {
          const styles = rarityStyles[badge.rarity];
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`relative overflow-hidden rounded-2xl border ${styles.border} bg-white dark:bg-gray-800 p-5 shadow-sm`}
            >
              <div className={`absolute inset-x-0 top-0 h-1 ${styles.shimmer}`} />
              <div className="flex items-start justify-between gap-3">
                <span className="text-3xl" aria-hidden="true">
                  {badge.icon}
                </span>
                <span
                  className={`rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide dark:bg-gray-700 ${styles.text}`}
                >
                  {badge.rarity}
                </span>
              </div>
              <h4 className="mt-4 text-lg font-heading font-semibold text-gray-900 dark:text-white">
                {badge.name}
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {badge.description}
              </p>
              <p className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                {badge.earnedOn
                  ? `Earned ${new Date(badge.earnedOn).toLocaleDateString()}`
                  : 'Locked — complete upcoming challenges to unlock.'}
              </p>
            </motion.div>
          );
        })}
        {visibleBadges.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete challenges, invite friends, or hit tier milestones to start earning badges.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}


