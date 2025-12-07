import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Camera, Sparkles } from 'lucide-react';
import { Button, Card, CardBody } from '../../components/ui';
import { UGCGallery } from '../../components/community/UGCGallery';
import { useCommunityStore } from '../../store/communityStore';

export default function CommunityHubPage() {
  const { hub, hubLoading, fetchHub } = useCommunityStore((state) => ({
    hub: state.hub,
    hubLoading: state.hubLoading,
    fetchHub: state.fetchHub,
  }));

  useEffect(() => {
    fetchHub();
  }, [fetchHub]);

  if (hubLoading || !hub) {
    return (
      <div className="container-custom py-24">
        <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border-4 border-dashed border-blue-200 text-blue-400">
          Loading community…
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 py-16 text-white">
        <div className="container-custom relative z-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">
              Sprint 5 · Creator community
            </p>
            <h1 className="text-4xl font-heading font-bold leading-tight lg:text-5xl">
              Discover shoppable looks crafted by the Easy11 community.
            </h1>
            <p className="max-w-xl text-sm text-white/80">
              Browse real-world setups, creator campaigns, and top tips. Share your own photo or video,
              tag products, and earn loyalty bonuses when your look converts.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg" className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50">
                <Camera className="h-5 w-5" />
                Share your look
              </Button>
              <Button variant="secondary" size="lg" className="flex items-center gap-2 border-white text-white hover:bg-white/10">
                <Sparkles className="h-5 w-5" />
                Creator program
              </Button>
            </div>
            <div className="flex gap-6 text-sm text-white/80">
              <span>{hub.stats.totalReviews.toLocaleString()} reviews published</span>
              <span>{hub.stats.totalLooks.toLocaleString()} looks live</span>
            </div>
          </div>
          {hub.heroLook && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl bg-white/10 backdrop-blur shadow-2xl"
            >
              <img
                src={hub.heroLook.media.url}
                alt={hub.heroLook.media.alt}
                className="h-80 w-full rounded-3xl object-cover"
              />
            </motion.div>
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%)]" />
      </section>

      <div className="container-custom space-y-12 py-12">
        {hub.featuredSections.map((section) => (
          <UGCGallery
            key={section.id}
            looks={section.looks}
            title={section.title}
            ctaLabel="View all looks"
            ctaHref="/community"
          />
        ))}

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardBody className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                    Trending creators
                  </p>
                  <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-white">
                    Meet the partners powering {hub.stats.featuredCampaign}
                  </h2>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {hub.trendingCreators.map((creator) => (
                  <div key={creator.id} className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{creator.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{creator.handle}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{creator.bio}</p>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{creator.metrics.reach.toLocaleString()}</p>
                        <p>Audience</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{creator.metrics.conversions}</p>
                        <p>Conversions</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">${creator.metrics.earnings.toLocaleString()}</p>
                        <p>Earned</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardBody className="space-y-4">
              <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                Become a creator
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Apply to Easy11’s creator program to unlock early product drops, affiliate commission, and campaign briefs tailored to your audience.
              </p>
              <Button variant="primary" className="flex items-center gap-2">
                Apply now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
}


