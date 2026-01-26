import { HomeCarousel } from '@/components/home/home-carousel';
import { HomeCarouselSkeleton } from '@/components/home/home-carousel-skeleton';
import { Suspense } from 'react';

export default function HomeCarouselSection() {
  return (
    <Suspense fallback={<HomeCarouselSkeleton />}>
      <HomeCarousel />
    </Suspense>
  );
}
