import { Package, ShoppingBag } from 'lucide-react'

interface ProductsInfoProps {
  productCount: number
  purchaseCount: string
  searchQuery?: string
}

/**
 * Stats section showing total products and total purchases.
 * Follows the same design pattern as CategoryInfo / CollectionInfo.
 */
export function ProductsInfo({
  productCount,
  purchaseCount,
  searchQuery,
}: ProductsInfoProps) {
  const title = searchQuery
    ? `Kết Quả Tìm Kiếm: "${searchQuery}"`
    : 'Tất Cả Sản Phẩm'

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Header with gradient text */}
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-primary-pink via-pink-400 to-primary-pink bg-clip-text text-transparent mb-4">
          {title}
        </h2>

        {/* Stats Cards */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 max-w-md mx-auto">
          <div className="flex-1 bg-linear-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-2xl p-4 border border-pink-200/50 dark:border-pink-800/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Package className="w-4 h-4 text-primary-pink" />
              <span className="text-xs font-medium text-muted-foreground">
                Sản phẩm
              </span>
            </div>
            <div className="text-2xl font-bold text-primary-pink">
              {productCount}
            </div>
          </div>

          <div className="flex-1 bg-linear-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-2xl p-4 border border-pink-200/50 dark:border-pink-800/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-center gap-2 mb-1">
              <ShoppingBag className="w-4 h-4 text-primary-pink" />
              <span className="text-xs font-medium text-muted-foreground">
                Lượt mua
              </span>
            </div>
            <div className="text-2xl font-bold text-primary-pink">
              {purchaseCount}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
