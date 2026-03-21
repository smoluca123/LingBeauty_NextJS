import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getActiveFlashSaleAPI } from '@/lib/apis/server/flash-sale-apis';
import { FlashSaleContent } from '@/components/flash-sale/flash-sale-content';
import { FlashSaleSectionSkeleton } from '@/components/flash-sale/flash-sale-section-skeleton';

export const metadata: Metadata = {
  title: 'Flash Sale | LingBeauty',
  description:
    'Khám phá các sản phẩm flash sale với giá ưu đãi cực sốc tại LingBeauty. Số lượng có hạn, nhanh tay kẻo lỡ!',
  openGraph: {
    title: 'Flash Sale | LingBeauty',
    description:
      'Khám phá các sản phẩm flash sale với giá ưu đãi cực sốc tại LingBeauty. Số lượng có hạn, nhanh tay kẻo lỡ!',
  },
};

async function FlashSalePageContent() {
  const flashSale = await getActiveFlashSaleAPI();

  // Don't render if no active flash sale or no products
  if (
    !flashSale ||
    flashSale.status !== 'ACTIVE' ||
    flashSale.products.length === 0
  ) {
    notFound();
  }

  return <FlashSaleContent flashSale={flashSale} />;
}

export default function FlashSalePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<FlashSaleSectionSkeleton />}>
        <FlashSalePageContent />
      </Suspense>
    </div>
  );
}
