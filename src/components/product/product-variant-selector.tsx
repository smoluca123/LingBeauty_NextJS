'use client'

import Image from 'next/image'

import {
  IProductImageDataType,
  IProductVariantDataType,
} from '@/lib/types/interfaces/apis/product.interfaces'
import { getDisplayVariants } from '@/lib/utils/variant-utils'

type ProductVariantSelectorProps = {
  variants: IProductVariantDataType[]
  primaryImage?: IProductImageDataType
  maxDisplay?: number
  onVariantClick: (variant: IProductVariantDataType) => void
}

export function ProductVariantSelector({
  variants,
  primaryImage,
  maxDisplay = 4,
  onVariantClick,
}: ProductVariantSelectorProps) {
  // Filter out default variant if it's the only one
  const displayVariants = getDisplayVariants(variants)

  if (displayVariants.length === 0) {
    return null
  }

  return (
    <div className="hidden group-hover/product:block">
      <div className="mt-3 flex items-center gap-1.5">
        {displayVariants.slice(0, maxDisplay).map((variant) => (
          <button
            key={variant.id}
            type="button"
            className="relative h-6 w-6 overflow-hidden rounded-full border border-muted ring-1 ring-transparent transition-all hover:scale-110 hover:ring-primary-pink/50 cursor-pointer"
            title={variant.name}
            onClick={() => onVariantClick(variant)}
          >
            {variant.displayType === 'IMAGE' ? (
              <Image
                src={
                  variant.images[0]?.media.url || primaryImage?.media.url || ''
                }
                alt={variant.name}
                fill
                className="object-cover"
                sizes="24px"
              />
            ) : variant.displayType === 'COLOR' && variant.color ? (
              <div
                className="h-full w-full"
                style={{ backgroundColor: variant.color }}
              />
            ) : null}
          </button>
        ))}
        {displayVariants.length > maxDisplay && (
          <span className="text-[10px] font-medium text-muted-foreground">
            +{displayVariants.length - maxDisplay}
          </span>
        )}
      </div>
    </div>
  )
}
