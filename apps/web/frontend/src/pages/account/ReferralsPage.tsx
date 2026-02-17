import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, RefreshCw, ExternalLink, Mail, MessageCircle, Share } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Badge } from '../../components/ui';
import { useRewardsStore } from '../../store/rewardsStore';
import type { ReferralInvite } from '../../types/rewards';

const statusStyles: Record<
  ReferralInvite['status'],
  { label: string; classes: string }
> = {
  pending: { label: 'Pending', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200' },
  joined: { label: 'Signed Up', classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200' },
  purchased: { label: 'First Purchase', classes: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200' },
  rewarded: { label: 'Rewarded', classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200' },
};

const channelLabels: Record<NonNullable<ReferralInvite['channel']>, string> = {
  email: 'Email',
  sms: 'SMS',
  social: 'Social',
  copy: 'Copied Link',
};

export default function ReferralsPage() {
  const {
    referralLink,
    referralStats,
    referralInvites,
    regenerateReferralLink,
    recordReferralShare,
    recordReferralSignup,
    recordReferralFirstPurchase,
  } = useRewardsStore((state) => ({
    referralLink: state.referralLink,
    referralStats: state.referralStats,
    referralInvites: state.referralInvites,
    regenerateReferralLink: state.regenerateReferralLink,
    recordReferralShare: state.recordReferralShare,
    recordReferralSignup: state.recordReferralSignup,
    recordReferralFirstPurchase: state.recordReferralFirstPurchase,
  }));

  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<'all' | ReferralInvite['status']>('all');

  const filteredInvites = useMemo(() => {
    if (filter === 'all') return referralInvites;
    return referralInvites.filter((invite) => invite.status === filter);
  }, [filter, referralInvites]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      recordReferralShare('copy');
    } catch (error) {
      console.error('Unable to copy referral link', error);
    }
  };

  const handleShare = (channel: ReferralInvite['channel']) => {
    if (!channel) return;
    recordReferralShare(channel);

    switch (channel) {
      case 'email': {
        const subject = encodeURIComponent('Join me on Easy11 and get $10 off!');
        const body = encodeURIComponent(
          `Hey! I have been loving Easy11. Use my link to get $10 off your first purchase: ${referralLink}`
        );
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        break;
      }
      case 'sms': {
        const message = encodeURIComponent(
          `Join me on Easy11 for curated deals. Use my link to get $10 off: ${referralLink}`
        );
        window.location.href = `sms:?&body=${message}`;
        break;
      }
      case 'social': {
        if (navigator.share) {
          navigator.share({
            title: 'Shop smarter with Easy11',
            text: 'Unlock curated drops and loyalty perks. Use my link to get $10 off.',
            url: referralLink,
          });
        } else {
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Shop smarter with Easy11! ${referralLink}`)}`);
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blue-500 dark:text-blue-300">
              Loyalty · Sprint 4
            </p>
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Refer friends & earn together
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
              Share your invite link and both of you unlock store credit after their first purchase.
              Track signups, conversions, and rewards in real time.
            </p>
          </div>
          <Button variant="secondary" onClick={regenerateReferralLink} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Generate new link
          </Button>
        </div>

        <Card className="border border-blue-200/60 dark:border-blue-900/40 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-900/10 dark:to-emerald-900/10">
          <CardHeader className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-blue-600 p-2 text-white">
                <Share2 className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">Your referral link</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share the magic — friends get $10 and you earn EasyPoints after their first order.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopyLink} className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy link'}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleShare('social')} className="flex items-center gap-2">
                <Share className="h-4 w-4" />
                Share
              </Button>
            </div>
          </CardHeader>
          <CardBody className="grid gap-6 border-t border-blue-200/60 bg-white/70 p-6 dark:border-blue-900/40 dark:bg-gray-900/60">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <code className="flex-1 overflow-hidden text-ellipsis rounded-xl bg-gray-900/90 px-4 py-3 text-sm text-white">
                  {referralLink}
                </code>
                <Button variant="primary" size="sm" onClick={() => handleShare('email')} className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email invite
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleShare('sms')} className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Text invite
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Invites sent" value={referralStats.invitesSent} trend="+2 this week" />
              <StatCard label="Signups" value={referralStats.signups} trend="61% conversion" />
              <StatCard label="First purchases" value={referralStats.conversions} trend="+1 today" />
              <StatCard
                label="Rewards earned"
                value={`$${referralStats.totalRewards.toFixed(0)}`}
                trend={`${referralStats.pendingRewards} pending`}
              />
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-heading font-semibold text-gray-900 dark:text-white">
            Referral activity
          </h2>
          <div className="flex gap-2">
            {(['all', 'pending', 'joined', 'purchased', 'rewarded'] as const).map((option) => (
              <Button
                key={option}
                variant={filter === option ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilter(option)}
              >
                {option === 'all' ? 'All' : statusStyles[option].label}
              </Button>
            ))}
          </div>
        </div>

        <Card>
          <CardBody className="space-y-3">
            {filteredInvites.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No invites yet. Share your link to start tracking conversions.
                </p>
              </div>
            )}

            {filteredInvites.map((invite) => {
              const style = statusStyles[invite.status];
              return (
                <div
                  key={invite.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-700/40 md:flex-row md:items-center"
                >
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{invite.name}</p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${style.classes}`}
                      >
                        {style.label}
                      </span>
                      {invite.channel && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          {channelLabels[invite.channel]}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{invite.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Invited {new Date(invite.invitedAt).toLocaleDateString()} ·{' '}
                      {invite.lastActivity
                        ? `Last activity ${new Date(invite.lastActivity).toLocaleDateString()}`
                        : 'Awaiting first action'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {invite.status === 'rewarded' && invite.rewardEarned != null && (
                      <p className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                        +{invite.rewardEarned} pts earned
                      </p>
                    )}
                    {invite.status === 'pending' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => recordReferralSignup(invite.id)}
                      >
                        Mark as signed up
                      </Button>
                    )}
                    {invite.status === 'joined' && (
                      <Button
                        variant="primary"
                                        size="sm"
                                        onClick={() => recordReferralFirstPurchase(invite.id)}
                      >
                        Mark first purchase
                      </Button>
                    )}
                    {invite.status !== 'rewarded' && invite.status !== 'pending' && invite.status !== 'joined' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
                        onClick={() => handleShare(invite.channel ?? 'copy')}
                      >
                        Nudge
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardBody>
        </Card>
      </section>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  trend?: string;
}

function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-gray-900/60">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-heading font-bold text-gray-900 dark:text-white">{value}</p>
      {trend && <p className="text-xs text-gray-500 dark:text-gray-400">{trend}</p>}
    </div>
  );
}


