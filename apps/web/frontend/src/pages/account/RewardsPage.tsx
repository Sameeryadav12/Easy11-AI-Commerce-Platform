import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Gift,
  Wallet,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Button, Card, CardBody, CardHeader } from '../../components/ui';
import { TierProgressCard } from '../../components/account/rewards/TierProgressCard';
import { BadgesShowcase } from '../../components/account/rewards/BadgesShowcase';
import { useRewardsStore } from '../../store/rewardsStore';
import type { RewardTier } from '../../types/rewards';

const tierBenefits: Record<RewardTier, string[]> = {
  Silver: [
    'Standard shipping included',
    '1× points multiplier on every purchase',
    'Early look at seasonal drops',
  ],
  Gold: [
    'Free returns & priority support',
    '2× multiplier on weekly spotlight categories',
    'Early sale access + member-only events',
  ],
  Platinum: [
    'Express shipping upgrades on every order',
    '4× multiplier weekends and concierge styling',
    'Exclusive product access + anniversary gifts',
  ],
};

export default function RewardsPage() {
  const {
    points,
    tier,
    tierProgress,
    transactions,
    summary,
    tierOverview,
    walletBalance,
    streak,
    challenges,
    badges,
    referralLink,
  } = useRewardsStore((state) => ({
    points: state.points,
    tier: state.tier,
    tierProgress: state.tierProgress,
    transactions: state.transactions,
    summary: state.summary,
    tierOverview: state.tierOverview,
    walletBalance: state.walletBalance,
    streak: state.streak,
    challenges: state.challenges,
    badges: state.badges,
    referralLink: state.referralLink,
  }));
  const refreshRewardsExperience = useRewardsStore((state) => state.refreshRewardsExperience);
  const getPointsToNextTier = useRewardsStore((state) => state.getPointsToNextTier);

  useEffect(() => {
    refreshRewardsExperience();
  }, [refreshRewardsExperience]);

  const pointsToNext = getPointsToNextTier();
  const recentTransactions = useMemo(() => transactions.slice(0, 4), [transactions]);
  const challengeHighlight =
    challenges.daily[0] ?? challenges.weekly[0] ?? challenges.seasonal[0] ?? null;

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blue-500 dark:text-blue-300">
              Loyalty · Sprint 4
            </p>
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Rewards wallet & loyalty insights
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
              Track EasyPoints in real time, unlock higher tiers, and jump straight into challenges,
              referrals, and redemptions.
            </p>
          </div>
          <Link to="/account/rewards/history">
            <Button variant="secondary" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              View full ledger
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <TierProgressCard
            tier={tier}
            points={points}
            pointsToNext={pointsToNext}
            tierProgress={tierProgress}
            streakMultiplier={streak.multiplier}
            aiTip={tierOverview.aiTip}
          />

          <Card>
            <CardHeader className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/40 dark:text-blue-200">
                  <Gift className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                    Recent points activity
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Snapshot of your latest earn and redemption events.
                  </p>
                </div>
              </div>
              <Link
                to="/account/rewards/history"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
              >
                See all
              </Link>
            </CardHeader>
            <CardBody className="divide-y divide-gray-100 p-0 dark:divide-gray-800">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between gap-4 px-6 py-5">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleString()}
                      {transaction.orderId ? ` · Order #${transaction.orderId}` : ''}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      transaction.points > 0
                        ? 'text-emerald-600 dark:text-emerald-300'
                        : 'text-rose-500 dark:text-rose-300'
                    }`}
                  >
                    {transaction.points > 0 ? '+' : ''}
                    {transaction.points}
                  </span>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <div className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  Your ledger will populate once you start earning or redeeming EasyPoints.
                </div>
              )}
            </CardBody>
          </Card>

          {challengeHighlight && (
            <Card className="border border-purple-200/60 bg-gradient-to-r from-purple-50 to-blue-50 dark:border-purple-900/40 dark:from-purple-900/10 dark:to-blue-900/10">
              <CardBody className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-4xl" aria-hidden="true">
                    {challengeHighlight.icon}
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-purple-500">
                      Challenge highlight
                    </p>
                    <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                      {challengeHighlight.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {challengeHighlight.description}
                    </p>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/60 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                        style={{
                          width: `${
                            (challengeHighlight.progress.current / challengeHighlight.progress.target) * 100
                          }%`,
                        }}
                      />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-purple-600 dark:text-purple-300">
                      {challengeHighlight.rewardPoints} EasyPoints when you finish.
                    </p>
                  </div>
                </div>
                <Link to="/account/rewards/challenges">
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Open challenges
                  </Button>
                </Link>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex items-center gap-3 border-b border-gray-100 px-6 py-5 dark:border-gray-800">
              <div className="rounded-xl bg-teal-100 p-2 text-teal-600 dark:bg-teal-900/40 dark:text-teal-200">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                  Wallet balance
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Auto-applies at checkout.</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-4 px-6 py-5">
              <p className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                ${walletBalance.toFixed(2)}
              </p>
              <div className="grid gap-2 text-xs text-gray-600 dark:text-gray-400">
                <span>Pending EasyPoints · {summary.pendingPoints.toLocaleString()} pts</span>
                <span>
                  Estimated value · ${summary.estimatedValue.toFixed(2)}
                </span>
                {summary.expiringPoints ? (
                  <span>
                    Expiring soon · {summary.expiringPoints.toLocaleString()} pts on{' '}
                    {summary.expiringOn ? new Date(summary.expiringOn).toLocaleDateString() : 'N/A'}
                  </span>
                ) : (
                  <span>No points expiring in this quarter.</span>
                )}
              </div>
              <Button variant="secondary" fullWidth>
                Manage redemptions
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-orange-100 p-2 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300">
                  <Flame className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                    Loyalty streak
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Keep the streak to maintain your {streak.multiplier.toFixed(1)}× multiplier.
                  </p>
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                  {streak.current} days
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Best streak {streak.best} · resets {new Date(streak.endsAt).toLocaleTimeString()}
                </p>
              </div>
              <Link
                to="/account/rewards/challenges"
                className="inline-flex items-center text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-300 dark:hover:text-orange-200"
              >
                View streak boosters
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-4 p-6">
              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/40 dark:text-blue-200">
                  <Users className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                    Refer & earn
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Share your invite link to earn bonus EasyPoints for you and your friends.
                  </p>
                </div>
              </div>
              <code className="block truncate rounded-xl bg-gray-900/90 px-4 py-3 text-xs text-white">
                {referralLink}
              </code>
              <Link to="/account/referrals">
                <Button variant="primary" fullWidth className="flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Open referral command center
                </Button>
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-3 p-6">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                    {tier} tier benefits
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Unlock more perks as you level up your loyalty profile.
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {tierBenefits[tier].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2">
                    <span className="text-emerald-500">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>

      <BadgesShowcase badges={badges} limit={3} />
    </div>
  );
}


