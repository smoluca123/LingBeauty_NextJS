import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductCard2Skeleton } from '@/components/product'
import { HorizontalScroller } from '@/components/home/horizontal-scroller'
import { SectionHeading } from '@/components/home/section-heading'

/**
 * Skeleton loading state for TopProductsSection
 * Shows while server component is fetching initial data
 */
export function TopProductsSkeleton() {
  return (
    <section className="space-y-6">
      <SectionHeading
        eyebrow="New"
        title="Sản phẩm mới"
        subtitle="Những món được yêu thích nhất tuần này, cập nhật liên tục."
        action={
          <Button
            variant="outline"
            className="rounded-full border-primary-pink text-primary-pink hover:bg-primary-pink/10"
            disabled
          >
            Xem tất cả
          </Button>
        }
      />

      <HorizontalScroller
        ariaLabel="Top sản phẩm đang tải"
        className="mt-4"
        slidesPerView={{ mobile: 1.5, tablet: 2.5, desktop: 5 }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <ProductCard2Skeleton key={index} className="w-full" />
        ))}
      </HorizontalScroller>

      <div className="text-center">
        <Skeleton className="mx-auto h-10 w-40 rounded-full" />
      </div>
    </section>
  )
}
