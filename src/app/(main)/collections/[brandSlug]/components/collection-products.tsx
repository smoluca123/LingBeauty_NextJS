'use client';

import { ProductListingSection } from '@/components/product-listing/product-listing-section';

interface CollectionProductsProps {
  brandId: string;
  className?: string;
}

export function CollectionProducts({
  brandId,
  className,
}: CollectionProductsProps) {
  return (
    <ProductListingSection contextParams={{ brandId }} className={className} />
  );
}
