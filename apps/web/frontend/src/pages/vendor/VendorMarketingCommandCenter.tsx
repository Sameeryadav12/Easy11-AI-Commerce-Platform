import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Megaphone,
  Users,
  BarChart,
  CalendarCheck,
  Compass,
  Sparkles,
} from 'lucide-react';
import { Button, Badge } from '../../components/ui';
import marketingAPI from '../../services/marketingAPI';
import { useMarketingStore } from '../../store/marketingStore';

const metricCardStyles = [
  'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10',
  'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10',
  'bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-900/10',
  'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10',
];

export default function VendorMarketingCommandCenter() {
  const {
    campaigns,
    selectedCampaign,
    setCampaigns,
    setSelectedCampaign,
    audienceSegments,
    setAudienceSegments,
    channelPerformance,
    setChannelPerformance,
    unifiedSummary,
    setUnifiedSummary,
    growthMetrics,
    setGrowthMetrics,
    launchPhases,
    setLaunchPhases,
    isLoading,
    setLoading,
    error,
    setError,
  } = useMarketingStore((state) => ({
    campaigns: state.campaigns,
    selectedCampaign: state.selectedCampaign,
    setCampaigns: state.setCampaigns,
    setSelectedCampaign: state.setSelectedCampaign,
    audienceSegments: state.audienceSegments,
    setAudienceSegments: state.setAudienceSegments,
    channelPerformance: state.channelPerformance,
    setChannelPerformance: state.setChannelPerformance,
    unifiedSummary: state.unifiedSummary,
    setUnifiedSummary: state.setUnifiedSummary,
    growthMetrics: state.growthMetrics,
    setGrowthMetrics: state.setGrowthMetrics,
    launchPhases: state.launchPhases,
    setLaunchPhases: state.setLaunchPhases,
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
          campaignsResponse,
          segments,
          channels,
          summary,
          growth,
          phases,
        ] = await Promise.all([
          marketingAPI.getCampaigns(),
          marketingAPI.getAudienceSegments(),
          marketingAPI.getChannelPerformance('30d'),
          marketingAPI.getUnifiedAnalytics('30d'),
          marketingAPI.getGrowthMetrics('30d'),
          marketingAPI.getLaunchPhases(),
        ]);

        setCampaigns(campaignsResponse.campaigns);
        setAudienceSegments(segments);
        setChannelPerformance(channels);
        setUnifiedSummary(summary);
        setGrowthMetrics(growth);
        setLaunchPhases(phases);

        if (!selectedCampaign && campaignsResponse.campaigns.length > 0) {
          setSelectedCampaign(campaignsResponse.campaigns[0]);
        }
      } catch (err) {
        console.error('[Marketing Command Center] Load failed', err);
        setError('Unable to load marketing data right now. Please refresh or try again later.');
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const campaignMetricsCards = useMemo(() => {
    if (!selectedCampaign) return [];
    const { metrics } = selectedCampaign;
    return [
      {
        label: 'Delivery rate',
        value: `${metrics.delivery_rate.toFixed(1)}%`,
        helper: `${metrics.delivered.toLocaleString()} delivered / ${metrics.sent.toLocaleString()} sent`,
      },
      {
        label: 'Click-through rate',
        value: `${metrics.click_rate.toFixed(1)}%`,
        helper: `${metrics.clicked.toLocaleString()} clicks`,
      },
      {
        label: 'Conversion rate',
        value: `${metrics.conversion_rate.toFixed(1)}%`,
        helper: `${metrics.conversions.toLocaleString()} conversions`,
      },
      {
        label: 'Attributed revenue',
        value: `$${metrics.revenue.toLocaleString()}`,
        helper: metrics.roi ? `ROI ${metrics.roi.toFixed(1)}x` : undefined,
      },
    ];
  }, [selectedCampaign]);

  const growthMetricCards = useMemo(() => {
    if (!growthMetrics) return [];
    return [
      {
        label: 'Net user growth',
        value: `+${growthMetrics.user_growth.net_growth.toLocaleString()}`,
        helper: `Growth ${growthMetrics.user_growth.growth_rate.toFixed(1)}% · Churn ${growthMetrics.user_growth.churn_rate.toFixed(1)}%`,
      },
      {
        label: 'Revenue growth rate',
        value: `${growthMetrics.revenue_growth.growth_rate.toFixed(1)}%`,
        helper: `MRR $${growthMetrics.revenue_growth.mrr.toLocaleString()}`,
      },
      {
        label: 'Activation rate',
        value: `${growthMetrics.activation.activation_rate.toFixed(1)}%`,
        helper: `Time to value ${growthMetrics.activation.time_to_first_purchase_days.toFixed(1)} days`,
      },
      {
        label: 'Viral coefficient',
        value: growthMetrics.viral.viral_coefficient.toFixed(2),
        helper: `${growthMetrics.viral.referrals_converted} conversions from ${growthMetrics.viral.referrals_sent} referrals`,
      },
    ];
  }, [growthMetrics]);

  return (
    <div className="container-custom py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-blue-500 dark:text-blue-300">
              Sprint 11 · Marketing Launch Platform
            </p>
            <h1 className="mt-2 text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Marketing Command Center
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Orchestrate campaigns, track omni-channel performance, and navigate launch milestones.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="secondary">
              <Link to="/vendor/marketing/ai" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Generate assets with AI
              </Link>
            </Button>
            <Button variant="primary">New Campaign</Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
          </div>
        ) : (
          <>
            {/* Campaign Planner */}
            <section className="mb-8 space-y-6 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-blue-500 dark:text-blue-300">
                    <Megaphone className="h-5 w-5" />
                    <span className="text-xs uppercase tracking-[0.3em]">Campaign Planner</span>
                  </div>
                  <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                    Current campaigns
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Monitor performance across email, paid, and lifecycle journeys.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {audienceSegments.map((segment) => (
                    <Badge key={segment.id} variant="secondary">
                      {segment.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
                <div className="space-y-2 rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/40">
                  {campaigns.map((campaign) => {
                    const isActive = selectedCampaign?.id === campaign.id;
                    return (
                      <button
                        key={campaign.id}
                        onClick={() => setSelectedCampaign(campaign)}
                        className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                          isActive
                            ? 'border-blue-500 bg-white shadow-sm dark:border-blue-500 dark:bg-gray-900'
                            : 'border-transparent bg-white hover:border-blue-200 dark:bg-gray-900 dark:hover:border-blue-700/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {campaign.name}
                          </p>
                          <Badge
                            variant={
                              campaign.status === 'running'
                                ? 'success'
                                : campaign.status === 'scheduled'
                                ? 'info'
                                : campaign.status === 'draft'
                                ? 'secondary'
                                : 'warning'
                            }
                            size="sm"
                            className="capitalize"
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                          {campaign.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
                            Goal: {campaign.goal}
                          </span>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
                            Type: {campaign.type}
                          </span>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
                            Audience: {campaign.audience.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="grid gap-4 rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                  {selectedCampaign ? (
                    <>
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                            {selectedCampaign.name}
                          </h3>
                          {selectedCampaign.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {selectedCampaign.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary" size="sm">
                            Created {new Date(selectedCampaign.created_at).toLocaleDateString()}
                          </Badge>
                          {selectedCampaign.ai_generated && (
                            <Badge variant="info" size="sm" className="flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              AI assisted
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {campaignMetricsCards.map((card, index) => (
                          <div
                            key={card.label}
                            className={`rounded-2xl p-4 shadow-sm dark:shadow-none ${metricCardStyles[index % metricCardStyles.length]}`}
                          >
                            <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                              {card.label}
                            </p>
                            <p className="mt-1 text-2xl font-heading font-semibold text-gray-900 dark:text-white">
                              {card.value}
                            </p>
                            {card.helper && (
                              <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{card.helper}</p>
                            )}
                          </div>
                        ))}
                      </div>

                      {selectedCampaign.variants && selectedCampaign.variants.length > 0 && (
                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                          <p className="font-semibold">
                            Winning Variant:{' '}
                            {selectedCampaign.variants.find((variant) => variant.is_winner)?.name}
                          </p>
                          <p className="mt-1">
                            Variant A delivered the highest conversion uplift; consider rolling out across the segment.
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                      Select a campaign to view performance.
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Unified Analytics */}
            {unifiedSummary && (
              <section className="mb-8 space-y-6">
                <div className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-purple-500 dark:text-purple-300" />
                  <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                    Unified growth metrics
                  </h2>
                </div>

                <div className="grid gap-4 lg:grid-cols-4">
                  <div className="rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800">
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                      Total users
                    </p>
                    <p className="mt-1 text-2xl font-heading font-semibold text-gray-900 dark:text-white">
                      {unifiedSummary.total_users.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Active {unifiedSummary.active_users.toLocaleString()} · New {unifiedSummary.new_users.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800">
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                      Customer revenue
                    </p>
                    <p className="mt-1 text-2xl font-heading font-semibold text-gray-900 dark:text-white">
                      ${unifiedSummary.customer.total_revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      AOV ${unifiedSummary.customer.avg_order_value.toFixed(2)} · LTV ${unifiedSummary.customer.ltv.toFixed(0)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800">
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                      Active vendors
                    </p>
                    <p className="mt-1 text-2xl font-heading font-semibold text-gray-900 dark:text-white">
                      {unifiedSummary.vendor.active_vendors}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Avg GMV ${unifiedSummary.vendor.avg_gmv_per_vendor.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800">
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                      Marketing ROAS
                    </p>
                    <p className="mt-1 text-2xl font-heading font-semibold text-gray-900 dark:text-white">
                      {unifiedSummary.marketing.overall_roas.toFixed(2)}x
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Spend ${unifiedSummary.marketing.total_ad_spend.toLocaleString()}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Growth Metrics */}
            {growthMetricCards.length > 0 && (
              <section className="mb-8 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
                <div className="mb-4 flex items-center gap-2">
                  <Compass className="h-5 w-5 text-emerald-500 dark:text-emerald-300" />
                  <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                    Growth diagnostics
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {growthMetricCards.map((card, index) => (
                    <div
                      key={card.label}
                      className={`rounded-2xl p-4 shadow-sm dark:shadow-none ${metricCardStyles[index % metricCardStyles.length]}`}
                    >
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                        {card.label}
                      </p>
                      <p className="mt-1 text-2xl font-heading font-semibold text-gray-900 dark:text-white">
                        {card.value}
                      </p>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{card.helper}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Channel & Cohorts */}
            <section className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
                <div className="mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                  <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                    Channel attribution
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-sm text-gray-600 dark:text-gray-300">
                    <thead>
                      <tr className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <th className="py-3">Channel</th>
                        <th className="py-3">Sessions</th>
                        <th className="py-3">Conv.</th>
                        <th className="py-3">Revenue</th>
                        <th className="py-3">ROAS / CPA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {channelPerformance.map((channel) => (
                        <tr key={channel.channel} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                          <td className="py-3 font-semibold text-gray-900 dark:text-white capitalize">
                            {channel.channel.replace('_', ' ')}
                          </td>
                          <td className="py-3">{channel.sessions.toLocaleString()}</td>
                          <td className="py-3">
                            {channel.conversions.toLocaleString()} ({channel.conversion_rate.toFixed(2)}%)
                          </td>
                          <td className="py-3">${channel.revenue.toLocaleString()}</td>
                          <td className="py-3 text-xs">
                            {channel.roas ? `${channel.roas.toFixed(2)}x ROAS` : '—'}{' '}
                            {channel.cpa ? `· CPA $${channel.cpa.toFixed(2)}` : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
                <div className="mb-4 flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-orange-500 dark:text-orange-300" />
                  <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                    Launch phases
                  </h2>
                </div>
                <div className="space-y-4">
                  {launchPhases.map((phase) => (
                    <div
                      key={phase.phase_number}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                            Phase {phase.phase_number}
                          </p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{phase.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{phase.description}</p>
                        </div>
                        <Badge
                          variant={phase.status === 'completed' ? 'success' : phase.status === 'in_progress' ? 'info' : 'secondary'}
                          size="sm"
                          className="capitalize"
                        >
                          {phase.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Progress</span>
                          <span>{phase.completion_percentage.toFixed(0)}%</span>
                        </div>
                        <div className="mt-1 h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                          <div
                            className="h-2 rounded-full bg-blue-500 dark:bg-blue-400"
                            style={{ width: `${phase.completion_percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 text-xs text-gray-600 dark:text-gray-300 sm:grid-cols-2">
                        <div>
                          <p className="font-semibold text-gray-700 dark:text-gray-200">Deliverables</p>
                          <ul className="mt-1 space-y-1">
                            {phase.deliverables?.map((item) => (
                              <li key={item}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 dark:text-gray-200">KPIs</p>
                          <ul className="mt-1 space-y-1">
                            {phase.kpis?.map((kpi) => (
                              <li key={kpi.metric}>
                                {kpi.metric}: {kpi.actual}/{kpi.target}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </motion.div>
    </div>
  );
}


