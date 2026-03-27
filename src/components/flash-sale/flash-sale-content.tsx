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
        const allSaleVariants = p.product.variants.map((v) => {
          const fsAvail = Math.max(0, p.maxQuantity - p.soldQuantity);
          const limit = p.limitPerOrder || fsAvail;
          const allowedQuantity = Math.min(v.inventory?.quantity || 0, fsAvail, limit);
          
          return {
            ...v,
            price: p.flashPrice.toString(),
            inventory: v.inventory ? {
              ...v.inventory,
              quantity: allowedQuantity,
              displayStatus: allowedQuantity > 0 ? v.inventory.displayStatus : 'OUT_OF_STOCK'
            } : v.inventory
          };
        });
        existing.product.variants = allSaleVariants as unknown as typeof p.product.variants;
      } else {
        // Find the specific variant from the original product data
        const originalVariant = p.product.variants.find(v => v.id === p.variantId);
        if (originalVariant) {
          const fsAvail = Math.max(0, p.maxQuantity - p.soldQuantity);
          const limit = p.limitPerOrder || fsAvail;
          const allowedQuantity = Math.min(originalVariant.inventory?.quantity || 0, fsAvail, limit);

          // Push it with overridden price and updated inventory
          existing.product.variants.push({
            ...originalVariant,
            price: p.flashPrice.toString(),
            inventory: originalVariant.inventory ? {
              ...originalVariant.inventory,
              quantity: allowedQuantity,
              displayStatus: allowedQuantity > 0 ? originalVariant.inventory.displayStatus : 'OUT_OF_STOCK'
            } : originalVariant.inventory
          } as unknown as typeof originalVariant);
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
