type ProductHeaderProps = {
  discountPercent: number | null
  isFeatured?: boolean
}

export function ProductHeader({
  discountPercent,
  isFeatured,
}: ProductHeaderProps) {
  return (
    <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      {isFeatured ? (
        <span className="rounded-full bg-primary-pink px-2 py-1 text-white shadow-xs">
          HOT
        </span>
      ) : (
        <span className="rounded-full bg-primary-pink px-2 py-1 text-white shadow-xs">
          NEW
        </span>
      )}

      {discountPercent && (
        <span className="text-primary-pink">-{discountPercent}%</span>
      )}
    </div>
  )
}
