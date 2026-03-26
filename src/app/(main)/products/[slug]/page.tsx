import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlugAPI } from '@/lib/apis/server/product-apis';
import {
  ProductDetailShield,
  ProductDetailSkeleton,
} from '@/app/(main)/products/[slug]/components';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await getProductBySlugAPI(slug);
    const product = response?.data;

    if (!product) return {};

    const title = product.metaTitle || `${product.name} | LingBeauty`;
    const description =
      product.metaDesc ||
      product.shortDesc ||
      `Mua ${product.name} chính hãng tại LingBeauty. Giá tốt, giao hàng nhanh.`;
    const imageUrl = product.primaryImage?.media?.url;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        ...(imageUrl && {
          images: [{ url: imageUrl, alt: product.name }],
        }),
      },
    };
  } catch {
    return {};
  }
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  
  if (!slug) notFound();

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailShield slug={slug} />
    </Suspense>
  );
}
