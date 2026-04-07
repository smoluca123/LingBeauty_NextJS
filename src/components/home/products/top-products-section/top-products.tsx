'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/style-utils'
import { HorizontalScroller } from '@/components/home/horizontal-scroller'
import { SectionHeading } from '@/components/home/section-heading'
import { ProductCard2 } from '@/components/product/product-card2'

import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import type { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces'

interface TopProductsProps {
  initialData: IApiResponseWrapperType<IProductDataType[]>
}

export const TopProducts = ({ initialData }: TopProductsProps) => {
  const products = initialData.data

  return (
    <section className="space-y-6">
      <SectionHeading
        eyebrow="Top Picks"
        title="Top Sản Phẩm Bán Chạy"
        subtitle="Những món được yêu thích nhất tuần này, cập nhật liên tục."
        action={
          <Button
            variant="outline"
            className="rounded-full border-primary-pink text-primary-pink hover:bg-primary-pink/10"
          >
            Xem tất cả
          </Button>
        }
      />

      <HorizontalScroller
        ariaLabel="Top sản phẩm"
        className="mt-4"
        slidesPerView={{ mobile: 1.5, tablet: 2.5, desktop: 5 }}
      >
        {products.map((item) => (
          <ProductCard2 key={item.id} product={item} className="w-full" />
        ))}
      </HorizontalScroller>

      <div className="text-center">
        <Link href="/products?sortBy=hot">
          <Button
            className={cn(
              'rounded-full bg-primary-pink px-6 text-white hover:bg-primary-pink/90',
            )}
          >
            Xem thêm ưu đãi
          </Button>
        </Link>
      </div>
    </section>
  )
}
