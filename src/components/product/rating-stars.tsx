import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

type RatingStarsProps = {
  rating?: number;
  reviewCount?: number;
};

export function RatingStars({ rating, reviewCount }: RatingStarsProps) {
  if (!rating) {
    return (
      <p className="mt-3 text-sm text-muted-foreground">
        Chưa có đánh giá
        {typeof reviewCount === 'number' &&
          reviewCount > 0 &&
          ` (${reviewCount})`}
      </p>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground mx-auto">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            'h-4 w-4',
            rating >= index + 1
              ? 'text-amber-400 fill-amber-400'
              : 'text-muted fill-transparent'
          )}
        />
      ))}
      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
      {typeof reviewCount === 'number' && (
        <span className="text-xs text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
