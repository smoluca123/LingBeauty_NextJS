'use client';

import { ProductListingSection } from '@/components/product-listing/product-listing-section';

interface CategoryProductsProps {
  categoryId: string;
  className?: string;
}

export function CategoryProducts({
  categoryId,
  className,
}: CategoryProductsProps) {
  return (
    <ProductListingSection
      contextParams={{ categoryId }}
      className={className}
    />
  );
}
