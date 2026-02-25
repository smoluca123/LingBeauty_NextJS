'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockAdminCategories } from '@/lib/mock-data/admin';
import { IAdminCategoryDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';
import {
  CategoryTreeItem,
  EditCategoryDialog,
  DeleteCategoryDialog,
} from './category-tree';

export function CategoriesContent() {
  const [categories] = useState(mockAdminCategories);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IAdminCategoryDataType | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', isActive: true });

  const handleEdit = (category: IAdminCategoryDataType) => {
    setSelectedCategory(category);
    setParentId(null);
    setFormData({
      name: category.name,
      slug: category.slug,
      isActive: category.isActive,
    });
    setEditDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCategory(null);
    setParentId(null);
    setFormData({ name: '', slug: '', isActive: true });
    setEditDialogOpen(true);
  };

  const handleAddChild = (categoryId: string) => {
    setSelectedCategory(null);
    setParentId(categoryId);
    setFormData({ name: '', slug: '', isActive: true });
    setEditDialogOpen(true);
  };

  const handleDelete = (category: IAdminCategoryDataType) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleSave = () => {
    console.log('Saving category:', formData, 'Parent:', parentId);
    setEditDialogOpen(false);
  };

  const confirmDelete = () => {
    console.log('Deleting category:', selectedCategory?.id);
    setDeleteDialogOpen(false);
  };

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

      {/* Edit Dialog */}
      <EditCategoryDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        category={selectedCategory}
        formData={formData}
        onFormChange={(updates) => setFormData((prev) => ({ ...prev, ...updates }))}
        onSave={handleSave}
        parentId={parentId}
      />

      {/* Delete Dialog */}
      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        category={selectedCategory}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
