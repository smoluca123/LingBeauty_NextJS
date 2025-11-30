type ProductHeaderProps = {
  discountPercent: number | null;
};

export function ProductHeader({ discountPercent }: ProductHeaderProps) {
  return (
    <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      <span className="rounded-full bg-primary-pink px-2 py-1 text-white shadow-xs">
        HOT
      </span>

      {discountPercent && (
        <span className="text-primary-pink">-{discountPercent}%</span>
      )}
    </div>
  );
}
