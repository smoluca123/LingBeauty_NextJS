'use client';

import { useState } from 'react';
import { Trophy } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTopProductsQuery } from '@/hooks/querys/stats.query';

const LIMIT_OPTIONS = [5, 10, 15, 20];

export function RecentProducts() {
  const [limit, setLimit] = useState(5);
  const { data, isLoading } = useTopProductsQuery({ limit });

  const products = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="space-y-1">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              Sản phẩm bán chạy
              <Trophy className="h-4 w-4 md:h-5 md:w-5 text-primary-pink" />
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Top {limit} sản phẩm theo doanh số
            </CardDescription>
          </div>

          <Select
            value={String(limit)}
            onValueChange={(v) => setLimit(Number(v))}
          >
            <SelectTrigger
              id="top-products-limit-select"
              className="w-20 h-8 text-xs"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LIMIT_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={String(opt)}>
                  Top {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20 shrink-0" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">
            Chưa có dữ liệu
          </p>
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => {
              const revenue = parseFloat(product.revenue);
              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Rank badge */}
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        index === 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : index === 1
                            ? 'bg-gray-100 text-gray-600'
                            : index === 2
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm md:text-base truncate">
                        {product.name}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {product.totalSold.toLocaleString('vi-VN')} đã bán
                        {product.avgRating && (
                          <span className="ml-2">★ {Number(product.avgRating).toFixed(1)}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-primary-pink text-sm md:text-base whitespace-nowrap">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      maximumFractionDigits: 0,
                    }).format(revenue)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
