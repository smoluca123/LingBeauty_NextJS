import {
  CollectionInfo,
  CollectionProducts,
  mockProducts,
} from './components';
import { CollectionBanner } from './components/collection-banner';
import { getCollectionBySlug } from './components/mock-collections';
import { notFound } from 'next/navigation';

interface CollectionPageProps {
  params: Promise<{
    brandSlug: string;
  }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
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
