import { useMemo, useState } from 'react';
import { ThumbsUp, ThumbsDown, Camera, Filter } from 'lucide-react';
import { Button, Card, CardBody, Badge } from '../ui';
import type { Review } from '../../types/community';
import { useCommunityStore } from '../../store/communityStore';

const sortPresets = [
  { value: 'helpful', label: 'Most helpful' },
  { value: 'recent', label: 'Most recent' },
  { value: 'photos', label: 'With photos' },
];

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  const [sort, setSort] = useState<string>('helpful');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const voteReviewHelpful = useCommunityStore((state) => state.voteReviewHelpful);

  const filtered = useMemo(() => {
    let list = [...reviews];
    if (ratingFilter) {
      list = list.filter((review) => review.rating === ratingFilter);
    }

    switch (sort) {
      case 'recent':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'photos':
        list.sort((a, b) => (b.photos?.length ?? 0) - (a.photos?.length ?? 0));
        break;
      case 'helpful':
      default:
        list.sort((a, b) => b.helpfulCount - a.helpfulCount);
    }

    return list;
  }, [reviews, sort, ratingFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Filter className="h-4 w-4" />
          <span>Filter reviews</span>
          <div className="flex gap-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={ratingFilter === rating ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setRatingFilter(ratingFilter === rating ? null : rating)}
              >
                {rating}★
              </Button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {sortPresets.map((preset) => (
            <Button
              key={preset.value}
              variant={sort === preset.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSort(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((review) => (
          <Card key={review.id} className="border border-gray-200 dark:border-gray-700">
            <CardBody className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, idx) => (
                        <span
                          key={idx}
                          className={`text-lg ${idx < review.rating ? 'text-yellow-500' : 'text-gray-200 dark:text-gray-600'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    {review.verifiedPurchase && (
                      <Badge variant="success" size="sm">
                        Verified purchase
                      </Badge>
                    )}
                    {review.tags?.map((tag) => (
                      <Badge key={tag} variant="info" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                    {review.title}
                  </h3>
                </div>
                <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                  <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                  <p>{review.author.name}</p>
                  {review.author.tier && <p>{review.author.tier} member</p>}
                </div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300">{review.body}</p>

              {review.photos && review.photos.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {review.photos.map((photo) => (
                    <figure key={photo.id} className="relative">
                      <img
                        src={photo.url}
                        alt={photo.alt}
                        className="h-28 w-28 rounded-xl object-cover"
                      />
                      <span className="absolute bottom-2 left-2 flex items-center rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                        <Camera className="mr-1 h-3 w-3" />
                        UGC
                      </span>
                    </figure>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span>
                  Helpful?{' '}
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-gray-700 dark:text-gray-300"
                    onClick={() => voteReviewHelpful(review.id, 'up')}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {review.helpfulCount}
                  </button>
                  <button
                    type="button"
                    className="ml-2 inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-rose-400 hover:text-rose-500 dark:border-gray-700 dark:text-gray-300"
                    onClick={() => voteReviewHelpful(review.id, 'down')}
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                    {review.notHelpfulCount}
                  </button>
                </span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}


