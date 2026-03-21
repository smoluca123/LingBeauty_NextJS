import { Suspense } from 'react';
import { ReviewsContent } from './components';
import ProductsListingPageSkeleton from '@/components/skeletons/products-listing-page-skeleton';

export default function AdminReviewsPage() {
  return (
    <Suspense fallback={<ProductsListingPageSkeleton />}>
      <ReviewsContent />
    </Suspense>
  );
}
