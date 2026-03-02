'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTopProducts } from '@/app/admin/hooks';

export function RecentProducts() {
  const [limit, setLimit] = useState(5);
  const { data, isLoading } = useTopProducts(limit);

  const products = data?.data ?? [];

  const formatRevenue = (value: string) =>
    `${Number(value).toLocaleString('vi-VN')}₫`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base md:text-lg">
              Sản phẩm bán chạy
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Top {limit} sản phẩm bán chạy nhất
            </CardDescription>
          </div>
          <Select
            value={String(limit)}
            onValueChange={(v) => setLimit(Number(v))}
          >
            <SelectTrigger className="h-8 w-20 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">Top 5</SelectItem>
              <SelectItem value="10">Top 10</SelectItem>
              <SelectItem value="20">Top 20</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: limit }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">
                    #{index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm md:text-base truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        Đã bán: {product.totalSold.toLocaleString('vi-VN')}
                      </span>
                      {product.avgRating && (
                        <span className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {Number(product.avgRating).toFixed(1)}
                        </span>
                      )}
                      {product.reviewCount > 0 && (
                        <span>({product.reviewCount} đánh giá)</span>
                      )}
                    </div>
                  </div>
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
