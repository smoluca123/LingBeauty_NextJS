# ProductCard2Skeleton

Skeleton loading component for `ProductCard2` that maintains the exact same layout structure.

## Usage

### Basic Usage

```tsx
import { ProductCard2Skeleton } from '@/components/product';

export function ProductList() {
  const { data, isLoading } = useGetProductsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <ProductCard2Skeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {data.map((product) => (
        <ProductCard2 key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### In HorizontalScroller (like TopProducts)

```tsx
import { HorizontalScroller } from '@/components/home/horizontal-scroller';
import { ProductCard2, ProductCard2Skeleton } from '@/components/product';

export function TopProducts() {
  const { data, isLoading } = useGetProductsQuery();

  return (
    <HorizontalScroller
      ariaLabel="Top sản phẩm"
      slidesPerView={{ mobile: 1.5, tablet: 2.5, desktop: 5 }}
    >
      {isLoading
        ? // Show skeleton while loading
          Array.from({ length: 10 }).map((_, index) => (
            <ProductCard2Skeleton key={index} className="w-full" />
          ))
        : // Show actual products when loaded
          data?.map((product) => (
            <ProductCard2
              key={product.id}
              product={product}
              className="w-full"
            />
          ))}
    </HorizontalScroller>
  );
}
```

### With SSR + Client Hydration (Current Pattern)

Since you're using SSR with `initialData`, you typically won't need the skeleton for the initial render.
However, you can use it for:

1. **Infinite scroll loading more items**
2. **Refetch after error**
3. **Manual loading states**

```tsx
export const TopProducts = ({ initialData }: TopProductsProps) => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage } =
    useGetProductsQuery();

  const products =
    data?.pages?.flatMap((page) => page.data.items) || initialData.data.items;

  return (
    <section>
      <HorizontalScroller>
        {products.map((product) => (
          <ProductCard2 key={product.id} product={product} />
        ))}

        {/* Show skeleton when fetching next page */}
        {isFetchingNextPage &&
          Array.from({ length: 5 }).map((_, index) => (
            <ProductCard2Skeleton key={`skeleton-${index}`} />
          ))}
      </HorizontalScroller>
    </section>
  );
};
```

## Props

```tsx
interface ProductCard2SkeletonProps {
  className?: string; // Optional className for custom styling
}
```

## Layout Structure

The skeleton matches ProductCard2's structure:

1. **Header** - Discount badge placeholder (top-right)
2. **Image** - Square aspect ratio placeholder
3. **Badges** - 2 badge placeholders
4. **Product Info** - Brand name + product name (3 lines max)
5. **Rating/Stats** - Rating stars + sold count
6. **Price** - Base price + compare price
7. **Variants** - 4 variant thumbnail placeholders
8. **Button** - "Xem chi tiết" button placeholder

## Accessibility

- Uses semantic `<article>` tag to match ProductCard2
- Maintains same spacing and aspect ratios for smooth transition when data loads
- No ARIA labels needed (skeleton is purely visual)

## Performance

- Lightweight component (uses only Skeleton primitive)
- No state management
- Can render hundreds without performance impact
