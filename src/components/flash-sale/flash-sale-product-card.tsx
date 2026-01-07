'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { isSoldOut } from '@/lib/utils/flash-sale-utils';
import { ProductCard } from '@/components/product/product-card';
import type { FlashSaleProduct } from '@/types/flash-sale';
import type { Product } from '@/types/product';

interface FlashSaleProductCardProps {
  product: FlashSaleProduct;
  className?: string;
}

export function FlashSaleProductCard({
  product,
  className,
}: FlashSaleProductCardProps) {
  const { flashPrice, originalPrice, maxQuantity, soldQuantity, badges } =
    product;

  const soldOut = isSoldOut(soldQuantity, maxQuantity);

  // Convert FlashSaleProduct to Product format for ProductCard
  const productData: Product = {
    id: product.product.id,
    name: product.product.name,
    brand: product.product.brand.name,
    image: product.product.image,
    price: flashPrice,
    originalPrice: originalPrice,
    rating: product.product.rating,
    reviewCount: product.product.reviewCount,
    badges: badges?.map((b) => ({
      label: b.label,
      variant: b.variant === 'freeship' ? 'info' : 'primary',
    })),
    dealLabel: 'Flash Sale',
  };

  const cardContent = (
    <div className={cn('relative h-full', soldOut && 'opacity-75', className)}>
      {/* Sold out overlay */}
      {soldOut && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/50">
          <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-800">
            Hết hàng
          </span>
        </div>
      )}

      <ProductCard
        product={productData}
        className="border-2 border-pink-200 hover:border-pink-300"
        showStock
        soldQuantity={soldQuantity}
        maxQuantity={maxQuantity}
      />
    </div>
  );

  if (soldOut) {
    return <div className="cursor-not-allowed">{cardContent}</div>;
  }

  return (
    <Link href={`/products/${product.product.slug}`} className="block h-full">
      {cardContent}
    </Link>
  );
}
