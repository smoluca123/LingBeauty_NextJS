import { notFound } from 'next/navigation';
import {
  getProductBySlugAPI,
  getProductsByBrandAPI,
  getRelatedProductsAPI,
} from '@/lib/apis/server/product-apis';
import { ProductDetailGallery } from './product-detail-gallery';
import { ProductDetailInfo } from './product-detail-info';
import { ProductDetailTabs } from './product-detail-tabs';
import { ProductSectionCarousel } from './product-section-carousel';
import { EmptyRelatedProducts } from './empty-related-products';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ProductDetailShieldProps {
  slug: string;
}

/**
 * Server Component that pre-fetches the product + related products.
 * Parallel fetch for brand products and category products.
 * Promise.allSettled ensures one failure doesn't block the page.
 */
export async function ProductDetailShield({ slug }: ProductDetailShieldProps) {
  let product;
  try {
    const response = await getProductBySlugAPI(slug);
    product = response?.data;
  } catch {
    notFound();
  }

  if (!product) notFound();

  const firstCategory = product.productCategories?.[0]?.category;
  const brandId = product.brand?.id;
  const categoryId = firstCategory?.id;

  // Parallel fetch — failures silenced via allSettled
  const [brandResult, relatedResult] = await Promise.allSettled([
    brandId ? getProductsByBrandAPI(brandId, slug, 10) : Promise.resolve(null),
    categoryId
      ? getRelatedProductsAPI(categoryId, slug, 10)
      : Promise.resolve(null),
  ]);

  const brandProducts =
    brandResult.status === 'fulfilled'
      ? (brandResult.value?.data?.items ?? [])
      : [];
  const relatedProducts =
    relatedResult.status === 'fulfilled'
      ? (relatedResult.value?.data?.items ?? [])
      : [];

  // Remove brand duplicates from related section
  const brandProductIds = new Set(brandProducts.map((p) => p.id));
  const filteredRelated = relatedProducts.filter(
    (p) => !brandProductIds.has(p.id),
  );

  return (
    <div className="container space-y-10 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="flex items-center hover:text-foreground">
          <Home className="h-3.5 w-3.5" />
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-foreground">
          Sản phẩm
        </Link>
        {firstCategory && (
          <>
            <ChevronRight className="h-3 w-3" />
            <span className="hover:text-foreground">{firstCategory.name}</span>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="line-clamp-1 max-w-45 font-medium text-foreground">
          {product.name}
        </span>
      </nav>

      {/* Main: Gallery + Info */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductDetailGallery product={product} />
        <ProductDetailInfo product={product} />
      </div>

      {/* Tabs: Mô tả | Đánh giá | Hỏi & Đáp */}
      <div className="rounded-2xl border bg-card p-6 md:p-8">
        <ProductDetailTabs product={product} />
      </div>

      <div className="space-y-10">
        <Separator />

        {/* Section: Sản phẩm cùng thương hiệu */}
        {brandProducts.length > 0 && (
          <ProductSectionCarousel
            title={`Cùng thương hiệu ${product.brand?.name ?? ''}`}
            subtitle="Khám phá thêm sản phẩm từ thương hiệu này"
            products={brandProducts}
            viewAllHref={`/collections/${product.brand?.slug}`}
          />
        )}

        <Separator />

        {/* Section: Sản phẩm liên quan */}
        <div>
          <h2 className="mb-2 text-2xl font-bold">Sản phẩm liên quan</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            {firstCategory
              ? `Các sản phẩm khác trong danh mục ${firstCategory.name}`
              : 'Bạn có thể cũng thích'}
          </p>
          {filteredRelated.length > 0 ? (
            <ProductSectionCarousel
              title=""
              subtitle=""
              products={filteredRelated}
              viewAllHref={
                categoryId ? `/products?categoryId=${categoryId}` : '/products'
              }
            />
          ) : (
            <EmptyRelatedProducts
              title="Chưa có sản phẩm liên quan"
              description={
                firstCategory
                  ? `Hiện tại chưa có sản phẩm nào khác trong danh mục ${firstCategory.name}. Hãy khám phá các danh mục khác.`
                  : 'Hiện tại chưa có sản phẩm liên quan nào. Hãy khám phá các sản phẩm khác của chúng tôi.'
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
