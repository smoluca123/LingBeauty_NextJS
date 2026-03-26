import { Suspense } from 'react';
import { QandAContent } from './components';
import ProductsListingPageSkeleton from '@/components/skeletons/products-listing-page-skeleton';

export default function AdminQandAPage() {
  return (
    <Suspense fallback={<ProductsListingPageSkeleton />}>
      <QandAContent />
    </Suspense>
  );
}
