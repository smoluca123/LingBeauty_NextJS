import { FlashSaleSection } from '@/components/flash-sale';
import { FlashSaleSectionSkeleton } from '@/components/flash-sale/flash-sale-section-skeleton';
import { Suspense } from 'react';

export default function HomeFlashSaleSection() {
  return (
    <Suspense fallback={<FlashSaleSectionSkeleton />}>
      <FlashSaleSection />
    </Suspense>
  );
}
