import { Suspense } from 'react';
import { ProductsContent } from './components';
import ProductsListingPageSkeleton from '@/components/skeletons/products-listing-page-skeleton';

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<ProductsListingPageSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}
