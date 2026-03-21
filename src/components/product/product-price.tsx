import { formatCurrency } from '@/lib/utils/utils';

type ProductPriceProps = {
  basePrice: number;
  comparePrice?: number | null;
};

export function ProductPrice({ basePrice, comparePrice }: ProductPriceProps) {
  return (
    <div className="mt-3 flex flex-wrap items-baseline gap-2">
      <p className="text-lg font-semibold text-foreground">
        {formatCurrency(basePrice)}
      </p>
      {comparePrice && (
        <p className="text-sm text-muted-foreground line-through">
          {formatCurrency(comparePrice)}
        </p>
      )}
    </div>
  );
}
