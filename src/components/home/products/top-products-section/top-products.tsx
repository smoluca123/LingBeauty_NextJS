'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product';

import { HorizontalScroller } from '../../horizontal-scroller';
import { ProductCard } from '../../../product/product-card';
import { SectionHeading } from '../../section-heading';
import { useGetProductsQuery } from '@/hooks/querys/product.query';
import { ProductCard2 } from '@/components/product/product-card2';
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces';

const topProducts: Product[] = [
  {
    id: 'dermatory-moisture',
    name: 'Bộ Mua 5 Tặng 1 Xịt Cấp Ẩm Dermatory Pro Hyal Shot Moisture',
    brand: 'DERMATORY',
    image:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
    price: 260000,
    originalPrice: 520000,
    rankLabel: 'Top 1',
    dealLabel: 'FREESHIP',
    badges: [
      { label: '5+1', variant: 'primary' },
      { label: 'Giảm 50%', variant: 'info' },
    ],
    rating: 4.9,
    reviewCount: 102,
    variants: [
      { id: 'v1', name: 'Xanh dương', color: '#3b82f6' },
      { id: 'v2', name: 'Hồng phấn', color: '#f472b6' },
    ],
  },
  {
    id: 'club-clio-mask',
    name: 'Mặt Nạ Ngủ Dưỡng Sáng Da Green Tangerine Vita',
    brand: 'CLUB CLIO',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    price: 399000,
    originalPrice: 499000,
    rankLabel: 'Top 2',
    dealLabel: 'FREESHIP',
    badges: [{ label: 'Mới' }],
    rating: 4.8,
    reviewCount: 43,
  },
  {
    id: 'amuse-tint',
    name: 'Son Tint Lì Amuse Dew Tint 3.8g',
    brand: 'AMUSE',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    price: 359000,
    originalPrice: 420000,
    rankLabel: 'Top 3',
    badges: [
      { label: '1+1', variant: 'info' },
      { label: 'Bán chạy', variant: 'primary' },
    ],
    rating: 4.7,
    reviewCount: 215,
    variants: [
      {
        id: 'v3',
        name: '01 La Vie En Coral',
        thumbnail:
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=100&q=80',
      },
      {
        id: 'v4',
        name: '02 Breeze',
        thumbnail:
          'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=100&q=80',
      },
      {
        id: 'v5',
        name: '03 Healthy',
        thumbnail:
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=100&q=80',
      },
      {
        id: 'v6',
        name: '04 Pomelo',
        thumbnail:
          'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=100&q=80',
      },
      {
        id: 'v7',
        name: '05 Strawberry',
        thumbnail:
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=100&q=80',
      },
    ],
  },
  {
    id: 'amuse-palette',
    name: 'Bảng Phấn Mắt 9 Ô Amuse Eye Color Palette',
    brand: 'AMUSE',
    image:
      'https://image.hsv-tech.io/600x600/bbx/common/d6c8a528-ca8d-408d-b3eb-de751cddae90.webp',
    price: 699000,
    rankLabel: 'Top 4',
    dealLabel: 'MỚI',
    rating: 4.6,
    reviewCount: 37,
  },
  {
    id: 'banila-co-pad',
    name: 'Toner Pad Cấp Ẩm Banila Co Zero 7 Pad',
    brand: 'BANILA CO',
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    price: 302000,
    originalPrice: 429000,
    rankLabel: 'Top 5',
    badges: [{ label: 'Bestseller', variant: 'primary' }],
    rating: 4.8,
    reviewCount: 128,
  },
];

interface TopProductsProps {
  initialData: IApiPaginationResponseWrapperType<IProductDataType>;
}

export const TopProducts = ({ initialData }: TopProductsProps) => {
  // Use React Query for client-side updates, but fallback to initialData for SSR
  const { data } = useGetProductsQuery();

  // Prioritize React Query data, but use initialData for initial render (SEO)
  // initialData has structure: { message, data: { items: [], ... } }
  const products =
    data?.pages?.flatMap((page) => page.data.items) || initialData.data.items;

  return (
    <section className="space-y-6">
      <SectionHeading
        eyebrow="Top Picks"
        title="Top Sản Phẩm Bán Chạy"
        subtitle="Những món được yêu thích nhất tuần này, cập nhật liên tục."
        action={
          <Button
            variant="outline"
            className="rounded-full border-primary-pink text-primary-pink hover:bg-primary-pink/10"
          >
            Xem tất cả
          </Button>
        }
      />

      <HorizontalScroller
        ariaLabel="Top sản phẩm"
        className="mt-4"
        slidesPerView={{ mobile: 1.5, tablet: 2.5, desktop: 5 }}
      >
        {products.map((item) => (
          <ProductCard2 key={item.id} product={item} className="w-full" />
        ))}

        {topProducts.map((product) => (
          <ProductCard key={product.id} product={product} className="w-full" />
        ))}
        {topProducts.map((product) => (
          <ProductCard key={product.id} product={product} className="w-full" />
        ))}
      </HorizontalScroller>

      <div className="text-center">
        <Button
          className={cn(
            'rounded-full bg-primary-pink px-6 text-white hover:bg-primary-pink/90',
          )}
        >
          Xem thêm ưu đãi
        </Button>
      </div>
    </section>
  );
};
