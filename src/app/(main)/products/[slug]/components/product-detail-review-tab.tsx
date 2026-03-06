import { Star, PenLine } from 'lucide-react';

// Placeholder UI for reviews tab (data will be implemented later)
export function ProductDetailReviewTab() {
  // Placeholder rating summaries
  const ratingDistribution = [5, 4, 3, 2, 1];

  return (
    <div className="space-y-8">
      {/* Summary stats */}
      <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center">
        {/* Average rating circle */}
        <div className="flex flex-col items-center gap-1.5 min-w-fit">
          <p className="text-6xl font-bold text-foreground">—</p>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-amber-200 text-amber-200"
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Chưa có đánh giá</p>
        </div>

        {/* Distribution bars */}
        <div className="flex-1 space-y-2">
          {ratingDistribution.map((star) => (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-4 text-right text-muted-foreground">
                {star}
              </span>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <div className="h-2 flex-1 rounded-full bg-muted">
                <div className="h-2 w-0 rounded-full bg-amber-400 transition-all" />
              </div>
              <span className="w-6 text-right text-xs text-muted-foreground">
                0
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Write review CTA */}
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-muted/30 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-pink/10">
          <PenLine className="h-6 w-6 text-primary-pink" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Chia sẻ trải nghiệm của bạn
        </p>
        <p className="max-w-xs text-xs text-muted-foreground">
          Hãy là người đầu tiên đánh giá sản phẩm này và giúp những khách hàng
          khác đưa ra lựa chọn tốt hơn.
        </p>
        <button className="mt-2 rounded-full border border-primary-pink px-6 py-2 text-sm font-semibold text-primary-pink transition-colors hover:bg-primary-pink/10">
          Viết đánh giá
        </button>
      </div>
    </div>
  );
}
