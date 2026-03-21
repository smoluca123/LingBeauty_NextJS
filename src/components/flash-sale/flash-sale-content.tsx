'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { HorizontalScroller } from '@/components/home/horizontal-scroller';
import { FlashSaleHeader } from './flash-sale-header';
import { FlashSaleProductCard } from './flash-sale-product-card';
import type {
  IFlashSaleDataType,
  IFlashSaleProductDataType,
} from '@/lib/types/interfaces/apis/flash-sale.interfaces';

interface FlashSaleContentProps {
  flashSale: IFlashSaleDataType;
}

export function FlashSaleContent({ flashSale }: FlashSaleContentProps) {
  const router = useRouter();

  const handleExpire = () => {
    router.refresh();
  };

  // Gom nhóm các record FlashSaleProduct theo productId để tránh hiển thị nhiều card
  // cho cùng một sản phẩm khi nhiều variants của nó được sale.
  const groupedProducts = useMemo(() => {
    const map = new Map<string, IFlashSaleProductDataType>();

    // First pass: Group raw records
    flashSale.products.forEach((p) => {
      if (!map.has(p.productId)) {
        // Clone the object deep enough to modify variants SAFELY
        const clonedProduct = { 
          ...p, 
          product: { 
            ...p.product, 
            variants: [] // We will fill this in
          } 
        };
        map.set(p.productId, clonedProduct);
      } 
      
      const existing = map.get(p.productId)!;
      
      // Cộng đồn số lượng tồn kho của các variants
      if (p.productId !== existing.productId || existing !== p) {
        if (p.productId === existing.productId && existing.id !== p.id) {
          existing.maxQuantity += p.maxQuantity;
          existing.soldQuantity += p.soldQuantity;
        }
      }

      // Ưu tiên hiển thị giá flash sale thấp nhất ở thẻ ngoài cùng
      const currentPrice = Number(p.flashPrice);
      const existingPrice = Number(existing.flashPrice);
      if (currentPrice < existingPrice) {
        existing.flashPrice = p.flashPrice;
        existing.originalPrice = p.originalPrice;
      }

      // Reconstruct variants array: Only include the variant(s) that are strictly on sale
      // If variantId is null, it means the whole product is on sale -> add all variants
      if (!p.variantId) {
        // The whole product is on sale, meaning all its original variants apply
        // Just map them to have the flash sale price overridden.
        const allSaleVariants = p.product.variants.map(v => ({
           ...v,
           price: p.flashPrice.toString()
        }));
        existing.product.variants = allSaleVariants;
      } else {
        // Find the specific variant from the original product data
        const originalVariant = p.product.variants.find(v => v.id === p.variantId);
        if (originalVariant) {
          // Push it with overridden price
          existing.product.variants.push({
            ...originalVariant,
            price: p.flashPrice.toString()
          });
        }
      }
    });

    return Array.from(map.values());
  }, [flashSale.products]);

  return (
    <section className="overflow-hidden rounded-2xl shadow-lg">
      <FlashSaleHeader endTime={flashSale.endTime} onExpire={handleExpire} />

      <div className="bg-linear-to-b from-purple-100 to-pink-50 p-4 md:p-6">
        <HorizontalScroller
          ariaLabel="Flash sale products"
          slidesPerView={{ mobile: 1, tablet: 3, desktop: 5 }}
        >
          {groupedProducts.map((product) => (
            <FlashSaleProductCard key={product.id} product={product} />
          ))}
        </HorizontalScroller>
      </div>
    </section>
  );
}
