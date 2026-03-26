'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  IAdminProductDataType,
  IAdminProductFilters,
} from '@/lib/types/interfaces/apis/admin-product.interfaces'
import { TablePagination } from '@/app/admin/components'
import { usePagination } from '@/hooks/use-pagination'
import { AddProductDialog } from './add-product-dialog'
import {
  ProductFilters,
  ProductTable,
  DeleteProductDialog,
} from './product-table'
import { useAdminProductsQuery } from '@/hooks/querys/admin-product.query'
import {
  useAdminCategoriesQuery,
  useAdminBrandsQuery,
} from '@/hooks/querys/admin-category-brand.query'
import { useDeleteProductMutation } from '@/hooks/mutations/admin-product.mutation'

// ── Debounce hook ──────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

// ── Main Component ─────────────────────────────────────────────────────────

export function ProductsContent() {
  // ── Filter states ────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [brandFilter, setBrandFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [featuredFilter, setFeaturedFilter] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortValue, setSortValue] = useState('default')
  const [stockFilter, setStockFilter] = useState('all')

  // ── Debounced values ─────────────────────────────────────────────────────
  const debouncedSearch = useDebounce(searchQuery, 300)
  const debouncedMinPrice = useDebounce(minPrice, 500)
  const debouncedMaxPrice = useDebounce(maxPrice, 500)

  // ── Pagination ──────────────────────────────────────────────────────────
  const { currentPage, pageSize, resetPage, getPaginationProps } =
    usePagination()

  // ── Dialog states ────────────────────────────────────────────────────────
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] =
    useState<IAdminProductDataType | null>(null)

  // ── Mutations ────────────────────────────────────────────────────────────
  const deleteMutation = useDeleteProductMutation()

  // ── Fetch categories & brands ────────────────────────────────────────────
  const { data: categoriesData } = useAdminCategoriesQuery()
  const { data: brandsData } = useAdminBrandsQuery()

  const categories = categoriesData?.data ?? []
  const brands = brandsData?.data?.items ?? []

  // ── Parse sort value ─────────────────────────────────────────────────────
  const parsedSort = sortValue !== 'default' ? sortValue.split(':') : []
  const sortBy =
    parsedSort.length === 2
      ? (parsedSort[0] as IAdminProductFilters['sortBy'])
      : undefined
  const order =
    parsedSort.length === 2
      ? (parsedSort[1] as IAdminProductFilters['order'])
      : undefined

  // ── Build query params ──────────────────────────────────────────────────
  const queryParams: IAdminProductFilters = {
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch || undefined,
    categoryId: categoryFilter !== 'all' ? categoryFilter : undefined,
    brandId: brandFilter !== 'all' ? brandFilter : undefined,
    isActive: statusFilter !== 'all' ? statusFilter === 'true' : undefined,
    isFeatured:
      featuredFilter !== 'all' ? featuredFilter === 'true' : undefined,
    minPrice: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
    maxPrice: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
    sortBy,
    order,
  }

  const { data, isLoading, isFetching } = useAdminProductsQuery(queryParams)

  const products = data?.data?.items ?? []
  const totalCount = data?.data?.totalCount ?? 0

  // ── Client-side stock filter (BE không hỗ trợ) ──────────────────────────
  const filteredProducts =
    stockFilter === 'all'
      ? products
      : products.filter((product) => {
          const stock =
            product.variants?.reduce(
              (total, v) => total + (v.inventory?.quantity ?? 0),
              0,
            ) ?? 0

          if (stockFilter === 'in-stock') return stock >= 10
          if (stockFilter === 'low-stock') return stock > 0 && stock < 10
          if (stockFilter === 'out-of-stock') return stock === 0
          return true
        })

  // ── Check if any filter is active ────────────────────────────────────────
  const hasActiveFilters =
    searchQuery !== '' ||
    categoryFilter !== 'all' ||
    brandFilter !== 'all' ||
    statusFilter !== 'all' ||
    featuredFilter !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    sortValue !== 'default' ||
    stockFilter !== 'all'

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    resetPage()
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    resetPage()
  }

  const handleBrandChange = (value: string) => {
    setBrandFilter(value)
    resetPage()
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    resetPage()
  }

  const handleFeaturedChange = (value: string) => {
    setFeaturedFilter(value)
    resetPage()
  }

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value)
    resetPage()
  }

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value)
    resetPage()
  }

  const handleSortChange = (value: string) => {
    setSortValue(value)
    resetPage()
  }

  const handleStockChange = (value: string) => {
    setStockFilter(value)
  }

  const handleClearAll = useCallback(() => {
    setSearchQuery('')
    setCategoryFilter('all')
    setBrandFilter('all')
    setStatusFilter('all')
    setFeaturedFilter('all')
    setMinPrice('')
    setMaxPrice('')
    setSortValue('default')
    setStockFilter('all')
    resetPage()
  }, [resetPage])

  const handleDelete = (product: IAdminProductDataType) => {
    setSelectedProduct(product)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!selectedProduct) return
    deleteMutation.mutate(selectedProduct.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false)
        setSelectedProduct(null)
      },
    })
  }

  return (
    <div className="flex flex-col h-full gap-4 md:gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Sản phẩm</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Quản lý sản phẩm của cửa hàng
            {!isLoading && (
              <span className="ml-1 text-xs text-muted-foreground">
                ({totalCount} sản phẩm)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isFetching && !isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          <Button variant="primary-pink" onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="shrink-0">
        <ProductFilters
          categories={categories}
          brands={brands}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          categoryFilter={categoryFilter}
          onCategoryChange={handleCategoryChange}
          brandFilter={brandFilter}
          onBrandChange={handleBrandChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          featuredFilter={featuredFilter}
          onFeaturedChange={handleFeaturedChange}
          minPrice={minPrice}
          onMinPriceChange={handleMinPriceChange}
          maxPrice={maxPrice}
          onMaxPriceChange={handleMaxPriceChange}
          sortValue={sortValue}
          onSortChange={handleSortChange}
          stockFilter={stockFilter}
          onStockChange={handleStockChange}
          onClearAll={handleClearAll}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Product Table - takes remaining space and scrolls */}
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ProductTable products={filteredProducts} onDelete={handleDelete} />
        )}
      </div>

      {/* Pagination - server-side (totalCount từ BE) */}
      <div className="shrink-0">
        <TablePagination {...getPaginationProps(totalCount)} />
      </div>

      {/* Add Product Dialog */}
      <AddProductDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      {/* Delete Dialog */}
      <DeleteProductDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        product={selectedProduct}
        isPending={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
