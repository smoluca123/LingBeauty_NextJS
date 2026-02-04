'use client';

import { HorizontalScroller } from '@/components/home/horizontal-scroller';
import { useGetBrandsQuery } from '@/hooks/querys/brand.query';
import { BrandListSkeleton } from './brand-list-skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { IBrandDataType } from '@/lib/types/interfaces/apis/header.interfaces';

interface IProps {
  initialData: IBrandDataType[];
}

export function BrandList({ initialData }: IProps) {
  const brands = initialData;

  return (
    <HorizontalScroller
      slidesPerView={{ mobile: 3, tablet: 5, desktop: 7 }}
      ariaLabel="Danh sách thương hiệu"
    >
      {brands.map((brand) => (
        <Link
          key={brand.id}
          href={`/brands/${brand.id}`}
          className="group flex h-20 items-center justify-center rounded-xl border border-border bg-white p-3 shadow-sm transition-all hover:border-primary-pink hover:shadow-lg"
        >
          <Image
            src={brand.logoMedia?.url || ''}
            alt={brand.name}
            width={80}
            height={48}
            className="max-h-12 w-auto object-contain grayscale transition-all group-hover:grayscale-0"
          />
        </Link>
      ))}
    </HorizontalScroller>
  );
}
