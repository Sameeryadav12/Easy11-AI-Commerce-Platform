import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles, ArrowRight, Loader2, Info } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import useRecommendationStore from '../../store/recommendationStore';
import { Card, CardBody, Badge } from '../ui';

const RecommendationSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={`rec-skeleton-${index}`}
        className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse bg-white/60 dark:bg-gray-800/60"
      >
        <div className="h-40 rounded-lg bg-gray-200 dark:bg-gray-700 mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
        <div className="flex space-x-2">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

const PersonalizedRecommendations: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const { user } = useAuthStore();
  const {
    items,
    isLoading,
    error,
    algo,
    modelVersion,
    lastUpdated,
    fetchRecommendations,
  } = useRecommendationStore((state) => ({
    items: state.items,
    isLoading: state.isLoading,
    error: state.error,
    algo: state.algo,
    modelVersion: state.modelVersion,
    lastUpdated: state.lastUpdated,
    fetchRecommendations: state.fetchRecommendations,
  }));

  useEffect(() => {
    if (inView) {
      fetchRecommendations(user?.id || 'guest-user', 8, 'hybrid');
    }
  }, [fetchRecommendations, inView, user?.id]);

  return (
    <section className="section bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" ref={ref}>
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-xl bg-slate-700/60 border border-slate-600">
                <Sparkles className="w-5 h-5 text-teal-300" />
              </div>
              <p className="text-sm uppercase tracking-widest text-slate-300">Just for you</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              Personalized Picks Powered by AI
            </h2>
            <p className="text-slate-300 mt-3 max-w-xl">
              We analysed recent activity, similar shopper behavior, and trending signals to keep your discovery feed fresh.
            </p>
          </div>

          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-teal-300" />
              <span>
                Model: <span className="font-semibold text-white">{modelVersion ?? 'hybrid-recommender'}</span>
              </span>
            </div>
            {lastUpdated && (
              <p className="text-xs text-slate-400">
                Last refreshed {new Date(lastUpdated).toLocaleTimeString()}
              </p>
            )}
            <div className="flex items-center space-x-3">
              <Badge variant="info" size="sm">
                {algo.toUpperCase()}
              </Badge>
              <Link
                to="/products?filter=personalized"
                className="inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg border border-teal-300/50 text-teal-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                See more
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {isLoading && <RecommendationSkeleton />}

        {!isLoading && error && (
          <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-6 text-slate-200">
            <p className="font-semibold mb-2">We&apos;re warming up the models</p>
            <p className="text-sm text-slate-300">
              {error} We&apos;ve loaded a curated set of trending products instead.
            </p>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((recommendation, index) => (
              <motion.div
                key={recommendation.productId}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:border-teal-400/70 transition-colors h-full">
                  <CardBody className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="success" size="sm">
                        {recommendation.reason ?? 'Recommended'}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        Score {(recommendation.score * 100).toFixed(0)}%
                      </span>
                    </div>

                    <Link to={recommendation.metadata.product_url || `/products/${recommendation.productId}`}>
                      <div className="aspect-square rounded-xl bg-slate-900/70 border border-slate-700 flex items-center justify-center text-6xl">
                        {recommendation.metadata.image ?? '✨'}
                      </div>
                    </Link>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {recommendation.metadata.title}
                      </h3>
                      {recommendation.metadata.subtitle && (
                        <p className="text-sm text-slate-300 mb-2">
                          {recommendation.metadata.subtitle}
                        </p>
                      )}
                      <p className="text-teal-300 font-semibold text-lg">
                        {new Intl.NumberFormat(undefined, {
                          style: 'currency',
                          currency: recommendation.metadata.currency,
                        }).format(recommendation.metadata.price)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(recommendation.metadata.badges || []).slice(0, 2).map((badge) => (
                        <Badge key={badge} variant="default" size="sm" className="bg-slate-700/70 text-slate-200 border border-slate-600/70">
                          {badge}
                        </Badge>
                      ))}
                    </div>

                    {recommendation.explanation && (
                      <details className="text-xs text-slate-400 rounded-lg bg-slate-900/60 border border-slate-800 p-3">
                        <summary className="cursor-pointer text-slate-300">Why you see this</summary>
                        <p className="mt-2 leading-relaxed">{recommendation.explanation}</p>
                      </details>
                    )}

                    <Link
                      to={recommendation.metadata.product_url || `/products/${recommendation.productId}`}
                      className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg border border-teal-400/40 text-teal-200 hover:text-white hover:bg-teal-500/20 transition-colors font-semibold"
                    >
                      View Product
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {isLoading && items.length === 0 && (
          <div className="flex items-center justify-center mt-10 text-slate-300">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Personalizing your feed…
          </div>
        )}
      </div>
    </section>
  );
};

export default PersonalizedRecommendations;

