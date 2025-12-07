import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import usePersonalizationStore from '../../store/personalizationStore';
import { Card, CardBody, Badge, Button } from '../ui';

interface HomeDynamicSectionsProps {
  userId: string;
  sessionId: string;
  geo?: string;
}

export default function HomeDynamicSections({ userId, sessionId, geo }: HomeDynamicSectionsProps) {
  const { homeSections, isLoading, error, fetchHomeSections } = usePersonalizationStore((state) => ({
    homeSections: state.homeSections,
    isLoading: state.isLoading,
    error: state.error,
    fetchHomeSections: state.fetchHomeSections,
  }));

  useEffect(() => {
    fetchHomeSections({
      userId,
      sessionId,
      device: window.innerWidth < 768 ? 'mobile' : 'desktop',
      geo,
      timeOfDay: new Date().getHours() < 12 ? 'morning' : 'evening',
      season: 'fall',
    });
  }, [fetchHomeSections, userId, sessionId, geo]);

  if (error) {
    return (
      <section className="container-custom py-12">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            <p className="font-semibold">{error}</p>
          </div>
          <p className="text-sm mt-2 text-amber-800 dark:text-amber-300">
            You are viewing curated content while personalization comes back online.
          </p>
        </div>
      </section>
    );
  }

  if (isLoading && homeSections.length === 0) {
    return (
      <section className="container-custom py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`dynamic-skeleton-${index}`}
              className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 bg-white dark:bg-gray-950">
      <div className="container-custom space-y-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <Badge color="emerald" className="mb-3">
              Context aware
            </Badge>
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Session-aware personalization
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              We blend your recent browsing, purchase history, and real-time trends to keep each visit
              fresh. Tap any tile to jump straight into the experience.
            </p>
          </div>
          <Button
            variant="ghost"
            className="gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300"
            asChild
          >
            <Link to="/account/privacy#personalization">Personalization controls</Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {homeSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                <CardBody className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400">
                        {section.reasonCode.replace(/_/g, ' ')}
                      </p>
                      <h3 className="text-2xl font-heading font-semibold">{section.title}</h3>
                      {section.subtitle && (
                        <p className="text-sm text-slate-300 mt-2">{section.subtitle}</p>
                      )}
                    </div>
                    <Compass className="w-8 h-8 text-emerald-300" />
                  </div>

                  <ul className="space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={item.id}
                        className="rounded-xl bg-slate-800/80 border border-slate-700/60 p-4 flex items-start gap-4"
                      >
                        <div className="w-14 h-14 rounded-lg bg-slate-900/60 border border-slate-700 flex items-center justify-center text-3xl">
                          {item.image ?? '✨'}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-white leading-tight">
                              {item.title}
                            </p>
                            <span className="text-xs font-mono text-emerald-200">
                              {(item.score * 100).toFixed(0)}%
                            </span>
                          </div>
                          <p className="text-sm text-slate-300">
                            {new Intl.NumberFormat(undefined, {
                              style: 'currency',
                              currency: item.currency,
                            }).format(item.price)}
                          </p>
                          {item.reason && (
                            <p className="text-xs text-slate-400">{item.reason}</p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {(item.badges ?? []).map((badge) => (
                              <Badge key={badge} size="xs" variant="info">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 gap-1 text-emerald-200 hover:text-white hover:bg-emerald-600/10"
                            asChild
                          >
                            <Link to={item.url}>
                              View details
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                          </Button>
                        </div>
                        <span className="text-xs text-slate-500">#{itemIndex + 1}</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


