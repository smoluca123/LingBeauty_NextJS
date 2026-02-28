'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IAdminCategoryDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';
import {
  CategoryTreeItem,
  CategoryFormDialog,
  CategoryFormData,
  DeleteCategoryDialog,
} from './category-tree';
import {
  useAdminCategories,
  useCreateCategory,
  useCreateSubCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../hooks';

const DEFAULT_FORM: CategoryFormData = {
  name: '',
  description: '',
  isActive: true,
  parentId: null,
};

export function CategoriesContent() {
  const { data: categories = [], isLoading } = useAdminCategories();
  const createCategoryMutation = useCreateCategory();
  const createSubCategoryMutation = useCreateSubCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IAdminCategoryDataType | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(DEFAULT_FORM);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleAddNew = () => {
    setSelectedCategory(null);
    setFormData(DEFAULT_FORM);
    setFormDialogOpen(true);
  };

  /** Triggered từ nút + trên một tree-item → pre-select parent */
  const handleAddChild = (parentId: string) => {
    setSelectedCategory(null);
    setFormData({ ...DEFAULT_FORM, parentId });
    setFormDialogOpen(true);
  };

  const handleEdit = (category: IAdminCategoryDataType) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description ?? '',
      isActive: category.isActive,
      parentId: null, // không hiển thị parent selector khi edit
    });
    setFormDialogOpen(true);
  };

  const handleDelete = (category: IAdminCategoryDataType) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  // ─── Save ────────────────────────────────────────────────────────────────────

  const handleSave = () => {
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      isActive: formData.isActive,
    };

    if (selectedCategory) {
      // Edit existing
      updateCategoryMutation.mutate(
        { id: selectedCategory.id, data: payload },
        {
          onSuccess: () => {
            setFormDialogOpen(false);
            setSelectedCategory(null);
          },
        },
      );
    } else if (formData.parentId) {
      // Create sub-category under a parent
      createSubCategoryMutation.mutate(
        { parentId: formData.parentId, data: payload },
        { onSuccess: () => setFormDialogOpen(false) },
      );
    } else {
      // Create root-level category
      createCategoryMutation.mutate(payload, {
        onSuccess: () => setFormDialogOpen(false),
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!selectedCategory) return;
    deleteCategoryMutation.mutate(selectedCategory.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedCategory(null);
      },
    });
  };

  // ─── Derived ─────────────────────────────────────────────────────────────────

  const isSavePending =
    createCategoryMutation.isPending ||
    createSubCategoryMutation.isPending ||
    updateCategoryMutation.isPending;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Danh mục sản phẩm</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Quản lý danh mục sản phẩm của cửa hàng
          </p>
        </div>
        <Button variant="primary-pink" onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm danh mục
        </Button>
      </div>

      {/* Category Tree */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Chưa có danh mục nào. Hãy thêm danh mục đầu tiên.
        </div>
      ) : (
        <div className="space-y-2">
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

      {/* Create / Edit Dialog */}
      <CategoryFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        category={selectedCategory}
        formData={formData}
        onFormChange={(updates) => setFormData((prev) => ({ ...prev, ...updates }))}
        onSave={handleSave}
        rootCategories={categories}
        isPending={isSavePending}
      />

      {/* Delete Confirm Dialog */}
      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        category={selectedCategory}
        onConfirm={handleConfirmDelete}
        isPending={deleteCategoryMutation.isPending}
      />
    </div>
  );
}
