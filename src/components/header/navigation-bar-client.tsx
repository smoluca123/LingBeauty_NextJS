'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ICategoryDataType } from '@/lib/types/interfaces/apis/header.interfaces';

interface NavigationBarClientProps {
  categories: ICategoryDataType[];
}

export function NavigationBarClient({ categories }: NavigationBarClientProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const handleMouseEnter = (categoryLabel: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setOpenCategory(categoryLabel);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setOpenCategory(null);
    }, 300);
    setHoverTimeout(timeout);
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    // Check initial state
    requestAnimationFrame(() => {
      onSelect();
    });

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <nav className="relative py-2">
      {/* Left Arrow */}
      {canScrollPrev && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Right Arrow */}
      {canScrollNext && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3 md:gap-4 lg:gap-5 px-2 md:px-0">
          {categories.map((category) => (
            <div
              key={category.name}
              onMouseEnter={() => handleMouseEnter(category.name)}
              onMouseLeave={handleMouseLeave}
            >
              <DropdownMenu
                modal={false}
                open={openCategory === category.name}
                onOpenChange={(open) => {
                  if (!open) {
                    setOpenCategory(null);
                  }
                }}
              >
                <DropdownMenuTrigger asChild>
                  <Link href={`/categories/${category.slug}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap hover:bg-accent hover:text-accent-foreground text-xs md:text-sm px-3 md:px-4 cursor-pointer"
                    >
                      {category.name}
                    </Button>
                  </Link>
                </DropdownMenuTrigger>
                {category.children.length > 0 && (
                  <DropdownMenuContent
                    align="start"
                    className="w-56"
                    sideOffset={5}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    onMouseEnter={() => handleMouseEnter(category.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {category.children.map((item) => {
                      if (item.type === 'BRAND') {
                        return (
                          <DropdownMenuItem key={item.brand.id} asChild>
                            <Link href={`/collections/${item.brand.slug}`}>
                              {item.brand.name}
                            </Link>
                          </DropdownMenuItem>
                        );
                      }
                      return (
                        <DropdownMenuItem key={item.name} asChild>
                          <Link href={`/categories/${item.slug}`}>
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
              {/* Invisible bridge to prevent gap */}
              {openCategory === category.name && (
                <div
                  className="absolute top-full left-0 right-0 h-3 z-40"
                  onMouseEnter={() => handleMouseEnter(category.name)}
                  onMouseLeave={handleMouseLeave}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
