'use client';

import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { forwardRef, useImperativeHandle } from 'react';

import { IProductImageDataType } from '@/lib/types/interfaces/apis/product.interfaces';

type ProductImageCarouselProps = {
  images: IProductImageDataType[];
  productName: string;
};

export type ProductImageCarouselRef = {
  scrollTo: (index: number) => void;
};

export const ProductImageCarousel = forwardRef<
  ProductImageCarouselRef,
  ProductImageCarouselProps
>(({ images, productName }, ref) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  // Expose scrollTo method to parent
  useImperativeHandle(ref, () => ({
    scrollTo: (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
  }));

  return (
    <div
      className="relative mt-3 aspect-square overflow-hidden rounded-xl bg-muted"
      ref={emblaRef}
    >
      <div className="flex h-full touch-pan-y">
        {images.map((image, index) => (
          <div
            key={image.id || index}
            className="relative min-w-0 flex-[0_0_100%]"
          >
            <Image
              src={image.media.url}
              alt={image.alt || productName}
              fill
              sizes="(min-width: 1024px) 220px, (min-width: 768px) 200px, 45vw"
              className="object-cover"
              priority={index === 0}
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
});

ProductImageCarousel.displayName = 'ProductImageCarousel';
