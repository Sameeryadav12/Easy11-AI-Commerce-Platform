import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
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

interface PersonalizedRecommendationsProps {
  /** When true, section is part of the merged "For you" area: compact header, no scores, minimal labels */
  variant?: 'standalone' | 'merged';
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ variant = 'standalone' }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const { user } = useAuthStore();
  const {
    items,
    isLoading,
    error,
    lastUpdated,
    fetchRecommendations,
  } = useRecommendationStore((state) => ({
    items: state.items,
    isLoading: state.isLoading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    fetchRecommendations: state.fetchRecommendations,
  }));

  useEffect(() => {
    if (inView) {
      fetchRecommendations(user?.id || 'guest-user', 8, 'hybrid');
    }
  }, [fetchRecommendations, inView, user?.id]);

  const isMerged = variant === 'merged';

  const content = (
    <>
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-6 ${isMerged ? 'mb-6' : 'mb-10'}`}>
          <div>
            {!isMerged && (
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-xl bg-slate-700/60 border border-slate-600">
                  <Sparkles className="w-5 h-5 text-teal-300" />
                </div>
                <p className="text-sm uppercase tracking-widest text-slate-300">Just for you</p>
              </div>
            )}
            <h2 className={isMerged ? 'text-xl font-heading font-bold text-gray-900 dark:text-white' : 'text-3xl md:text-4xl font-heading font-bold'}>
              Recommended for you
            </h2>
            {!isMerged && (
              <p className="text-slate-300 mt-3 max-w-xl">
                Picks based on your activity and what’s trending. Updated regularly.
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm text-slate-300">
            {!isMerged && lastUpdated && (
              <p className="text-xs text-slate-400">
                Updated {new Date(lastUpdated).toLocaleTimeString()}
              </p>
            )}
            <div className="flex items-center space-x-3">
              <Link
                to="/products?filter=personalized"
                className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${isMerged ? 'text-blue-600 dark:text-blue-400 hover:underline' : 'border border-teal-300/50 text-teal-200 hover:text-white hover:bg-white/10'}`}
              >
                See more
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {isLoading && <RecommendationSkeleton />}

        {!isLoading && error && (
          <div className={`rounded-xl border p-6 ${isMerged ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-200' : 'border-slate-700 bg-slate-800/70 text-slate-200'}`}>
            <p className="font-semibold mb-2">Temporarily unavailable</p>
            <p className={`text-sm ${isMerged ? 'text-amber-800 dark:text-amber-300' : 'text-slate-300'}`}>
              Showing trending products instead.
            </p>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${isMerged ? 'text-gray-900 dark:text-white' : ''}`}>
            {items.map((recommendation, index) => (
              <motion.div
                key={recommendation.productId}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <Card className={isMerged ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-400/70 transition-colors h-full' : 'bg-slate-800/50 border-slate-700 hover:border-teal-400/70 transition-colors h-full'}>
                  <CardBody className="space-y-4">
                    {!isMerged && (
                      <div className="flex items-center justify-between">
                        <Badge variant="success" size="sm">
                          {recommendation.reason ?? 'Recommended'}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          Score {(recommendation.score * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}

                    <Link to={recommendation.metadata.product_url || `/products/${recommendation.productId}`}>
                      <div className={`aspect-square rounded-xl flex items-center justify-center text-6xl ${isMerged ? 'bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600' : 'bg-slate-900/70 border border-slate-700'}`}>
                        {recommendation.metadata.image ?? '✨'}
                      </div>
                    </Link>

                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${isMerged ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                        {recommendation.metadata.title}
                      </h3>
                      {!isMerged && recommendation.metadata.subtitle && (
                        <p className="text-sm text-slate-300 mb-2">
                          {recommendation.metadata.subtitle}
                        </p>
                      )}
                      <p className={isMerged ? 'text-blue-600 dark:text-blue-400 font-semibold text-lg' : 'text-teal-300 font-semibold text-lg'}>
                        {new Intl.NumberFormat(undefined, {
                          style: 'currency',
                          currency: recommendation.metadata.currency,
                        }).format(recommendation.metadata.price)}
                      </p>
                    </div>

                    {!isMerged && (
                      <div className="flex flex-wrap gap-2">
                        {(recommendation.metadata.badges || []).slice(0, 2).map((badge) => (
                          <Badge key={badge} variant="default" size="sm" className="bg-slate-700/70 text-slate-200 border border-slate-600/70">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {!isMerged && recommendation.explanation && (
                      <details className="text-xs text-slate-400 rounded-lg bg-slate-900/60 border border-slate-800 p-3">
                        <summary className="cursor-pointer text-slate-300">Why you see this</summary>
                        <p className="mt-2 leading-relaxed">{recommendation.explanation}</p>
                      </details>
                    )}

                    <Link
                      to={recommendation.metadata.product_url || `/products/${recommendation.productId}`}
                      className={`w-full inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold transition-colors ${isMerged ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border border-teal-400/40 text-teal-200 hover:text-white hover:bg-teal-500/20'}`}
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
          <div className={`flex items-center justify-center mt-10 ${isMerged ? 'text-gray-500 dark:text-gray-400' : 'text-slate-300'}`}>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading…
          </div>
        )}
    </>
  );

  if (isMerged) {
    return <div ref={ref}>{content}</div>;
  }
  return (
    <section className="section bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" ref={ref}>
      <div className="container-custom">{content}</div>
    </section>
  );
};

export default PersonalizedRecommendations;

