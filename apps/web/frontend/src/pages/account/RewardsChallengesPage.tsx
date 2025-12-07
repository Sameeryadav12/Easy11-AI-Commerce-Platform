import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, CalendarRange, CheckCircle, Timer } from 'lucide-react';
import { Button, Card, CardBody, CardHeader } from '../../components/ui';
import { useRewardsStore } from '../../store/rewardsStore';
import { BadgesShowcase } from '../../components/account/rewards/BadgesShowcase';
import type { Challenge } from '../../types/rewards';

export default function RewardsChallengesPage() {
  const { challenges, streak, completeChallenge, badges } = useRewardsStore((state) => ({
    challenges: state.challenges,
    streak: state.streak,
    completeChallenge: state.completeChallenge,
    badges: state.badges,
  }));

  const sections = useMemo(
    () => [
      { title: 'Daily missions', icon: <Timer className="h-5 w-5" />, data: challenges.daily },
      { title: 'Weekly goals', icon: <CalendarRange className="h-5 w-5" />, data: challenges.weekly },
      { title: 'Seasonal quests', icon: <Target className="h-5 w-5" />, data: challenges.seasonal },
    ],
    [challenges]
  );

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-purple-500 dark:text-purple-300">
              Challenges · Sprint 4
            </p>
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Gamified loyalty streaks & quests
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
              Complete daily, weekly, and seasonal quests to unlock EasyPoints, multipliers, and rare badges.
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 p-4 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <Flame className="h-6 w-6" />
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">Current streak</p>
                <p className="text-2xl font-heading font-semibold">{streak.current} days</p>
                <p className="text-xs text-white/80">Best streak {streak.best} · {streak.multiplier.toFixed(1)}× booster active</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.title} className="flex flex-col">
            <CardHeader className="flex items-center justify-between gap-3 border-b border-gray-100 px-6 py-5 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/40 dark:text-purple-200">
                  {section.icon}
                </span>
                <div>
                  <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Complete these missions to stack multipliers and badges.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="flex flex-1 flex-col gap-4">
              {section.data.length === 0 && (
                <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  Missions will appear here once new challenges launch.
                </p>
              )}
              {section.data.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} onComplete={() => completeChallenge(challenge.id)} />
              ))}
            </CardBody>
          </Card>
        ))}
      </div>

      <BadgesShowcase badges={badges} />
    </div>
  );
}

interface ChallengeCardProps {
  challenge: Challenge;
  onComplete: () => void;
}

function ChallengeCard({ challenge, onComplete }: ChallengeCardProps) {
  const progressPercent = Math.min(100, (challenge.progress.current / challenge.progress.target) * 100);
  const isCompleted = challenge.status === 'completed';

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-purple-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-purple-700/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            {challenge.icon}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{challenge.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{challenge.description}</p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-600 dark:bg-purple-900/40 dark:text-purple-200">
          +{challenge.rewardPoints} pts
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {challenge.progress.current}/{challenge.progress.target}{' '}
            {challenge.progress.unit === 'currency' ? '$' : challenge.progress.unit === 'streak' ? 'days' : 'actions'}
          </span>
          <span>{challenge.status === 'completed' ? 'Completed' : 'In progress'}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {challenge.cta && (
          <a
            href={challenge.cta.href}
            className="text-xs font-semibold text-purple-600 transition hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-200"
          >
            {challenge.cta.label}
          </a>
        )}
        <Button
          variant={isCompleted ? 'secondary' : 'primary'}
          size="sm"
          className="flex items-center gap-2"
          onClick={onComplete}
          disabled={isCompleted}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Completed
            </>
          ) : (
            <>
              <Target className="h-4 w-4" />
              Complete
            </>
          )}
        </Button>
      </div>
    </div>
  );
}


