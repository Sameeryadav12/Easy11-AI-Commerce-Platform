import { motion } from 'framer-motion';
import { ExternalLink, HeartHandshake } from 'lucide-react';
import { Card, CardBody, Button } from '../ui';
import type { UGCLook } from '../../types/community';

interface UGCGalleryProps {
  looks: UGCLook[];
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function UGCGallery({ looks, title = 'Customer gallery', ctaLabel, ctaHref }: UGCGalleryProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-300">
            Social proof
          </p>
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        {ctaHref && ctaLabel && (
          <Button asChild variant="secondary" size="sm" className="flex items-center gap-2">
            <a href={ctaHref}>
              <ExternalLink className="h-4 w-4" />
              {ctaLabel}
            </a>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {looks.map((look, idx) => (
          <motion.div
            key={look.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="h-full overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="relative">
                <img
                  src={look.media.url}
                  alt={look.media.alt}
                  className="h-64 w-full object-cover"
                />
                {look.featured && (
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-purple-600 shadow">
                    <HeartHandshake className="h-3.5 w-3.5" />
                    Featured
                  </span>
                )}
              </div>
              <CardBody className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                      {look.author.handle ?? look.author.name}
                    </p>
                    <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                      {look.title}
                    </h3>
                  </div>
                  <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                    <p>{new Date(look.createdAt).toLocaleDateString()}</p>
                    <p>{look.stats.favorites} saves · {look.stats.conversions} buys</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{look.description}</p>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500">
                    Shop the look
                  </p>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {look.taggedProducts.map((product) => (
                      <li key={product.productId}>
                        <a
                          href={product.url}
                          className="flex items-center justify-between gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-blue-50 hover:text-blue-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-blue-900/40 dark:hover:text-blue-200"
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
          </motion.div>
        ))}
      </div>

      {looks.length === 0 && (
        <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          There are no visuals yet for this product. Be the first to share your setup and earn loyalty bonuses once your look is approved.
        </p>
      )}
    </section>
  );
}


