'use client';

import { useState, useCallback } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IAdminProductDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';
import { IUpdateProductPayload } from '@/lib/apis/client/actions/admin-product.actions';
import { TablePagination } from '@/app/admin/components';
import { AddProductDialog } from './product-table/add-product-dialog';
import {
  ProductFilters,
  ProductTable,
  DeleteProductDialog,
  EditProductDialog,
  UploadImageDialog,
  AddVariantDialog,
} from './product-table';
import { useAdminProducts, useDeleteProduct, useUpdateProduct } from '../hooks';
import { useAdminCategories } from '../../categories/hooks';

export function ProductsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [uploadImageDialogOpen, setUploadImageDialogOpen] = useState(false);
  const [addVariantDialogOpen, setAddVariantDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IAdminProductDataType | null>(null);

  const { data: categoriesData = [] } = useAdminCategories();
  const deleteProductMutation = useDeleteProduct();
  const updateProductMutation = useUpdateProduct();

  const queryParams = {
    page,
    limit: LIMIT,
    search: searchQuery || undefined,
    categoryId: categoryFilter !== 'all' ? categoryFilter : undefined,
  };

  const { data, isLoading } = useAdminProducts(queryParams);
  const products = data?.data.items ?? [];
  const total = data?.data.totalCount ?? 0;
  const totalPages = data?.data.totalPage ?? 0;

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategoryFilter(value);
    setPage(1);
  }, []);

  const handleEdit = (product: IAdminProductDataType) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const handleDelete = (product: IAdminProductDataType) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleUploadImage = (product: IAdminProductDataType) => {
    setSelectedProduct(product);
    setUploadImageDialogOpen(true);
  };

  const handleAddVariant = (product: IAdminProductDataType) => {
    setSelectedProduct(product);
    setAddVariantDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedProduct) return;
    deleteProductMutation.mutate(selectedProduct.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedProduct(null);
      },
    });
  };

  const handleSaveEdit = (id: string, data: IUpdateProductPayload) => {
    updateProductMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          setEditDialogOpen(false);
          setSelectedProduct(null);
        },
      },
    );
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
          stockFilter="all"
          onStockChange={() => {}}
          categories={categoriesData}
        />
      </div>

      {/* Product Table */}
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUploadImage={handleUploadImage}
            onAddVariant={handleAddVariant}
          />
        )}
      </div>

      {/* Pagination */}
      <div className="shrink-0">
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={total}
          pageSize={LIMIT}
          onPageSizeChange={() => {}}
        />
      </div>

      {/* Upload Image Dialog */}
      <UploadImageDialog
        key={selectedProduct?.id ? `upload-${selectedProduct.id}` : 'upload-no-product'}
        open={uploadImageDialogOpen}
        onOpenChange={setUploadImageDialogOpen}
        product={selectedProduct}
      />

      {/* Add Variant Dialog */}
      <AddVariantDialog
        key={selectedProduct?.id ? `variant-${selectedProduct.id}` : 'variant-no-product'}
        open={addVariantDialogOpen}
        onOpenChange={setAddVariantDialogOpen}
        product={selectedProduct}
      />

      {/* Add Product Dialog */}
      <AddProductDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      {/* Edit Product Dialog — key resets component state when selected product changes */}
      <EditProductDialog
        key={selectedProduct?.id ?? 'no-product'}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        product={selectedProduct}
        categories={categoriesData}
        onSave={handleSaveEdit}
        isPending={updateProductMutation.isPending}
      />

      {/* Delete Dialog */}
      <DeleteProductDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        product={selectedProduct}
        onConfirm={confirmDelete}
        isPending={deleteProductMutation.isPending}
      />
    </div>
  );
}
