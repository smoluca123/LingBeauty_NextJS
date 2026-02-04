import { CollectionBanner } from '@/app/(main)/collections/[brandSlug]/components/collection-banner';
import { CollectionInfo } from '@/app/(main)/collections/[brandSlug]/components/collection-info';
import { CollectionProducts } from '@/app/(main)/collections/[brandSlug]/components/collection-products';
import { getCollectionBySlug } from '@/app/(main)/collections/[brandSlug]/components/mock-collections';
import { mockProducts } from '@/app/(main)/collections/[brandSlug]/components/mock-products';
import { notFound } from 'next/navigation';

export async function CollectionShield({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}) {
  const { brandSlug } = await params;

  // Get collection data by slug
  const collection = getCollectionBySlug(brandSlug);

  // If collection not found, show 404
  if (!collection) {
    notFound();
  }

  // For now, use all mock products for this collection
  // In real app, this would be fetched from API based on brandSlug
  const products = mockProducts;
  return (
    <div className="space-y-6 py-4 md:py-6 container">
      <CollectionBanner name={collection.name} />
      <CollectionInfo
        name={collection.name}
        productCount={collection.productCount}
        purchaseCount={collection.purchaseCount}
        description={collection.description}
        featuredProducts={collection.featuredProducts}
        advantages={collection.advantages}
        targetAudience={collection.targetAudience}
      />

      {/* Products Section with Filter */}
      <CollectionProducts products={products} />
    </div>
  );
}
