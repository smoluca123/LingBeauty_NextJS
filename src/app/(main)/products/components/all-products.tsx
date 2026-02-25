'use client';

import { ProductListingSection } from '@/components/product-listing/product-listing-section';

interface AllProductsProps {
  className?: string;
}

/**
 * Client wrapper that passes SSR initial data to ProductListingSection.
 * No contextParams = show all products.
 */
export function AllProducts({ className }: AllProductsProps) {
  return <ProductListingSection className={className} />;
}
