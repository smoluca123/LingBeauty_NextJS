'use client';

import { cn } from '@/lib/utils';
import { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces';
import { ProductCard2 } from '@/components/product/product-card2';
import { PRODUCTS_PER_PAGE } from '../constants';
import { ProductCard2Skeleton } from '@/components/product/product-card2-skeleton';

interface ProductsGridProps {
  products: IProductDataType[];
  isLoading?: boolean;
  className?: string;
}

export function ProductsGrid({
  products,
  isLoading = false,
  className,
}: ProductsGridProps) {
  // Show skeleton grid on initial load
  if (isLoading && products.length === 0) {
    return (
      <div
        className={cn(
          'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4',
          className,
        )}
      >
        {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
          <ProductCard2Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          Không tìm thấy sản phẩm nào
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Thử thay đổi bộ lọc để xem thêm sản phẩm
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard2 key={product.id} product={product} />
      ))}
    </div>
  );
}
