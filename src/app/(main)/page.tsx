import { Suspense } from 'react';
import { BrandListSection } from '@/components/home/brands/brand-list';
import { TopProductsSection } from '@/components/home/products/top-products-section';
import HomeCarouselSection from '@/app/(main)/components/home-carousel-section';
import HomeFlashSaleSection from '@/app/(main)/components/home-flase-sale-section';

export default function MainPage() {
  return (
    <Suspense>
      <div className="font-sans">
        <main className="container space-y-6 py-4 md:py-6">
          <HomeCarouselSection />
          <TopProductsSection />
          <BrandListSection />
          <HomeFlashSaleSection />
        </main>
      </div>
    </Suspense>
  );
}
