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
  /** When true, section is part of merged "For you" area: compact heading, no badge, subtle controls link */
  embedded?: boolean;
}

export default function HomeDynamicSections({ userId, sessionId, geo, embedded }: HomeDynamicSectionsProps) {
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

  const header = embedded ? (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
        Based on your activity
      </h2>
      <Link
        to="/account/privacy#personalization"
        className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        Personalization controls
      </Link>
    </div>
  ) : (
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
  );

  const sectionsContent = (
    <div className="grid gap-6 lg:grid-cols-3">
          {homeSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 text-white shadow-lg">
                <CardBody className="space-y-6">
                  <div className="flex items-start justify-between gap-4 min-w-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs uppercase tracking-widest text-emerald-300/90 font-medium">
                        {section.reasonCode.replace(/_/g, ' ')}
                      </p>
                      <h3 className="text-xl md:text-2xl font-heading font-semibold text-white mt-1 break-words">
                        {section.title}
                      </h3>
                      {section.subtitle && (
                        <p className="text-sm text-slate-200 mt-2 break-words leading-relaxed">
                          {section.subtitle}
                        </p>
                      )}
                    </div>
                    <Compass className="w-8 h-8 text-emerald-400 flex-shrink-0" aria-hidden />
                  </div>

                  <ul className="space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={item.id}
                        className="rounded-xl bg-slate-700/70 border border-slate-600/80 p-4 flex items-start gap-4"
                      >
                        <div className="w-14 h-14 rounded-lg bg-slate-800/80 border border-slate-600 flex items-center justify-center text-3xl flex-shrink-0">
                          {item.image ?? '✨'}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-white leading-tight break-words">
                              {item.title}
                            </p>
                            <span className="text-xs font-mono text-emerald-300 flex-shrink-0">
                              {(item.score * 100).toFixed(0)}%
                            </span>
                          </div>
                          <p className="text-sm text-slate-200 font-medium">
                            {new Intl.NumberFormat(undefined, {
                              style: 'currency',
                              currency: item.currency,
                            }).format(item.price)}
                          </p>
                          {item.reason && (
                            <p className="text-xs text-slate-100 leading-relaxed">{item.reason}</p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {(item.badges ?? []).map((badge) => (
                              <span
                                key={badge}
                                className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500 text-white border border-emerald-400 shadow-sm"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                          <Link
                            to={item.url}
                            className="mt-3 flex-shrink-0 inline-flex items-center gap-1 w-fit px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition-colors shadow-md ring-2 ring-emerald-400/30"
                          >
                            View details
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                        <span className="text-xs text-slate-300 font-medium flex-shrink-0">#{itemIndex + 1}</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </motion.div>
          ))}
    </div>
  );

  const spaceY = embedded ? 'space-y-6' : 'space-y-10';
  const inner = (
    <div className={spaceY}>
      {header}
      {sectionsContent}
    </div>
  );

  if (embedded) {
    return inner;
  }
  return (
    <section className="py-14 bg-white dark:bg-gray-950">
      <div className="container-custom">{inner}</div>
    </section>
  );
}


