'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTopProducts } from '@/app/admin/hooks';

export function RecentProducts() {
  const { data, isLoading } = useTopProducts(5);

  const products = data?.data ?? [];

  const formatRevenue = (value: string) =>
    `${Number(value).toLocaleString('vi-VN')}₫`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base md:text-lg">Sản phẩm bán chạy</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Top 5 sản phẩm bán chạy nhất
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm md:text-base truncate">
                    {product.name}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Đã bán: {product.totalSold.toLocaleString('vi-VN')}
                  </p>
                </div>
                <span className="font-medium text-primary-pink text-sm md:text-base whitespace-nowrap">
                  {formatRevenue(product.revenue)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
