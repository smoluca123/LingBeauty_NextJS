import { notFound } from 'next/navigation';
import { getCategoriesServerAPI } from '@/lib/apis/server/category-apis';
import { getProductStatsAPI } from '@/lib/apis/server/product-apis';
import { CategoryBanner } from './category-banner';
import { CategoryInfo } from './category-info';
import { CategoryProducts } from './category-products';
import { findCategoryBySlug } from '@/lib/utils/utils';

export async function CategoryShield({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  // Fetch all categories to find the one by slug
  const categories = await getCategoriesServerAPI();

  // Find the category by slug (search in top-level and children)
  const category = findCategoryBySlug(categories, categorySlug);

  // If category not found, show 404
  if (!category) {
    notFound();
  }

  // Fetch lightweight stats instead of fetching all products
  const statsResponse = await getProductStatsAPI({ categoryId: category.id });

  return (
    <div className="space-y-6 py-4 md:py-6 container">
      <CategoryBanner
        name={category.name}
        imageUrl={category.imageMedia?.url}
      />
      <CategoryInfo
        name={category.name}
        productCount={statsResponse.data?.productCount ?? 0}
        purchaseCount={formatCount(statsResponse.data?.totalSold ?? 0)}
        description={category.description ?? ''}
      />

      {/* Products Section — categories are auto-fetched by ProductListingSection */}
      <CategoryProducts categoryId={category.id} />
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
