'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import type {
  IAdminBrandDataType,
  IBrandFormData,
} from '@/lib/types/interfaces/apis/admin-brand.interfaces';
import { useUpdateBrandMutation } from '@/hooks/mutations/admin-category-brand.mutation';
import { BrandForm } from './brand-form';

interface EditBrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: IAdminBrandDataType | null;
}

/**
 * logoOverride = null  → dùng ảnh từ brand prop (không thay đổi)
 * logoOverride = { file, preview } → user đã chọn ảnh mới
 * logoOverride = 'removed'  → user đã xoá ảnh
 */
type LogoOverride =
  | null
  | 'removed'
  | { file: File; preview: string };

export function EditBrandDialog({ open, onOpenChange, brand }: EditBrandDialogProps) {
  const form = useForm<IBrandFormData>({
    values: brand
      ? {
          name: brand.name,
          description: brand.description ?? '',
          website: brand.website ?? '',
          isActive: brand.isActive,
          logoFile: null,
          logoPreview: brand.logoMedia?.url ?? null,
        }
      : {
          name: '',
          description: '',
          website: '',
          isActive: true,
          logoFile: null,
          logoPreview: null,
        },
  });

  const updateBrand = useUpdateBrandMutation();

  // Chỉ track sự thay đổi của user, không lưu lại ảnh ban đầu
  const [logoOverride, setLogoOverride] = useState<LogoOverride>(null);

  // Preview hiển thị: ưu tiên override, fallback về ảnh từ brand
  const logoPreview =
    logoOverride === 'removed'
      ? null
      : logoOverride !== null
        ? logoOverride.preview
        : (brand?.logoMedia?.url ?? null);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      setLogoOverride(null);
    }
    onOpenChange(newOpen);
  };

  const handleLogoChange = (file: File, previewUrl: string) => {
    setLogoOverride({ file, preview: previewUrl });
  };

  const handleLogoRemove = () => {
    setLogoOverride('removed');
  };

  const buildFormData = (values: IBrandFormData): FormData => {
    const fd = new FormData();
    fd.append('name', values.name);
    if (values.description) fd.append('description', values.description);
    if (values.website) fd.append('website', values.website);
    fd.append('isActive', String(values.isActive));
    if (logoOverride !== null && logoOverride !== 'removed') {
      fd.append('logo', logoOverride.file);
    } else if (logoOverride === 'removed') {
      fd.append('removeLogo', 'true');
    }
    return fd;
  };

  const handleSubmit = (values: IBrandFormData) => {
    if (!brand) return;
    const formData = buildFormData(values);
    updateBrand.mutate(
      { id: brand.id, formData },
      {
        onSuccess: () => {
          setLogoOverride(null);
          onOpenChange(false);
        },
      },
    );
  };

  if (!brand) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thương hiệu</DialogTitle>
          <p className="text-sm text-muted-foreground">/{brand.slug}</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <BrandForm
              form={form}
              logoPreview={logoPreview}
              onLogoChange={handleLogoChange}
              onLogoRemove={handleLogoRemove}
            />
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={updateBrand.isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary-pink"
                disabled={updateBrand.isPending}
              >
                {updateBrand.isPending && (
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
