import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Truck, CheckCircle } from 'lucide-react';
import { Button, Card, CardBody } from '../../components/ui';
import { useRewardsStore } from '../../store/rewardsStore';
import { redeemRewardPoints } from '../../services/rewardsAPI';
import { useAuthStore } from '../../store/authStore';
import {
  REDEEM_POINTS_FOR_10_DOLLARS,
  REDEEM_DOLLAR_VALUE,
  REDEEM_FREE_SHIPPING_POINTS,
} from '../../utils/rewardsConstants';
import toast from 'react-hot-toast';

type RedemptionOption = 'dollars' | 'free_shipping';

export default function RedemptionsPage() {
  const { user } = useAuthStore();
  const { summary, redeemPoints, canRedeemPoints, refreshRewardsExperience } = useRewardsStore();
  const available = summary.availablePoints ?? 0;
  const [redeeming, setRedeeming] = useState<RedemptionOption | null>(null);

  const handleRedeem = async (option: RedemptionOption) => {
    if (option === 'dollars') {
      if (!canRedeemPoints(REDEEM_POINTS_FOR_10_DOLLARS)) {
        toast.error(`You need at least ${REDEEM_POINTS_FOR_10_DOLLARS} points. You have ${available}.`);
        return;
      }
      setRedeeming('dollars');
      try {
        if (user?.id) {
          const { couponCode } = await redeemRewardPoints(REDEEM_POINTS_FOR_10_DOLLARS);
          redeemPoints(REDEEM_POINTS_FOR_10_DOLLARS, `$${REDEEM_DOLLAR_VALUE} off coupon`);
          await refreshRewardsExperience({ force: true });
          toast.success(`Redeemed! Use code ${couponCode} at checkout for $${REDEEM_DOLLAR_VALUE} off.`);
        } else {
          redeemPoints(REDEEM_POINTS_FOR_10_DOLLARS, `$${REDEEM_DOLLAR_VALUE} off coupon`);
          toast.success(`Redeemed! Use code E11REWARD-xxx at checkout for $${REDEEM_DOLLAR_VALUE} off.`);
        }
      } catch (err) {
        toast.error('Redemption failed. Please try again.');
      } finally {
        setRedeeming(null);
      }
    } else {
      if (!canRedeemPoints(REDEEM_FREE_SHIPPING_POINTS)) {
        toast.error(`You need at least ${REDEEM_FREE_SHIPPING_POINTS} points. You have ${available}.`);
        return;
      }
      setRedeeming('free_shipping');
      try {
        if (user?.id) {
          const { couponCode } = await redeemRewardPoints(REDEEM_FREE_SHIPPING_POINTS);
          redeemPoints(REDEEM_FREE_SHIPPING_POINTS, 'Free shipping voucher');
          await refreshRewardsExperience({ force: true });
          toast.success(`Redeemed! Use code ${couponCode} at checkout for free standard shipping.`);
        } else {
          redeemPoints(REDEEM_FREE_SHIPPING_POINTS, 'Free shipping voucher');
          toast.success('Redeemed! Use code at checkout for free standard shipping.');
        }
      } catch (err) {
        toast.error('Redemption failed. Please try again.');
      } finally {
        setRedeeming(null);
      }
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
          Redeem points
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Use your available points for store credit or free shipping. Each redemption is recorded in your ledger.
        </p>
      </motion.div>

      <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Available to redeem: <span className="font-bold text-teal-600 dark:text-teal-400">{available.toLocaleString()} pts</span>
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardBody className="flex flex-col gap-4 p-6">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                <Gift className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                  ${REDEEM_DOLLAR_VALUE} off coupon
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {REDEEM_POINTS_FOR_10_DOLLARS} points = ${REDEEM_DOLLAR_VALUE} off your next order
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              className="w-full"
              disabled={!canRedeemPoints(REDEEM_POINTS_FOR_10_DOLLARS) || redeeming !== null}
              onClick={() => handleRedeem('dollars')}
            >
              {redeeming === 'dollars' ? 'Redeeming…' : `Redeem ${REDEEM_POINTS_FOR_10_DOLLARS} pts`}
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-col gap-4 p-6">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                <Truck className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                  Free shipping voucher
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {REDEEM_FREE_SHIPPING_POINTS} points = free standard shipping on one order
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              className="w-full"
              disabled={!canRedeemPoints(REDEEM_FREE_SHIPPING_POINTS) || redeeming !== null}
              onClick={() => handleRedeem('free_shipping')}
            >
              {redeeming === 'free_shipping' ? 'Redeeming…' : `Redeem ${REDEEM_FREE_SHIPPING_POINTS} pts`}
            </Button>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody className="flex items-start gap-3 p-6">
          <CheckCircle className="h-5 w-5 shrink-0 text-teal-500" />
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium text-gray-900 dark:text-white">After you redeem</p>
            <p className="mt-1">
              Points are deducted from your available balance and a &quot;Redeemed&quot; entry is added to your
              points history. Use the code shown in the success message at checkout.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
