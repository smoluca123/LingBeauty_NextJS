import { ProductBadge } from '@/components/product/product-badge';
import { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces';

export const ProductBadges = ({ product }: { product: IProductDataType }) => {
  const basePrice = Number(product.basePrice);
  const comparePrice = Number(product.comparePrice);
  const discountPercent =
    comparePrice && comparePrice > basePrice
      ? Math.round(((comparePrice - basePrice) / comparePrice) * 100)
      : null;
  const bigSaleBadge = discountPercent && discountPercent >= 20;
  const saleBadge = product.badges.filter((badge) => badge.type === 'SALE');
  const otherBadge = product.badges.filter((badge) => badge.type !== 'SALE');

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2">
        {bigSaleBadge && <ProductBadge label="SIÊU SALE" variant="PRIMARY" />}
        {discountPercent && (
          <ProductBadge label={`GIẢM ${discountPercent}%`} variant="INFO" />
        )}
        {saleBadge &&
          saleBadge.map((badge) => (
            <ProductBadge
              key={badge.id}
              label={badge.name}
              variant={badge.variant}
            />
          ))}
        {otherBadge &&
          otherBadge.map((badge) => (
            <ProductBadge
              key={badge.id}
              label={badge.name}
              variant={badge.variant}
            />
          ))}
      </div>
    </>
  );
};
