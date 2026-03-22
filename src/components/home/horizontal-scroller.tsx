'use client';

import {
  Children,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SCROLLER_GAP, DEFAULT_SLIDES_PER_VIEW } from '@/constants/ui';

type SlidesPerView = {
  mobile?: number;
  tablet?: number;
  desktop?: number;
};

type HorizontalScrollerProps = {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  ariaLabel?: string;
  slidesPerView?: SlidesPerView;
};

export function HorizontalScroller({
  children,
  className,
  itemClassName,
  ariaLabel,
  slidesPerView = DEFAULT_SLIDES_PER_VIEW,
}: HorizontalScrollerProps) {
  const [viewportRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    // Initial state sync from external Embla API
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const getItemWidthStyles = () => {
    const mobile = slidesPerView.mobile || DEFAULT_SLIDES_PER_VIEW.mobile;
    const tablet = slidesPerView.tablet || DEFAULT_SLIDES_PER_VIEW.tablet;
    const desktop = slidesPerView.desktop || DEFAULT_SLIDES_PER_VIEW.desktop;

    return {
      '--item-width-mobile': `calc((100% - ${
        (mobile - 1) * SCROLLER_GAP
      }rem) / ${mobile})`,
      '--item-width-tablet': `calc((100% - ${
        (tablet - 1) * SCROLLER_GAP
      }rem) / ${tablet})`,
      '--item-width-desktop': `calc((100% - ${
        (desktop - 1) * SCROLLER_GAP
      }rem) / ${desktop})`,
    } as React.CSSProperties;
  };

  const childCount = Children.count(children);
  const showControls = childCount > 0;

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className={cn('relative', className)} aria-label={ariaLabel}>
      <div className="overflow-x-hidden py-1" ref={viewportRef}>
        <div className="flex gap-4" style={getItemWidthStyles()}>
          {Children.map(children, (child, index) => (
            <div
              key={index}
              className={cn(
                'shrink-0',
                'w-(--item-width-mobile) min-w-(--item-width-mobile)',
                'sm:w-(--item-width-tablet) sm:min-w-(--item-width-tablet)',
                'lg:w-(--item-width-desktop) lg:min-w-(--item-width-desktop)',
                itemClassName,
              )}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {showControls && (
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between px-2 md:flex">
          <ScrollButton
            direction="prev"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
          />
          <ScrollButton
            direction="next"
            onClick={scrollNext}
            disabled={!canScrollNext}
          />
        </div>
      )}
    </div>
  );
}

type ScrollButtonProps = {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
};

function ScrollButton({ direction, onClick, disabled }: ScrollButtonProps) {
  return (
    <Button
      variant="secondary"
      size="icon-sm"
      className="pointer-events-auto rounded-full bg-white shadow-md hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
      aria-label={direction === 'next' ? 'Cuộn tiếp theo' : 'Cuộn trước đó'}
      onClick={onClick}
      disabled={disabled}
    >
      {direction === 'next' ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4" />
      )}
    </Button>
  );
}
