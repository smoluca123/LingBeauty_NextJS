'use client';

import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockAdminProducts, mockAdminCategories } from '@/lib/mock-data/admin';
import { IAdminProductDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';
import { TablePagination } from '@/app/admin/components';
import { usePagination } from '@/app/admin/hooks';
import { AddProductDialog } from './add-product-dialog';
import {
  ProductFilters,
  ProductTable,
  DeleteProductDialog,
} from './product-table';

export function ProductsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const {
    resetPage,
    paginate,
    getPaginationProps,
  } = usePagination();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IAdminProductDataType | null>(null);

  // Filter products
  const filteredProducts = mockAdminProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' ||
      product.category.id === categoryFilter;

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in-stock' && product.stock >= 10) ||
      (stockFilter === 'low-stock' && product.stock > 0 && product.stock < 10) ||
      (stockFilter === 'out-of-stock' && product.stock === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Pagination
  const paginatedProducts = useMemo(
    () => paginate(filteredProducts),
    [filteredProducts, paginate]
  );

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    resetPage();
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    resetPage();
  };

  const handleStockChange = (value: string) => {
    setStockFilter(value);
    resetPage();
  };

  // Removed handlePageSizeChange since it's handled by the hook

  const handleDelete = (product: IAdminProductDataType) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting product:', selectedProduct?.id);
    setDeleteDialogOpen(false);
  };

  return (
    <div className="flex flex-col h-full gap-4 md:gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Sản phẩm</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Quản lý sản phẩm của cửa hàng
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary-pink" onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="shrink-0">
        <ProductFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          categoryFilter={categoryFilter}
          onCategoryChange={handleCategoryChange}
          stockFilter={stockFilter}
          onStockChange={handleStockChange}
          categories={mockAdminCategories}
        />
      </div>

      {/* Product Table - takes remaining space and scrolls */}
      <div className="flex-1 min-h-0">
        <ProductTable products={paginatedProducts} onDelete={handleDelete} />
      </div>

      {/* Pagination */}
      <div className="shrink-0">
        <TablePagination
          {...getPaginationProps(filteredProducts.length)}
        />
      </div>

      {/* Add Product Dialog */}
      <AddProductDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      {/* Delete Dialog */}
      <DeleteProductDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        product={selectedProduct}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
