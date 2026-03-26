'use client';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { IAdminCategoryDataType, ICategoryFormData } from '@/lib/types/interfaces/apis/admin-category.interfaces';
import { useUpdateCategoryMutation } from '@/hooks/mutations/admin-category-brand.mutation';
import { CategoryForm } from './category-form';

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: IAdminCategoryDataType | null;
}

export function EditCategoryDialog({
  open,
  onOpenChange,
  category,
}: EditCategoryDialogProps) {
  const form = useForm<ICategoryFormData>({
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
      sortOrder: 0,
      type: 'CATEGORY',
      brandId: undefined,
      parentId: undefined,
      imageFile: null,
      imagePreview: null,
    },
  });

  const updateCategory = useUpdateCategoryMutation();

  // Derive imagePreview from form state — useWatch is compiler-safe unlike form.watch()
  const imagePreview = useWatch({ control: form.control, name: 'imagePreview' }) ?? null;

  // Pre-fill form khi category thay đổi
  useEffect(() => {
    if (category && open) {
      const existingPreview = category.imageMedia?.url ?? null;
      form.reset({
        name: category.name,
        description: category.description ?? '',
        isActive: category.isActive,
        sortOrder: category.sortOrder,
        type: category.type ?? 'CATEGORY',
        brandId: category.brand?.id ?? undefined,
        parentId: category.parentId ?? undefined,
        imageFile: null,
        imagePreview: existingPreview,
      });
      // imagePreview is already set via form.reset above — no separate setState needed
    }
  }, [category, open, form]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      // imagePreview is part of form state, so form.reset() already clears it
    }
    onOpenChange(newOpen);
  };

  const buildFormData = (values: ICategoryFormData): FormData => {
    const fd = new FormData();
    fd.append('name', values.name);
    if (values.description) fd.append('description', values.description);
    fd.append('isActive', String(values.isActive));
    fd.append('sortOrder', String(values.sortOrder ?? 0));
    fd.append('type', values.type);
    if (values.brandId) fd.append('brandId', values.brandId);
    if (values.parentId) fd.append('parentId', values.parentId);
    // Chỉ gửi image nếu user đã chọn file mới
    if (values.imageFile) fd.append('image', values.imageFile);
    return fd;
  };

  const handleSubmit = (values: ICategoryFormData) => {
    if (!category) return;
    const formData = buildFormData(values);
    updateCategory.mutate(
      { id: category.id, formData },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
          <p className="text-sm text-muted-foreground">/{category.slug}</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CategoryForm
              form={form}
              excludeCategoryId={category.id}
              imagePreview={imagePreview}
              onImagePreviewChange={(preview) => form.setValue('imagePreview', preview)}
            />
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={updateCategory.isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary-pink"
                disabled={updateCategory.isPending}
              >
                {updateCategory.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
