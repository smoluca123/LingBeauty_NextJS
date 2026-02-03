import { ProductCard2Skeleton } from '@/components/product';

/**
 * Demo page to showcase ProductCard2Skeleton component
 * Navigate to /test/skeleton to view
 */
export default function SkeletonDemoPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">ProductCard2Skeleton Demo</h1>
          <p className="text-muted-foreground">
            Skeleton loading state that matches ProductCard2 layout
          </p>
        </div>

        {/* Single Skeleton */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Single Card</h2>
          <div className="max-w-sm">
            <ProductCard2Skeleton />
          </div>
        </section>

        {/* Grid Layout */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Grid Layout (Desktop 5 columns)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <ProductCard2Skeleton key={index} />
            ))}
          </div>
        </section>

        {/* Horizontal Scroll */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Horizontal Scroll</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <ProductCard2Skeleton key={index} className="min-w-70" />
            ))}
          </div>
        </section>

        {/* Usage Code */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Usage</h2>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`import { ProductCard2Skeleton } from '@/components/product';

// Basic usage
<ProductCard2Skeleton />

// With custom className
<ProductCard2Skeleton className="w-full" />

// In a grid
{Array.from({ length: 10 }).map((_, index) => (
  <ProductCard2Skeleton key={index} />
))}`}</code>
          </pre>
        </section>
      </div>
    </main>
  );
}
