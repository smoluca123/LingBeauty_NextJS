import { HomeCarouselClient } from '@/components/home/carousel/home-carousel-client';
import { getActiveBannerGroupAPI } from '@/lib/apis/server/banner-apis';
import { IBannerGroupMapping } from '@/lib/types/interfaces/apis/banner.interfaces';

/**
 * Server Component - Fetches banner data from API
 * Optimized for SEO with server-side rendering
 */
export async function HomeCarousel() {
  try {
    const response = await getActiveBannerGroupAPI();
    // Extract banners from junction table mappings
    const mappings = response?.data?.banners || [];
    const banners = mappings
      .map((mapping: IBannerGroupMapping) => mapping.banner)
      .filter(Boolean);

    return <HomeCarouselClient banners={banners} />;
  } catch (error) {
    console.error('Error in HomeCarousel:', error);
    // Return component with empty data - will use fallback
    return <HomeCarouselClient banners={[]} />;
  }
}
