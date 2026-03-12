'use client';

import { useState } from 'react';
import { Loader2, Store } from 'lucide-react';
import { useAdminBrandsPagedQuery } from '@/hooks/querys/admin-category-brand.query';
import type { IAdminBrandDataType } from '@/lib/types/interfaces/apis/admin-brand.interfaces';
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { BrandsHeader } from './brands-header';
import {
  BrandTable,
  CreateBrandDialog,
  EditBrandDialog,
  DeleteBrandDialog,
} from './brand-table';

export function BrandsContent() {
  const { data, isLoading, isError } = useAdminBrandsPagedQuery({ limit: 50 });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState<IAdminBrandDataType | null>(null);

  const result = data as IApiPaginationResponseWrapperType<IAdminBrandDataType> | undefined;
  const brands = result?.data?.items ?? [];

  const handleAddNew = () => {
    setCreateDialogOpen(true);
  };

  const handleEdit = (brand: IAdminBrandDataType) => {
    setSelectedBrand(brand);
    setEditDialogOpen(true);
  };

  const handleDelete = (brand: IAdminBrandDataType) => {
    setSelectedBrand(brand);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full gap-4 md:gap-6 w-full min-w-0">
      <BrandsHeader onAddNew={handleAddNew} />

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 w-full">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="flex items-center justify-center py-20 text-destructive w-full">
          Lỗi khi tải danh sách thương hiệu. Vui lòng thử lại.
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && brands.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 w-full">
          <Store className="h-12 w-12" />
          <p className="text-lg font-medium">Chưa có thương hiệu nào</p>
          <p className="text-sm">Nhấn &ldquo;Thêm thương hiệu&rdquo; để tạo thương hiệu đầu tiên</p>
        </div>
      )}

      {/* Brand Table */}
      {!isLoading && !isError && brands.length > 0 && (
        <div className="flex-1 min-h-0">
          <BrandTable
            brands={brands}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* Create Dialog */}
      <CreateBrandDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {/* Edit Dialog */}
      <EditBrandDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        brand={selectedBrand}
      />

      {/* Delete Dialog */}
      <DeleteBrandDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        brand={selectedBrand}
      />
    </div>
  );
}
