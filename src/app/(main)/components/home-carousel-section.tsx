import { HomeCarousel, HomeCarouselSkeleton } from '@/components/home/carousel';
import { Suspense } from 'react';

export default function HomeCarouselSection() {
  return (
    <Suspense fallback={<HomeCarouselSkeleton />}>
      <HomeCarousel />
    </Suspense>
  );
}
