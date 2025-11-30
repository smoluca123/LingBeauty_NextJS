import { HomeCarousel } from '@/components/home/home-carousel';
import { TopProductsSection } from '@/components/home/products/top-products-section';

export default function MainPage() {
  return (
    <div className="font-sans">
      <main className="container space-y-6 py-4 md:py-6">
        <HomeCarousel />
        <TopProductsSection />
      </main>
    </div>
  );
}
