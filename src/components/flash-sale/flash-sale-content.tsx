'use client';

import { useRouter } from 'next/navigation';
import { HorizontalScroller } from '@/components/home/horizontal-scroller';
import { FlashSaleHeader } from './flash-sale-header';
import { FlashSaleProductCard } from './flash-sale-product-card';
import type { FlashSale } from '@/types/flash-sale';

interface FlashSaleContentProps {
  flashSale: FlashSale;
}

export function FlashSaleContent({ flashSale }: FlashSaleContentProps) {
  const router = useRouter();

  const handleExpire = () => {
    router.refresh();
  };

  return (
    <section className="overflow-hidden rounded-2xl shadow-lg">
      <FlashSaleHeader endTime={flashSale.endTime} onExpire={handleExpire} />

      <div className="bg-linear-to-b from-purple-100 to-pink-50 p-4 md:p-6">
        <HorizontalScroller
          ariaLabel="Flash sale products"
          slidesPerView={{ mobile: 2, tablet: 3, desktop: 5 }}
        >
          {flashSale.products.map((product) => (
            <FlashSaleProductCard key={product.id} product={product} />
          ))}
        </HorizontalScroller>
      </div>
    </section>
  );
}
