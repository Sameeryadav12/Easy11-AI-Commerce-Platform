import { Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ReviewSummary } from '../../types/community';

interface ReviewSummaryCardProps {
  summary: ReviewSummary;
}

export function ReviewSummaryCard({ summary }: ReviewSummaryCardProps) {
  const total = summary.totalCount || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-500 text-white shadow-xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_55%)] pointer-events-none" />
      <div className="relative z-10 grid gap-8 p-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">
              <Star className="h-6 w-6 text-yellow-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                Customer sentiment
              </p>
              <h2 className="text-3xl font-heading font-bold">{summary.averageRating.toFixed(1)} / 5</h2>
              <p className="text-sm text-white/80">{summary.totalCount.toLocaleString()} verified reviews</p>
            </div>
          </div>

          <div className="grid gap-2">
            {summary.distribution
              .slice()
              .sort((a, b) => b.stars - a.stars)
              .map((bucket) => {
                const ratio = (bucket.count / total) * 100;
                return (
                  <div key={bucket.stars} className="flex items-center gap-3 text-sm">
                    <span className="w-10 text-white/85">{bucket.stars}★</span>
                    <div className="flex-1 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-2 rounded-full bg-white/80 transition-all"
                        style={{ width: `${Math.max(8, ratio)}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-white/75">{Math.round(ratio)}%</span>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-white/80" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
              AI highlights
            </h3>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">What shoppers love</p>
            <ul className="mt-3 space-y-2 text-sm text-white/90">
              {summary.aiSummary.positiveHighlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-200">Worth considering</p>
            <ul className="mt-3 space-y-2 text-sm text-white/90">
              {summary.aiSummary.considerations.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


