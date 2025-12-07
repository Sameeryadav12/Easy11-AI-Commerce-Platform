import { useEffect } from 'react';
import { MyContributionsList } from '../../components/community/MyContributionsList';
import { useCommunityStore } from '../../store/communityStore';

export default function ContributionsPage() {
  const { contributions, fetchForProduct } = useCommunityStore((state) => ({
    contributions: state.contributions,
    fetchForProduct: state.fetchForProduct,
    productId: state.productId,
  }));

  useEffect(() => {
    if (!contributions.length) {
      // Fetch seeded contributions against primary demo product (id: 1)
      fetchForProduct('1');
    }
  }, [contributions.length, fetchForProduct]);

  return (
    <div className="space-y-10">
      <MyContributionsList contributions={contributions} />
    </div>
  );
}


