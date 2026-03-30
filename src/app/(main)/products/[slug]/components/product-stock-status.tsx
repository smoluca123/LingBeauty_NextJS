interface ProductStockStatusProps {
  isOutOfStock: boolean
  isLowStock: boolean
  maxStock: number
}

export function ProductStockStatus({
  isOutOfStock,
  isLowStock,
  maxStock,
}: ProductStockStatusProps) {
  return (
    <div className="flex items-center gap-2">
      {isOutOfStock ? (
        <span className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
          Hết hàng
        </span>
      ) : isLowStock ? (
        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600">
          Sắp hết — còn {maxStock} sản phẩm
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
          Còn hàng
        </span>
      )}
    </div>
  )
}
