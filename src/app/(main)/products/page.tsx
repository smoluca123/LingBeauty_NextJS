import { Suspense } from 'react';

import { Metadata } from 'next';
import { ProductsShield } from '@/app/(main)/products/components';

export const metadata: Metadata = {
  title: 'Tất Cả Sản Phẩm | LingBeauty',
  description:
    'Khám phá bộ sưu tập mỹ phẩm đa dạng tại LingBeauty. Tìm kiếm, lọc theo danh mục, giá cả và nhiều tiêu chí khác.',
  openGraph: {
    title: 'Tất Cả Sản Phẩm | LingBeauty',
    description:
      'Khám phá bộ sưu tập mỹ phẩm đa dạng tại LingBeauty. Tìm kiếm, lọc theo danh mục, giá cả và nhiều tiêu chí khác.',
  },
};

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsShield />
    </Suspense>
  );
}
