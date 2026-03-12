'use client';

import { useState } from 'react';
import { Loader2, FolderOpen } from 'lucide-react';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { ICategoryDataType } from '@/lib/types/interfaces/apis/header.interfaces';
import { IAdminCategoryDataType } from '@/lib/types/interfaces/apis/admin-category.interfaces';
import { useAdminCategoriesQuery } from '@/hooks/querys/admin-category-brand.query';
import { CategoriesHeader } from './categories-header';
import {
  CategoryTreeItem,
  CreateCategoryDialog,
  EditCategoryDialog,
  DeleteCategoryDialog,
} from './category-tree';


export function CategoriesContent() {
  const { data, isLoading, isError } = useAdminCategoriesQuery();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<IAdminCategoryDataType | null>(null);
  const [parentCategory, setParentCategory] = useState<IAdminCategoryDataType | null>(null);

  const result = data as IApiResponseWrapperType<ICategoryDataType[]> | undefined;
  const categories = (result?.data ?? []) as unknown as IAdminCategoryDataType[];

  // Handlers
  const handleAddNew = () => {
    setParentCategory(null);
    setCreateDialogOpen(true);
  };

  const handleAddChild = (parent: IAdminCategoryDataType) => {
    setParentCategory(parent);
    setCreateDialogOpen(true);
  };

  const handleEdit = (category: IAdminCategoryDataType) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const handleDelete = (category: IAdminCategoryDataType) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full gap-4 md:gap-6 w-full min-w-0">
      <CategoriesHeader onAddNew={handleAddNew} />

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 w-full">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="flex items-center justify-center py-20 text-destructive w-full">
          Lỗi khi tải danh mục. Vui lòng thử lại.
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 w-full">
          <FolderOpen className="h-12 w-12" />
          <p className="text-lg font-medium">Chưa có danh mục nào</p>
          <p className="text-sm">Nhấn &ldquo;Thêm danh mục&rdquo; để tạo danh mục đầu tiên</p>
        </div>
      )}

      {/* Category Tree */}
      {!isLoading && !isError && categories.length > 0 && (
        <div className="space-y-2 w-full min-w-0">
          {categories.map((category) => (
            <CategoryTreeItem
              key={category.id}
              category={category}
              level={0}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddChild={handleAddChild}
            />
          ))}
        </div>
      )}

      {/* Create Dialog (root & sub-category) */}
      <CreateCategoryDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        parentId={parentCategory?.id ?? null}
      />

      {/* Edit Dialog */}
      <EditCategoryDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        category={selectedCategory}
      />

      {/* Delete Dialog */}
      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        category={selectedCategory}
      />
    </div>
  );
}
