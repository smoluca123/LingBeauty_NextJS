import { notFound } from 'next/navigation';
import { getBrandsAPI } from '@/lib/apis/server/brand-apis';
import { getProductStatsAPI } from '@/lib/apis/server/product-apis';
import { CollectionBanner } from './collection-banner';
import { CollectionInfo } from './collection-info';
import { CollectionProducts } from './collection-products';

export async function CollectionShield({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}) {
  const { brandSlug } = await params;

  // Fetch brands to find the brand by slug
  const brandsResponse = await getBrandsAPI({ page: 1, limit: 100 });

  const brand = brandsResponse.data.items.find(
    (b) => b.slug.toLowerCase() === brandSlug.toLowerCase(),
  );

  // If brand not found, show 404
  if (!brand) {
    notFound();
  }

  // Fetch lightweight stats instead of fetching all products
  const statsResponse = await getProductStatsAPI({ brandId: brand.id });

  return (
    <div className="space-y-6 py-4 md:py-6 container">
      <CollectionBanner name={brand.name} />
      <CollectionInfo
        name={brand.name}
        productCount={statsResponse.data?.productCount ?? 0}
        purchaseCount={formatCount(statsResponse.data?.totalSold ?? 0)}
        description={brand.description}
      />

      {/* Products Section — categories are auto-fetched by ProductListingSection */}
      <CollectionProducts brandId={brand.id} />
    </div>
  );
}

/**
 * Format number to readable string (e.g. 1700 -> "1.7K")
 */
function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return count.toString();
}
