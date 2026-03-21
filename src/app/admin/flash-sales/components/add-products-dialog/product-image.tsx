'use client';

import Image from 'next/image';
import { Package } from 'lucide-react';
import type { ProductImageProps } from './types';

const sizeMap = {
  sm: { container: 'h-8 w-8', icon: 'h-4 w-4' },
  md: { container: 'h-10 w-10', icon: 'h-5 w-5' },
};

export function ProductImage({ src, alt, size = 'md' }: ProductImageProps) {
  const dimensions = sizeMap[size];

  if (src) {
    const pixelSize = size === 'sm' ? 32 : 40;
    return (
      <Image
        src={src}
        alt={alt}
        width={pixelSize}
        height={pixelSize}
        className={`${dimensions.container} rounded object-cover`}
      />
    );
  }

  return (
    <div
      className={`${dimensions.container} rounded bg-muted flex items-center justify-center`}
    >
      <Package className={`${dimensions.icon} text-muted-foreground`} />
    </div>
  );
}
