import { Suspense } from 'react';
import { Metadata } from 'next';
import { ProductsShield } from '@/app/(main)/products/components';
import { redirect, notFound } from 'next/navigation';
import ProductsListingPageSkeleton from '@/components/skeletons/products-listing-page-skeleton';

interface ProductsPageProps {
  params: Promise<{ page?: string[] }>;
}

/**
 * Parse and validate the page number from the optional catch-all route.
 * /products → page 1, /products/2 → page 2, /products/abc → notFound
 */
function parsePageParam(pageSegments?: string[]): number {
  if (!pageSegments || pageSegments.length === 0) return 1;

  // Only accept single segment like /products/2, not /products/2/3
  if (pageSegments.length > 1) notFound();

  const page = Number(pageSegments[0]);

  // Must be a positive integer
  if (!Number.isInteger(page) || page < 1) notFound();

  return page;
}

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { page: pageSegments } = await params;
  const page = parsePageParam(pageSegments);
  const suffix = page > 1 ? ` - Trang ${page}` : '';

  return {
    title: `Tất Cả Sản Phẩm${suffix} | LingBeauty`,
    description:
      'Khám phá bộ sưu tập mỹ phẩm đa dạng tại LingBeauty. Tìm kiếm, lọc theo danh mục, giá cả và nhiều tiêu chí khác.',
    openGraph: {
      title: `Tất Cả Sản Phẩm${suffix} | LingBeauty`,
      description:
        'Khám phá bộ sưu tập mỹ phẩm đa dạng tại LingBeauty. Tìm kiếm, lọc theo danh mục, giá cả và nhiều tiêu chí khác.',
    },
  };
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { page: pageSegments } = await params;
  const page = parsePageParam(pageSegments);

  // Redirect /products/1 → /products to avoid duplicate content
  if (pageSegments && pageSegments[0] === '1') {
    redirect('/products');
  }

  return (
    <Suspense fallback={<ProductsListingPageSkeleton />}>
      <ProductsShield page={page} />
    </Suspense>
  );
}
