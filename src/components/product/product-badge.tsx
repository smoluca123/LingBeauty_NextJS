import { ProductBadgeVariantType } from '@/lib/types/interfaces/apis/product.interfaces';
import { cn } from '@/lib/utils';

type ProductBadgeProps = {
  label: string;
  variant?: ProductBadgeVariantType;
};

export function ProductBadge({
  label,
  variant = 'NEUTRAL',
}: ProductBadgeProps) {
  const variantClasses: Record<Required<ProductBadgeProps>['variant'], string> =
    {
      PRIMARY:
        'bg-primary-pink/10 text-primary-pink border border-primary-pink/30',
      INFO: 'bg-sky-100 text-sky-700 border border-sky-200',
      NEUTRAL: 'bg-muted text-foreground border border-muted-foreground/10',
    };

  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide',
        variantClasses[variant]
      )}
    >
      {label}
    </span>
  );
}
