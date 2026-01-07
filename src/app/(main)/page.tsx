import { BrandListSection } from '@/components/home/brands/brand-list';
import { FlashSaleSection } from '@/components/flash-sale';
import { HomeCarousel } from '@/components/home/home-carousel';
import { TopProductsSection } from '@/components/home/products/top-products-section';

export default function MainPage() {
  return (
    <div className="font-sans">
      <main className="container space-y-6 py-4 md:py-6">
        <HomeCarousel />
        <TopProductsSection />
        <BrandListSection />
        <FlashSaleSection />
      </main>
    </div>
  );
}
