import { Suspense } from 'react';
import { BrandListSection } from '@/components/home/brands/brand-list';
import { TopProductsSection } from '@/components/home/products/top-products-section';
import HomeCarouselSection from '@/app/(main)/components/home-carousel-section';
import HomeFlashSaleSection from '@/app/(main)/components/home-flase-sale-section';
import BeautyBoxSection from '@/components/home/beauty-box';
import { TopTrendSection } from '@/components/home/top-trend';

export default function MainPage() {
  return (
    <Suspense>
      <div className="font-sans">
        <main className="container space-y-10 py-4 md:py-6">
          <HomeCarouselSection />
          <TopProductsSection />
          <BrandListSection />
          <HomeFlashSaleSection />
          <TopTrendSection />
          <BeautyBoxSection />
        </main>
      </div>
    </Suspense>
  );
}
