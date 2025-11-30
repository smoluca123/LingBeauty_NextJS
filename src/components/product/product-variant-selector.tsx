'use client';

import Image from 'next/image';

import {
  IProductImageDataType,
  IProductVariantDataType,
} from '@/lib/types/interfaces/apis/product.interfaces';

type ProductVariantSelectorProps = {
  variants: IProductVariantDataType[];
  primaryImage: IProductImageDataType;
  maxDisplay?: number;
  onVariantClick: (variant: IProductVariantDataType) => void;
};

export function ProductVariantSelector({
  variants,
  primaryImage,
  maxDisplay = 4,
  onVariantClick,
}: ProductVariantSelectorProps) {
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className="hidden group-hover/product:block">
      <div className="mt-3 flex items-center gap-1.5">
        {variants.slice(0, maxDisplay).map((variant) => (
          <button
            key={variant.id}
            type="button"
            className="relative h-6 w-6 overflow-hidden rounded-full border border-muted ring-1 ring-transparent transition-all hover:scale-110 hover:ring-primary-pink/50 cursor-pointer"
            title={variant.name}
            onClick={() => onVariantClick(variant)}
          >
            {variant.size ? (
              <Image
                src={variant.images[0]?.media.url || primaryImage.media.url}
                alt={variant.name}
                fill
                className="object-cover"
                sizes="24px"
              />
            ) : variant.color ? (
              <div
                className="h-full w-full"
                style={{ backgroundColor: variant.color }}
              />
            ) : null}
          </button>
        ))}
        {variants.length > maxDisplay && (
          <span className="text-[10px] font-medium text-muted-foreground">
            +{variants.length - maxDisplay}
          </span>
        )}
      </div>
    </div>
  );
}
