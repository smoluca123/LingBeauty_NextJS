'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Slide = {
  id: number;
  badge: string;
  title: string;
  description: string;
  cta: string;
  highlight?: string;
  subLabel?: string;
  bgClass: string;
};

type SideBanner = {
  id: number;
  label: string;
  title: string;
  description: string;
  highlight: string;
  bgClass: string;
};

const slides: Slide[] = [
  {
    id: 1,
    badge: 'Beauty Box',
    title: 'FLASH SALE RINH QUÀ LINH ĐÌNH',
    description:
      'Áp dụng trên website và mua online nhận hàng nhanh tại cửa hàng.',
    cta: 'Mua ngay',
    highlight: 'Mua 1 tặng 3',
    subLabel: 'Số lượng quà tặng có hạn.',
    bgClass: 'from-[#ffe4f0] via-[#ffd6e6] to-[#fff5fb]',
  },
  {
    id: 2,
    badge: 'Ưu đãi hôm nay',
    title: 'Giảm đến 50% sản phẩm chăm sóc da',
    description:
      'Chọn ngay routine phù hợp cho làn da của bạn với deal siêu hời.',
    cta: 'Khám phá ngay',
    highlight: 'Giảm đến -50%',
    subLabel: 'Áp dụng cho sản phẩm được gắn nhãn Flash Sale.',
    bgClass: 'from-[#e0f2ff] via-[#f5f9ff] to-[#ffffff]',
  },
  {
    id: 3,
    badge: 'Hội viên mới',
    title: 'Tặng voucher 50K cho đơn đầu tiên',
    description: 'Đăng ký tài khoản để nhận thêm nhiều ưu đãi cực dễ thương.',
    cta: 'Đăng ký ngay',
    highlight: 'Voucher 50K',
    subLabel: 'Áp dụng cho đơn từ 299K.',
    bgClass: 'from-[#fff4e0] via-[#fff9ec] to-[#ffffff]',
  },
];

const sideBanners: SideBanner[] = [
  {
    id: 1,
    label: 'Sạch sâu nhưng vẫn dịu nhẹ',
    title: 'Combo làm sạch da 100%',
    description: 'Làm sạch nhiều lớp makeup, không khô căng.',
    highlight: 'Chỉ từ 58K',
    bgClass: 'from-[#e5f6ff] via-[#f4fbff] to-[#ffffff]',
  },
  {
    id: 2,
    label: 'Độc quyền tại Beauty Box',
    title: 'Kem nền Mesh Blur mịn lì',
    description: 'Hiệu ứng blur mờ mịn, che phủ cho lớp nền tự nhiên.',
    highlight: 'Mua kèm nhận quà tặng',
    bgClass: 'from-[#f4e6ff] via-[#faf1ff] to-[#ffffff]',
  },
];

const AUTOPLAY_INTERVAL = 5000;

export function HomeCarousel() {
  const { emblaRef, activeIndex, scrollNext, scrollPrev, scrollTo } =
    useHeroCarousel(slides.length);

  return (
    <section aria-label="Flash sale banner" className="w-full">
      <div className="flex flex-col gap-3 md:gap-4 lg:flex-row">
        {/* Banner lớn bên trái */}
        <div className="relative flex-1 overflow-hidden rounded-xl border bg-card shadow-sm group/slide">
          <HeroSlides slides={slides} emblaRef={emblaRef} />
          <CarouselControls
            slides={slides}
            activeIndex={activeIndex}
            onNext={scrollNext}
            onPrev={scrollPrev}
            onSelect={scrollTo}
          />
        </div>

        {/* 2 banner nhỏ bên phải */}
        <SideBannerGrid banners={sideBanners} />
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
    if (!emblaApi || slideCount === 0) return;

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
  } satisfies {
    emblaRef: (node: HTMLElement | null) => void;
    activeIndex: number;
    scrollNext: () => void;
    scrollPrev: () => void;
    scrollTo: (index: number) => void;
  };
}

type CarouselControlsProps = {
  slides: Slide[];
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
};

function CarouselControls({
  slides,
  activeIndex,
  onPrev,
  onNext,
  onSelect,
}: CarouselControlsProps) {
  return (
    <div className="pointer-events-none absolute h-full inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-3 sm:px-4">
      <div className="pointer-events-auto flex items-center justify-between w-full gap-2">
        <Button
          variant="secondary"
          size="icon-sm"
          className="rounded-full bg-white/90 cursor-pointer shadow-md hover:bg-white"
          onClick={onPrev}
          aria-label="Banner trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon-sm"
          className="rounded-full bg-white/90 cursor-pointer shadow-md hover:bg-white"
          onClick={onNext}
          aria-label="Banner tiếp theo"
        >
          <ChevronRight className="h-4 w-4" />
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
              index === activeIndex ? 'w-5 bg-primary-pink' : 'w-2 bg-muted'
            )}
            aria-label={`Chuyển đến banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

type HeroSlidesProps = {
  slides: Slide[];
  emblaRef: (instance: HTMLElement | null) => void;
};

function HeroSlides({ slides, emblaRef }: HeroSlidesProps) {
  return (
    <div className="relative h-full">
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-0 flex-[0_0_100%]">
              <div
                className={cn(
                  'h-full bg-linear-to-br px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8',
                  slide.bgClass
                )}
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
                      size="lg"
                      className="rounded-full bg-primary-pink px-6 text-sm font-semibold text-white shadow-xs hover:bg-primary-pink/90"
                    >
                      {slide.cta}
                    </Button>
                    {slide.subLabel && (
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {slide.subLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type SideBannerGridProps = {
  banners: SideBanner[];
};

function SideBannerGrid({ banners }: SideBannerGridProps) {
  return (
    <div className="flex w-full flex-row gap-3 md:gap-4 lg:w-md lg:flex-col">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className={cn(
            'flex-1 rounded-xl border bg-linear-to-br p-4 sm:p-5 shadow-sm',
            banner.bgClass
          )}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-primary-pink">
            {banner.label}
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
      ))}
    </div>
  );
}
