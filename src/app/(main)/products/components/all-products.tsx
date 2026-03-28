'use client'

import {
  ProductListingSection,
  ProductListingContextParams,
} from '@/components/product-listing/product-listing-section'

interface AllProductsProps {
  /** Initial page from URL for SSR hydration */
  initialPage?: number
  /** Context params for filtering (e.g., search from URL) */
  contextParams?: ProductListingContextParams
  className?: string
}

/**
 * Client wrapper for all-products listing.
 * Passes initialPage and pageBaseUrl for URL-based pagination.
 */
export function AllProducts({
  initialPage = 1,
  contextParams,
  className,
}: AllProductsProps) {
  return (
    <ProductListingSection
      initialPage={initialPage}
      contextParams={contextParams}
      pageBaseUrl="/products"
      className={className}
    />
  )
}
