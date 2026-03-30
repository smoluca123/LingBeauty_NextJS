import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuantitySelectorProps {
  quantity: number
  maxStock: number
  isOutOfStock: boolean
  onIncrement: () => void
  onDecrement: () => void
}

export function QuantitySelector({
  quantity,
  maxStock,
  isOutOfStock,
  onIncrement,
  onDecrement,
}: QuantitySelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground">Số lượng:</p>
      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-xl border bg-muted/30">
          <Button
            variant="ghost"
            size="icon"
            onClick={onDecrement}
            disabled={quantity <= 1}
            className="h-10 w-10 rounded-xl"
            aria-label="Giảm số lượng"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 select-none text-center text-base font-semibold">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onIncrement}
            disabled={quantity >= maxStock || isOutOfStock}
            className="h-10 w-10 rounded-xl"
            aria-label="Tăng số lượng"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {maxStock > 0 && (
          <span className="text-xs text-muted-foreground">
            / {maxStock} sản phẩm có sẵn
          </span>
        )}
      </div>
    </div>
  )
}
