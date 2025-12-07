import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Card, CardBody, Button } from '../../components/ui';
import { useCommunityStore } from '../../store/communityStore';
import { UGCGallery } from '../../components/community/UGCGallery';

export default function LookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { gallery, fetchForProduct, hub, fetchHub } = useCommunityStore((state) => ({
    gallery: state.gallery,
    fetchForProduct: state.fetchForProduct,
    hub: state.hub,
    fetchHub: state.fetchHub,
  }));

  useEffect(() => {
    fetchForProduct('1');
    fetchHub();
  }, [fetchForProduct, fetchHub]);

  const look = useMemo(() => gallery.find((item) => item.id === id), [gallery, id]);

  if (!look) {
    return (
      <div className="container-custom py-24 text-center text-sm text-gray-500 dark:text-gray-400">
        We could not find that look. Head back to the <Link className="text-blue-600 dark:text-blue-300" to="/community">community hub</Link>.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="container-custom space-y-10 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="secondary" size="sm" className="flex items-center gap-2">
              <Link to="/community">
                <ArrowLeft className="h-4 w-4" />
                Back to community
              </Link>
            </Button>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                Look detail
              </p>
              <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">{look.title}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                by {look.author.name} · {new Date(look.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button variant="primary" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Card className="overflow-hidden border border-gray-200 dark:border-gray-700">
            <img src={look.media.url} alt={look.media.alt} className="h-[520px] w-full object-cover" />
          </Card>
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardBody className="space-y-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">{look.description}</p>
              <div className="grid grid-cols-3 gap-3 text-xs text-gray-500 dark:text-gray-400">
                <div>
                  <p className="text-lg font-heading font-semibold text-gray-900 dark:text-white">{look.stats.favorites}</p>
                  <p>Favorites</p>
                </div>
                <div>
                  <p className="text-lg font-heading font-semibold text-gray-900 dark:text-white">{look.stats.comments}</p>
                  <p>Comments</p>
                </div>
                <div>
                  <p className="text-lg font-heading font-semibold text-gray-900 dark:text-white">{look.stats.conversions}</p>
                  <p>Conversions</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500">
                  Shop the look
                </p>
                <ul className="mt-2 space-y-2">
                  {look.taggedProducts.map((product) => (
                    <li key={product.productId}>
                      <a
                        href={product.url}
                        className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-800 transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:text-blue-200"
                      >
                        <span>{product.name}</span>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-300">
                          ${product.price.toFixed(0)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </CardBody>
          </Card>
        </div>

        <UGCGallery
          looks={(hub?.featuredSections ?? []).flatMap((section) => section.looks).filter((item) => item.id !== look.id)}
          title="More looks you might like"
        />
      </div>
    </div>
  );
}


