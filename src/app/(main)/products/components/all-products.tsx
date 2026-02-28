'use client';

import { ProductListingSection } from '@/components/product-listing/product-listing-section';

interface AllProductsProps {
  /** Initial page from URL for SSR hydration */
  initialPage?: number;
  className?: string;
}

/**
 * Client wrapper for all-products listing.
 * Passes initialPage and pageBaseUrl for URL-based pagination.
 */
export function AllProducts({ initialPage = 1, className }: AllProductsProps) {
  return (
    <ProductListingSection
      initialPage={initialPage}
      pageBaseUrl="/products"
      className={className}
    />
  );
}
