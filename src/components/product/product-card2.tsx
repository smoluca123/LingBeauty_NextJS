'use client';

import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IPropsWithClassName } from '@/lib/types/interfaces/utils.interfaces';
import {
  IProductDataType,
  IProductVariantDataType,
} from '@/lib/types/interfaces/apis/product.interfaces';
import { ProductBadges } from '@/components/product/product-badges';
import {
  ProductImageCarousel,
  ProductImageCarouselRef,
} from '@/components/product/product-image-carousel';
import { ProductVariantSelector } from '@/components/product/product-variant-selector';
import { ProductPrice } from '@/components/product/product-price';
import { ProductHeader } from '@/components/product/product-header';
import { RatingStars } from '@/components/product/rating-stars';
import { useProductImages } from '@/hooks/use-product-images';

type ProductCardProps = {
  product: IProductDataType;
} & IPropsWithClassName;

export function ProductCard2({ product, className }: ProductCardProps) {
  const { name, brand, primaryImage } = product;
  const basePrice = Number(product.basePrice);
  const comparePrice = Number(product.comparePrice);

  const carouselRef = useRef<ProductImageCarouselRef>(null);
  const allImages = useProductImages(product);

  const handleVariantClick = (variant: IProductVariantDataType) => {
    if (!variant.images || variant.images.length === 0) return;

    const variantImage = variant.images[0];
    const imageIndex = allImages.findIndex(
      (img) => img.media.url === variantImage.media.url
    );

    if (imageIndex !== -1) {
      carouselRef.current?.scrollTo(imageIndex);
    }
  };

  const discountPercent =
    comparePrice && comparePrice > basePrice
      ? Math.round(((comparePrice - basePrice) / comparePrice) * 100)
      : null;

  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-2xl border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group/product',
        className
      )}
    >
      <ProductHeader discountPercent={discountPercent} />

      <ProductImageCarousel
        ref={carouselRef}
        images={allImages}
        productName={name}
      />

      <ProductBadges product={product} />

      <div className="mt-3 space-y-1 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {brand.name}
        </p>
        <h3 className="text-base font-semibold text-foreground line-clamp-3">
          {name}
        </h3>
      </div>

      <ProductPrice basePrice={basePrice} comparePrice={comparePrice} />

      <ProductVariantSelector
        variants={product.variants}
        primaryImage={primaryImage}
        onVariantClick={handleVariantClick}
      />

      <Button
        variant="outline"
        className="mt-4 rounded-full border-primary-pink text-primary-pink hover:bg-primary-pink/10"
      >
        Xem chi tiết
      </Button>

      <RatingStars rating={5} reviewCount={500} />
    </article>
  );
}
