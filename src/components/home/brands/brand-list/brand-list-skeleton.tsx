import { HorizontalScroller } from '@/components/home/horizontal-scroller';
import { Skeleton } from '@/components/ui/skeleton';

export function BrandListSkeleton() {
  return (
    <HorizontalScroller slidesPerView={{ mobile: 3, tablet: 5, desktop: 7 }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-xl" />
      ))}
    </HorizontalScroller>
  );
}
