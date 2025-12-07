import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserPlus,
  LineChart,
  Repeat,
  FlaskConical,
  Trophy,
  TrendingUp,
  MessageCircle,
} from 'lucide-react';
import { Button, Badge } from '../../components/ui';
import growthAPI from '../../services/growthAPI';
import { useGrowthStore } from '../../store/growthStore';

const gradientCard = [
  'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10',
  'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10',
  'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10',
];

export default function VendorGrowthOpsPage() {
  const {
    referralProgram,
    leaderboard,
    setReferralProgram,
    setLeaderboard,
    growthLoops,
    setGrowthLoops,
    experiments,
    setExperiments,
    feedbackSummary,
    setFeedbackSummary,
    isLoading,
    setLoading,
    error,
    setError,
  } = useGrowthStore((state) => ({
    referralProgram: state.referralProgram,
    leaderboard: state.leaderboard,
    setReferralProgram: state.setReferralProgram,
    setLeaderboard: state.setLeaderboard,
    growthLoops: state.growthLoops,
    setGrowthLoops: state.setGrowthLoops,
    experiments: state.experiments,
    setExperiments: state.setExperiments,
    feedbackSummary: state.feedbackSummary,
    setFeedbackSummary: state.setFeedbackSummary,
    isLoading: state.isLoading,
    setLoading: state.setLoading,
    error: state.error,
    setError: state.setError,
  }));

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          program,
          board,
          loops,
          experimentList,
          feedback,
        ] = await Promise.all([
          growthAPI.getReferralProgram('vendor-123'),
          growthAPI.getReferralLeaderboard('30d'),
          growthAPI.getGrowthLoops(),
          growthAPI.getExperiments(),
          growthAPI.getFeedbackSummary('30d'),
        ]);

        setReferralProgram(program);
        setLeaderboard(board);
        setGrowthLoops(loops);
        setExperiments(experimentList);
        setFeedbackSummary(feedback);
      } catch (err) {
        console.error('[Growth Ops] Load failed', err);
        setError('Unable to load growth data right now. Try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-custom py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-500 dark:text-emerald-300">
              Sprint 12 · Growth Loops & Experimentation
            </p>
            <h1 className="mt-2 text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Growth Operations Command Center
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Track referral loops, experimentation, and feedback to fuel sustainable growth.
            </p>
          </div>
          <Button variant="primary" className="flex items-center gap-2 self-start">
            <UserPlus className="h-4 w-4" />
            Share referral program
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-500" />
          </div>
        ) : (
          <>
            {/* Referral Program */}
            {referralProgram && (
              <section className="mb-8 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-300">
                      <Repeat className="h-5 w-5" />
                      <span className="text-xs uppercase tracking-[0.3em]">Referral flywheel</span>
                    </div>
                    <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                      {referralProgram.tier.charAt(0).toUpperCase() + referralProgram.tier.slice(1)} tier
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Invite partners and customers to earn ${referralProgram.referral_link.includes('vendor') ? 'vendor' : 'customer'} rewards.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">
                      Code: {referralProgram.referral_code}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">
                      Link: {referralProgram.referral_link}
                    </span>
                    <Badge variant="secondary" size="sm">
                      ${referralProgram.total_rewards_earned.toLocaleString()} earned
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      label: 'Invites sent',
                      value: referralProgram.invites_sent.toLocaleString(),
                      helper: `${referralProgram.signups} signed up`,
                    },
                    {
                      label: 'Conversions',
                      value: referralProgram.conversions.toLocaleString(),
                      helper: `${referralProgram.conversion_rate.toFixed(1)}% conversion rate`,
                    },
                    {
                      label: 'Rewards pending',
                      value: `$${referralProgram.pending_rewards.toFixed(2)}`,
                      helper: `Total $${referralProgram.total_rewards_earned.toFixed(2)}`,
                    },
                    {
                      label: 'Program status',
                      value: referralProgram.is_active ? 'Active' : 'Paused',
                      helper: `Tier ${referralProgram.tier}`,
                    },
                  ].map((card, index) => (
                    <div
                      key={card.label}
                      className={`rounded-2xl p-4 ${gradientCard[index % gradientCard.length]}`}
                    >
                      <p className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                        {card.label}
                      </p>
                      <p className="mt-1 text-2xl font-heading font-semibold text-gray-900 dark:text-white">
                        {card.value}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{card.helper}</p>
                    </div>
                  ))}
                </div>

                {leaderboard && (
                  <div className="mt-6">
                    <div className="mb-3 flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                        Leaderboard (Last 30 days)
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[420px] text-left text-sm text-gray-600 dark:text-gray-300">
                        <thead>
                          <tr className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                            <th className="py-3">Rank</th>
                            <th className="py-3">Name</th>
                            <th className="py-3">Conversions</th>
                            <th className="py-3">Rewards</th>
                            <th className="py-3">Conversion rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaderboard.leaders.map((leader) => (
                            <tr key={leader.user_id} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                              <td className="py-3 font-semibold text-gray-900 dark:text-white">{leader.rank}</td>
                              <td className="py-3">
                                <span className={leader.is_current_user ? 'font-semibold text-emerald-500' : 'font-medium text-gray-900 dark:text-white'}>
                                  {leader.user_name}
                                </span>
                              </td>
                              <td className="py-3">{leader.conversions}</td>
                              <td className="py-3">${leader.total_rewards.toLocaleString()}</td>
                              <td className="py-3">{leader.conversion_rate.toFixed(1)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Growth Loops */}
            <section className="mb-8 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
              <div className="mb-4 flex items-center gap-2">
                <LineChart className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">Growth loops health</h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {growthLoops.map((loop) => (
                  <div key={loop.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{loop.name}</p>
                      <Badge
                        variant={loop.is_active ? 'success' : 'secondary'}
                        size="sm"
                        className="capitalize"
                      >
                        {loop.is_active ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{loop.trigger}</p>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300">
                      <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-200">Incentive</p>
                        <p>{loop.incentive}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-200">Outcome</p>
                        <p>{loop.outcome}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300">
                      <div>
                        <p>Completions</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {loop.loop_completions}
                        </p>
                      </div>
                      <div>
                        <p>Viral K</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {loop.viral_coefficient.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p>Cycle time</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {loop.avg_cycle_time_hours.toFixed(1)}h
                        </p>
                      </div>
                      <div>
                        <p>Health score</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {loop.health_score}/100
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Experimentation */}
            <section className="mb-8 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
              <div className="mb-4 flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-purple-500 dark:text-purple-300" />
                <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">Experiment lab</h2>
              </div>
              {experiments.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Configure your first experiment to measure uplift.
                </p>
              ) : (
                <div className="space-y-4">
                  {experiments.map((experiment) => (
                    <div key={experiment.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{experiment.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {experiment.description}
                          </p>
                        </div>
                        <Badge
                          variant={
                            experiment.status === 'running'
                              ? 'info'
                              : experiment.status === 'completed'
                              ? 'success'
                              : 'secondary'
                          }
                          size="sm"
                          className="capitalize"
                        >
                          {experiment.status}
                        </Badge>
                      </div>
                      {experiment.results && (
                        <div className="mt-3 grid gap-3 text-xs text-gray-600 dark:text-gray-300 md:grid-cols-3">
                          <div>
                            <p className="font-semibold text-gray-700 dark:text-gray-200">Primary uplift</p>
                            <p>
                              {experiment.results.improvement_percentage
                                ? `${experiment.results.improvement_percentage.toFixed(1)}%`
                                : '—'}
                            </p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700 dark:text-gray-200">Confidence</p>
                            <p>{(experiment.results.confidence_level * 100).toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700 dark:text-gray-200">Recommendation</p>
                            <p>{experiment.results.recommendation.replace('_', ' ')}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Feedback Summary */}
            {feedbackSummary && (
              <section className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
                <div className="mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-amber-500 dark:text-amber-300" />
                  <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                    Voice of the customer
                  </h2>
                </div>
                <div className="grid gap-4 lg:grid-cols-3">
                  <div className={gradientCard[0]}>
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                        NPS Score
                      </p>
                      <p className="mt-1 text-2xl font-heading font-semibold text-gray-900 dark:text-white">
                        {feedbackSummary.nps_score}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Promoters {feedbackSummary.promoters} · Detractors {feedbackSummary.detractors}
                      </p>
                    </div>
                  </div>
                  <div className={gradientCard[1]}>
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                        Sentiment
                      </p>
                      <p className="mt-1 text-2xl font-heading font-semibold text-gray-900 dark:text-white">
                        {(feedbackSummary.overall_sentiment * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Positive mentions {feedbackSummary.positive_feedback_count}
                      </p>
                    </div>
                  </div>
                  <div className={gradientCard[2]}>
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                        Key takeaway
                      </p>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                        {feedbackSummary.key_takeaways[0]}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
                  <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">AI Summary</p>
                  <p>{feedbackSummary.ai_summary}</p>
                </div>
              </section>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}


