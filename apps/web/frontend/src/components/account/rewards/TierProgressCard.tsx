import { motion } from 'framer-motion';
import { Gift, Sparkles, Zap } from 'lucide-react';
import type { RewardTier } from '../../../types/rewards';

interface TierProgressCardProps {
  tier: RewardTier;
  points: number;
  pointsToNext: number;
  tierProgress: number;
  streakMultiplier: number;
  aiTip: string;
  onRedeem?: () => void;
}

const tierVisuals: Record<
  RewardTier,
  { gradient: string; icon: string; accentText: string }
> = {
  Silver: {
    gradient: 'from-gray-300 via-gray-400 to-gray-600',
    icon: '🥈',
    accentText: 'Keep the momentum going!',
  },
  Gold: {
    gradient: 'from-amber-300 via-amber-400 to-yellow-500',
    icon: '🥇',
    accentText: 'Premium perks unlocked.',
  },
  Platinum: {
    gradient: 'from-indigo-400 via-purple-500 to-slate-800',
    icon: '💎',
    accentText: 'You reached the summit.',
  },
};

export function TierProgressCard({
  tier,
  points,
  pointsToNext,
  tierProgress,
  streakMultiplier,
  aiTip,
  onRedeem,
}: TierProgressCardProps) {
  const visuals = tierVisuals[tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-3xl p-8 text-white shadow-xl bg-gradient-to-br ${visuals.gradient}`}
    >
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_#ffffff33,_transparent_70%)] pointer-events-none" />
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-5xl leading-none">{visuals.icon}</span>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/80">
                Current Tier
              </p>
              <h2 className="text-3xl font-heading font-bold">{tier}</h2>
            </div>
          </div>
          <Gift className="w-12 h-12 text-white/60" />
        </div>

        <div>
          <p className="text-sm text-white/80">Available points</p>
          <p className="text-5xl font-heading font-bold leading-tight">
            {points.toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-white/80">
            ${ (points / 100).toFixed(2) } value · {visuals.accentText}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Progress to next tier</span>
            <span>{tierProgress.toFixed(0)}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, tierProgress)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.55)]"
            />
          </div>
          {pointsToNext > 0 ? (
            <p className="text-sm text-white/80">
              {pointsToNext.toLocaleString()} points to reach the next tier.
            </p>
          ) : (
            <p className="text-sm text-white/80">
              You unlocked every tier benefit. Keep enjoying the rewards!
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
            <Sparkles className="h-8 w-8 text-white/80" />
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                Loyalty Insight
              </p>
              <p className="text-sm leading-snug text-white/90">{aiTip}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
            <Zap className="h-8 w-8 text-white/80" />
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                Streak Multiplier
              </p>
              <p className="text-xl font-heading font-semibold text-white">
                {streakMultiplier.toFixed(1)}× activations
              </p>
              <p className="text-xs text-white/80">
                Keep your streak to boost daily and weekly points.
              </p>
            </div>
          </div>
        </div>

        {onRedeem && (
          <button
            type="button"
            onClick={onRedeem}
            className="inline-flex w-full items-center justify-center rounded-xl bg-white/90 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-white"
          >
            Redeem points
          </button>
        )}
      </div>
    </motion.div>
  );
}


