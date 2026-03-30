import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils/style-utils'
import { IProductVariantDataType } from '@/lib/types/interfaces/apis/product.interfaces'
import { useMemo } from 'react'

interface VariantSelectorProps {
  displayVariants: IProductVariantDataType[]
  selectedVariant: IProductVariantDataType | null
  onSelect: (variant: IProductVariantDataType) => void
  isOutOfStock: boolean
  isLowStock: boolean
  maxStock: number
}

export function VariantSelector({
  displayVariants,
  selectedVariant,
  onSelect,
  isOutOfStock,
  isLowStock,
  maxStock,
}: VariantSelectorProps) {
  const variantLabel = useMemo(() => {
    const hasColors = displayVariants.some((v) => v.color)
    const hasSizes = displayVariants.some((v) => v.size)
    return hasColors ? 'Màu sắc' : hasSizes ? 'Kích cỡ' : 'Phân loại'
  }, [displayVariants])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">
          {variantLabel}:
          {selectedVariant && (
            <span className="ml-1.5 font-normal text-primary-pink">
              {selectedVariant.name}
            </span>
          )}
        </p>
        {/* Stock status badge */}
        {isOutOfStock ? (
          <span className="text-xs font-medium text-destructive">Hết hàng</span>
        ) : isLowStock ? (
          <span className="text-xs font-medium text-amber-500">
            Còn {maxStock} sản phẩm
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {displayVariants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id
          const isVariantOutOfStock =
            variant.inventory?.displayStatus === 'OUT_OF_STOCK'

          return (
            <button
              key={variant.id}
              type="button"
              disabled={isVariantOutOfStock}
              onClick={() => !isVariantOutOfStock && onSelect(variant)}
              className={cn(
                'relative flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-pink',
                isSelected
                  ? 'border-primary-pink bg-primary-pink/5 text-primary-pink ring-1 ring-primary-pink'
                  : 'border-border bg-card text-foreground hover:border-primary-pink/50 hover:bg-muted/50',
                isVariantOutOfStock &&
                  'cursor-not-allowed opacity-40 line-through',
              )}
            >
              {/* Color swatch */}
              {variant.color && (
                <span
                  className="h-4 w-4 shrink-0 rounded-full border border-muted-foreground/20"
                  style={{ backgroundColor: variant.color }}
                />
              )}
              <span>{variant.name}</span>
              {isSelected && (
                <CheckCircle2 className="ml-0.5 h-3.5 w-3.5 text-primary-pink" />
              )}
              {isVariantOutOfStock && (
                <span className="ml-1 text-[10px]">• Hết</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
