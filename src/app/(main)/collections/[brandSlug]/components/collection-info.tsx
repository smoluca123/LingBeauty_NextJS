'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Package, ShoppingBag, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CollectionInfoProps {
  name: string;
  productCount: number;
  purchaseCount: string;
  description: string;
  featuredProducts: string;
  advantages: string[];
  targetAudience: string[];
}

export function CollectionInfo({
  name,
  productCount,
  purchaseCount,
  description,
  featuredProducts,
  advantages,
  targetAudience,
}: CollectionInfoProps) {
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
              <span className="text-xs font-medium text-muted-foreground">Sản phẩm</span>
            </div>
            <div className="text-2xl font-bold text-primary-pink">{productCount}</div>
          </div>
          
          <div className="flex-1 bg-linear-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-2xl p-4 border border-pink-200/50 dark:border-pink-800/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-center gap-2 mb-1">
              <ShoppingBag className="w-4 h-4 text-primary-pink" />
              <span className="text-xs font-medium text-muted-foreground">Lượt mua</span>
            </div>
            <div className="text-2xl font-bold text-primary-pink">{purchaseCount}</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-4xl mx-auto">
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-center mb-6 px-4">
          {description}
        </p>

        {/* Expandable content */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-6 pt-6">
            {/* Featured Products Card */}
            <div className="bg-linear-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-2xl p-6 border border-pink-200/50 dark:border-pink-800/50 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                  <Sparkles className="w-5 h-5 text-primary-pink dark:text-pink-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Sản phẩm nổi bật</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-11">
                {featuredProducts}
              </p>
            </div>

            {/* Advantages Card */}
            <div className="bg-linear-to-br from-pink-50/80 to-fuchsia-50 dark:from-pink-950/20 dark:to-fuchsia-950/20 rounded-2xl p-6 border border-pink-200/50 dark:border-pink-800/50 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                  <Package className="w-5 h-5 text-primary-pink dark:text-pink-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Ưu điểm</h3>
              </div>
              <ul className="space-y-3 pl-11">
                {advantages.map((advantage, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start gap-3 group"
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900/30 text-primary-pink dark:text-pink-400 text-xs font-semibold shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Audience Card */}
            <div className="bg-linear-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-2xl p-6 border border-pink-200/50 dark:border-pink-800/50 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-primary-pink dark:text-pink-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Đối tượng sử dụng</h3>
              </div>
              <ul className="space-y-3 pl-11">
                {targetAudience.map((target, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start gap-3"
                  >
                    <span className="text-primary-pink dark:text-pink-400 mt-1 text-lg">•</span>
                    <span className="leading-relaxed">{target}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Toggle button */}
        <div className="mt-8 text-center">
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
      </div>
    </section>
  );
}

