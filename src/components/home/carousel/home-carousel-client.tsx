'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IBannerDataType } from '@/lib/types/interfaces/apis/banner.interfaces';

type HomeCarouselClientProps = {
  banners: IBannerDataType[];
};

const AUTOPLAY_INTERVAL = 5000;

// Fallback data
const FALLBACK_CAROUSEL: CarouselSlide[] = [
  {
    id: 'fallback-1',
    type: 'TEXT',
    badge: 'Beauty Box',
    title: 'FLASH SALE RINH QUÀ LINH ĐÌNH',
    description:
      'Áp dụng trên website và mua online nhận hàng nhanh tại cửa hàng.',
    ctaText: 'Mua ngay',
    ctaLink: '/products',
    highlight: 'Mua 1 tặng 3',
    subLabel: 'Số lượng quà tặng có hạn.',
    gradientFrom: '#ffe4f0',
    gradientTo: '#fff5fb',
  },
];

const FALLBACK_SIDE_TOP: SideBannerItem[] = [
  {
    id: 'fallback-side-1',
    type: 'TEXT',
    badge: 'Sạch sâu nhưng vẫn dịu nhẹ',
    title: 'Combo làm sạch da 100%',
    description: 'Làm sạch nhiều lớp makeup, không khô căng.',
    highlight: 'Chỉ từ 58K',
    ctaLink: '/products',
    gradientFrom: '#e5f6ff',
    gradientTo: '#ffffff',
  },
];

const FALLBACK_SIDE_BOTTOM: SideBannerItem[] = [
  {
    id: 'fallback-side-2',
    type: 'TEXT',
    badge: 'Dưỡng ẩm chuyên sâu',
    title: 'Kem dưỡng phục hồi',
    description: 'Bảo vệ hàng rào da hiệu quả.',
    highlight: 'Chỉ từ 199K',
    ctaLink: '/products',
    gradientFrom: '#fdf4ff',
    gradientTo: '#ffffff',
  },
];

export function HomeCarouselClient({ banners }: HomeCarouselClientProps) {
  // Transform and filter banners
  const { carouselSlides, sideTopBanners, sideBottomBanners } = useMemo(() => {
    const carouselBanners: CarouselSlide[] = banners
      .filter((b) => b.position === 'MAIN_CAROUSEL' && b.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((b) => ({
        id: b.id,
        type: b.type,
        badge: b.badge || '',
        title: b.title || '',
        description: b.description || '',
        ctaText: b.ctaText || 'Xem ngay',
        ctaLink: b.ctaLink || '/products',
        highlight: b.highlight || undefined,
        subLabel: b.subLabel || undefined,
        gradientFrom: b.gradientFrom || '#ffffff',
        gradientTo: b.gradientTo || '#f9fafb',
        imageUrl: b.imageMedia?.url,
      }));

    const sideTopBannersList: SideBannerItem[] = banners
      .filter((b) => b.position === 'SIDE_TOP' && b.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((b) => ({
        id: b.id,
        type: b.type,
        badge: b.badge || '',
        title: b.title || '',
        description: b.description || '',
        highlight: b.highlight || '',
        ctaLink: b.ctaLink || '/products',
        gradientFrom: b.gradientFrom || '#ffffff',
        gradientTo: b.gradientTo || '#f9fafb',
        imageUrl: b.imageMedia?.url,
      }));

    const sideBottomBannersList: SideBannerItem[] = banners
      .filter((b) => b.position === 'SIDE_BOTTOM' && b.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((b) => ({
        id: b.id,
        type: b.type,
        badge: b.badge || '',
        title: b.title || '',
        description: b.description || '',
        highlight: b.highlight || '',
        ctaLink: b.ctaLink || '/products',
        gradientFrom: b.gradientFrom || '#ffffff',
        gradientTo: b.gradientTo || '#f9fafb',
        imageUrl: b.imageMedia?.url,
      }));

    return {
      carouselSlides:
        carouselBanners.length > 0 ? carouselBanners : FALLBACK_CAROUSEL,
      sideTopBanners:
        sideTopBannersList.length > 0 ? sideTopBannersList : FALLBACK_SIDE_TOP,
      sideBottomBanners:
        sideBottomBannersList.length > 0
          ? sideBottomBannersList
          : FALLBACK_SIDE_BOTTOM,
    };
  }, [banners]);

  const { emblaRef, activeIndex, scrollNext, scrollPrev, scrollTo } =
    useHeroCarousel(carouselSlides.length);

  return (
    <section aria-label="Flash sale banner" className="w-full">
      <div className="flex flex-col gap-3 md:gap-4 lg:flex-row">
        {/* Banner lớn bên trái */}
        <div className="relative flex-1 overflow-hidden rounded-xl border bg-card shadow-sm group/slide">
          <HeroSlides slides={carouselSlides} emblaRef={emblaRef} />
          <CarouselControls
            slides={carouselSlides}
            activeIndex={activeIndex}
            onNext={scrollNext}
            onPrev={scrollPrev}
            onSelect={scrollTo}
          />
        </div>

        {/* 2 banner nhỏ bên phải */}
        <SideBannerGrid
          topBanners={sideTopBanners}
          bottomBanners={sideBottomBanners}
        />
      </div>
    </section>
  );
}

function useHeroCarousel(slideCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || slideCount <= 1) return;

    const autoplayId = setInterval(() => {
      if (!emblaApi) return;

      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, AUTOPLAY_INTERVAL);

    return () => {
      clearInterval(autoplayId);
    };
  }, [emblaApi, slideCount]);

  return {
    emblaRef,
    activeIndex,
    scrollNext: () => emblaApi?.scrollNext(),
    scrollPrev: () => emblaApi?.scrollPrev(),
    scrollTo: (index: number) => emblaApi?.scrollTo(index),
  };
}

type CarouselSlide = {
  id: string;
  type: 'TEXT' | 'IMAGE';
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  highlight?: string;
  subLabel?: string;
  gradientFrom: string;
  gradientTo: string;
  imageUrl?: string;
};

type CarouselControlsProps = {
  slides: CarouselSlide[];
  activeIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSelect: (index: number) => void;
};

function CarouselControls({
  slides,
  activeIndex,
  onNext,
  onPrev,
  onSelect,
}: CarouselControlsProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 hidden items-end justify-between p-3 sm:flex">
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrev}
          className="pointer-events-auto h-7 w-7 rounded-full border-2 border-white/80 bg-white/60 backdrop-blur-sm hover:bg-white/80"
          aria-label="Banner trước"
        >
          <ChevronLeft className="h-4 w-4 text-primary-pink" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          className="pointer-events-auto h-7 w-7 rounded-full border-2 border-white/80 bg-white/60 backdrop-blur-sm hover:bg-white/80"
          aria-label="Banner tiếp theo"
        >
          <ChevronRight className="h-4 w-4 text-primary-pink" />
        </Button>
      </div>

      <div className="pointer-events-auto flex items-center gap-1 absolute bottom-3 right-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => onSelect(index)}
            className={cn(
              'h-1.5 rounded-full transition-all cursor-pointer shadow-sm shadow-black/20',
              index === activeIndex ? 'w-5 bg-primary-pink' : 'w-2 bg-muted',
            )}
            aria-label={`Chuyển đến banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

type HeroSlidesProps = {
  slides: CarouselSlide[];
  emblaRef: (instance: HTMLElement | null) => void;
};

function HeroSlides({ slides, emblaRef }: HeroSlidesProps) {
  return (
    <div className="relative h-full">
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-0 flex-[0_0_100%] h-full">
              {slide.type === 'IMAGE' && slide.imageUrl ? (
                <Link href={slide.ctaLink} className="block h-full w-full">
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.imageUrl})` }}
                  />
                </Link>
              ) : (
                <div
                  className="h-full bg-linear-to-br px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, ${slide.gradientFrom}, ${slide.gradientTo})`,
                  }}
                >
                  <div className="flex h-full flex-col justify-between gap-3 md:gap-4">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-primary-pink">
                      <span className="rounded-full bg-white/90 px-3 py-1 shadow-xs">
                        {slide.badge}
                      </span>
                      {slide.highlight && (
                        <span className="rounded-full bg-primary-pink px-3 py-1 text-white shadow-xs">
                          {slide.highlight}
                        </span>
                      )}
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-primary-pink drop-shadow-sm">
                        {slide.title}
                      </h2>
                      <p className="mt-2 max-w-md text-xs sm:text-sm text-muted-foreground">
                        {slide.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        asChild
                        size="lg"
                        className="rounded-full bg-primary-pink px-6 text-sm font-semibold text-white shadow-xs hover:bg-primary-pink/90"
                      >
                        <Link href={slide.ctaLink}>{slide.ctaText}</Link>
                      </Button>
                      {slide.subLabel && (
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {slide.subLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type SideBannerItem = {
  id: string;
  type: 'TEXT' | 'IMAGE';
  badge: string;
  title: string;
  description: string;
  highlight: string;
  ctaLink: string;
  gradientFrom: string;
  gradientTo: string;
  imageUrl?: string;
};

type SideBannerGridProps = {
  topBanners: SideBannerItem[];
  bottomBanners: SideBannerItem[];
};

function SideBannerGrid({ topBanners, bottomBanners }: SideBannerGridProps) {
  return (
    <div className="flex w-full flex-row gap-3 md:gap-4 lg:w-md lg:flex-col">
      <SideBannerSlider slides={topBanners} />
      <SideBannerSlider slides={bottomBanners} />
    </div>
  );
}

function SideBannerSlider({ slides }: { slides: SideBannerItem[] }) {
  const { emblaRef, activeIndex, scrollTo } = useHeroCarousel(slides.length);

  return (
    <div className="relative flex-1 overflow-hidden rounded-xl border group/slide shadow-sm">
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((banner) => (
            <div key={banner.id} className="min-w-0 flex-[0_0_100%] h-full">
              {banner.type === 'IMAGE' && banner.imageUrl ? (
                <Link href={banner.ctaLink} className="block h-full w-full">
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${banner.imageUrl})` }}
                  />
                </Link>
              ) : (
                <Link href={banner.ctaLink} className="block h-full w-full">
                  <div
                    className="h-full w-full bg-linear-to-br p-4 sm:p-5 flex flex-col justify-center"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${banner.gradientFrom}, ${banner.gradientTo})`,
                    }}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-primary-pink">
                      {banner.badge}
                    </p>
                    <h3 className="mt-1 text-sm sm:text-base font-bold text-foreground">
                      {banner.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {banner.description}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-primary-pink">
                      {banner.highlight}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dots (only if more than 1 slide) */}
      {slides.length > 1 && (
        <div className="pointer-events-auto flex items-center gap-1 absolute bottom-3 right-3 z-10">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => scrollTo(index)}
              className={cn(
                'h-1.5 rounded-full transition-all cursor-pointer shadow-sm shadow-black/20',
                index === activeIndex
                  ? 'w-4 bg-primary-pink'
                  : 'w-1.5 bg-muted/80',
              )}
              aria-label={`Chuyển đến banner phụ ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
