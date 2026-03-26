'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ICategoryFormData } from '@/lib/types/interfaces/apis/admin-category.interfaces';
import {
  useCreateCategoryMutation,
  useCreateSubCategoryMutation,
} from '@/hooks/mutations/admin-category-brand.mutation';
import { CategoryForm } from './category-form';

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Khi click nút "+" trên tree item → pre-populate parentId vào select.
   * Nếu null/undefined → select trống (danh mục gốc).
   */
  parentId?: string | null;
}

const DEFAULT_VALUES: ICategoryFormData = {
  name: '',
  description: '',
  isActive: true,
  sortOrder: 0,
  type: 'CATEGORY',
  brandId: undefined,
  parentId: undefined,
  imageFile: null,
  imagePreview: null,
};

export function CreateCategoryDialog({
  open,
  onOpenChange,
  parentId,
}: CreateCategoryDialogProps) {
  const form = useForm<ICategoryFormData>({ defaultValues: DEFAULT_VALUES });

  const createCategory = useCreateCategoryMutation();
  const createSubCategory = useCreateSubCategoryMutation();

  // Dùng mutation phù hợp tuỳ theo có parentId hay không
  const isPending = parentId
    ? createSubCategory.isPending
    : createCategory.isPending;

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Khi dialog mở với parentId từ tree item → pre-populate select cha
  useEffect(() => {
    if (open) {
      form.reset({
        ...DEFAULT_VALUES,
        parentId: typeof parentId === 'string' ? parentId : undefined,
      });
    }
  }, [open, parentId, form]);

  const buildFormData = (values: ICategoryFormData): FormData => {
    const fd = new FormData();
    fd.append('name', values.name);
    if (values.description) fd.append('description', values.description);
    fd.append('isActive', String(values.isActive));
    fd.append('sortOrder', String(values.sortOrder ?? 0));
    fd.append('type', values.type);
    if (values.brandId) fd.append('brandId', values.brandId);
    if (values.imageFile) fd.append('image', values.imageFile);
    return fd;
  };

  const handleSubmit = (values: ICategoryFormData) => {
    const formData = buildFormData(values);

    // Chọn API đúng: sub-category khi có parentId, root category khi không có
    const effectiveParentId = values.parentId || parentId;

    if (effectiveParentId) {
      createSubCategory.mutate(
        { parentId: effectiveParentId, formData },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createCategory.mutate(formData, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset(DEFAULT_VALUES);
      setImagePreview(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {parentId ? 'Thêm danh mục con' : 'Thêm danh mục mới'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {parentId
              ? 'Tạo danh mục con cho danh mục đã chọn.'
              : 'Chọn danh mục cha bên dưới để tạo danh mục con, hoặc để trống để tạo danh mục gốc.'}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CategoryForm
              form={form}
              imagePreview={imagePreview}
              onImagePreviewChange={setImagePreview}
            />
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button type="submit" variant="primary-pink" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {parentId ? 'Tạo danh mục con' : 'Tạo danh mục'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
