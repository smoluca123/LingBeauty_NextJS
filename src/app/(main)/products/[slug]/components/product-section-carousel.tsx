'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard2 } from '@/components/product/product-card2';
import { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces';
import useEmblaCarousel from 'embla-carousel-react';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: IProductDataType[];
  viewAllHref?: string;
}

/**
 * Horizontal scrollable product section using EmblaCarousel.
 * Used for "Cùng thương hiệu" and "Sản phẩm khác" sections.
 */
export function ProductSectionCarousel({
  title,
  subtitle,
  products,
  viewAllHref,
}: ProductSectionProps) {
  const [ref] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps',
  });

  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm font-semibold text-primary-pink hover:underline"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Embla horizontal scroll */}
      <div ref={ref} className="overflow-hidden">
        <div className="flex gap-4 touch-pan-y">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-[0_0_220px] sm:flex-[0_0_240px] md:flex-[0_0_260px]"
            >
              <ProductCard2 product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
