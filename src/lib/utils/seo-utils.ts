/**
 * SEO Utilities for generating structured data (JSON-LD)
 * Helps improve search engine visibility and rich snippets
 */

import type { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces'
import type { IBlogPostDataType } from '@/lib/types/interfaces/apis/blog.interfaces'

/**
 * Generate Product structured data (JSON-LD)
 * @see https://schema.org/Product
 */
export function generateProductJsonLd(product: IProductDataType) {
  const basePrice = Number(product.basePrice)
  const comparePrice = product.comparePrice
    ? Number(product.comparePrice)
    : null
  const primaryImage = product.images?.find((img) => img.isPrimary)?.media?.url
  const avgRating = product.stats?.avgRating
    ? Number(product.stats.avgRating)
    : undefined
  const reviewCount = product.stats?.reviewCount ?? 0

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDesc || product.metaDesc || '',
    image: primaryImage || '',
    brand: {
      '@type': 'Brand',
      name: product.brand.name,
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
      priceCurrency: 'VND',
      price: basePrice,
      ...(comparePrice && comparePrice > basePrice && { highPrice: comparePrice }),
      availability:
        product.displayStatus === 'OUT_OF_STOCK'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
    },
    ...(avgRating &&
      reviewCount > 0 && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: avgRating,
          reviewCount: reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
      }),
  }
}

/**
 * Generate Article structured data (JSON-LD) for blog posts
 * @see https://schema.org/Article
 */
export function generateArticleJsonLd(post: IBlogPostDataType) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription || post.excerpt || '',
    image: post.featuredImage?.url || '',
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author?.fullName || 'LingBeauty',
    },
    publisher: {
      '@type': 'Organization',
      name: 'LingBeauty',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
  }
}

/**
 * Generate BreadcrumbList structured data (JSON-LD)
 * @see https://schema.org/BreadcrumbList
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.url}`,
    })),
  }
}

/**
 * Generate Organization structured data (JSON-LD) for homepage
 * @see https://schema.org/Organization
 */
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LingBeauty',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    description:
      'Cửa hàng mỹ phẩm chính hãng, uy tín hàng đầu Việt Nam. Chuyên cung cấp các sản phẩm làm đẹp, chăm sóc da chất lượng cao.',
    sameAs: [
      // TODO: Add social media links
      // 'https://www.facebook.com/lingbeauty',
      // 'https://www.instagram.com/lingbeauty',
    ],
  }
}

/**
 * Component to render JSON-LD script tag
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
