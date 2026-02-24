'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Package, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryInfoProps {
  name: string;
  productCount: number;
  purchaseCount: string;
  description: string;
}

export function CategoryInfo({
  name,
  productCount,
  purchaseCount,
  description,
}: CategoryInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Header with gradient background */}
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-primary-pink via-pink-400 to-primary-pink bg-clip-text text-transparent mb-4">
          {name}
        </h2>

        {/* Stats Cards */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 max-w-md mx-auto">
          <div className="flex-1 bg-linear-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-2xl p-4 border border-pink-200/50 dark:border-pink-800/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Package className="w-4 h-4 text-primary-pink" />
              <span className="text-xs font-medium text-muted-foreground">
                Sản phẩm
              </span>
            </div>
            <div className="text-2xl font-bold text-primary-pink">
              {productCount}
            </div>
          </div>

          <div className="flex-1 bg-linear-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-2xl p-4 border border-pink-200/50 dark:border-pink-800/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-center gap-2 mb-1">
              <ShoppingBag className="w-4 h-4 text-primary-pink" />
              <span className="text-xs font-medium text-muted-foreground">
                Lượt mua
              </span>
            </div>
            <div className="text-2xl font-bold text-primary-pink">
              {purchaseCount}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="max-w-4xl mx-auto">
          <p
            className={`text-sm sm:text-base text-muted-foreground leading-relaxed text-center mb-6 px-4 ${
              !isExpanded ? 'line-clamp-3' : ''
            }`}
          >
            {description}
          </p>

          {/* Toggle button - only show if description is long enough */}
          {description.length > 200 && (
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="group cursor-pointer text-muted-foreground hover:text-foreground font-semibold text-sm px-6 py-3 rounded-full border-2 border-border hover:border-primary-pink hover:bg-primary-pink/5 transition-all duration-300"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                    ẨN BỚT NỘI DUNG
                  </>
                ) : (
                  <>
                    XEM THÊM NỘI DUNG
                    <ChevronDown className="w-4 h-4 ml-2 group-hover:animate-bounce" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
