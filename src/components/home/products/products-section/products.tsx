'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/style-utils'
import { HorizontalScroller } from '@/components/home/horizontal-scroller'
import { SectionHeading } from '@/components/home/section-heading'
import { ProductCard2 } from '@/components/product/product-card2'

import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import type { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces'
import Link from 'next/link'

interface TopProductsProps {
  initialData: IApiPaginationResponseWrapperType<IProductDataType>
}

export const Products = ({ initialData }: TopProductsProps) => {
  const products = initialData.data.items

  return (
    <section className="space-y-6">
      <SectionHeading
        eyebrow="New"
        title="Sản phẩm mới"
        subtitle="Danh sách sản phẩm mới nhất"
        action={
          <Link href={'/products'}>
            <Button
              variant="outline"
              className="rounded-full border-primary-pink text-primary-pink hover:bg-primary-pink/10"
            >
              Xem tất cả
            </Button>
          </Link>
        }
      />

      <HorizontalScroller
        ariaLabel="Sản phẩm mới"
        className="mt-4"
        slidesPerView={{ mobile: 1.5, tablet: 2.5, desktop: 5 }}
      >
        {products.map((item) => (
          <ProductCard2 key={item.id} product={item} className="w-full" />
        ))}
      </HorizontalScroller>

      <div className="text-center">
        <Link href={'/products'}>
          <Button
            className={cn(
              'rounded-full bg-primary-pink px-6 text-white hover:bg-primary-pink/90',
            )}
          >
            Xem thêm
          </Button>
        </Link>
      </div>
    </section>
  )
}
