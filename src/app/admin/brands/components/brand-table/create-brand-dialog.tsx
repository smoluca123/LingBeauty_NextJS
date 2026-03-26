'use client';

import { useState } from 'react';
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
import type { IBrandFormData } from '@/lib/types/interfaces/apis/admin-brand.interfaces';
import { useCreateBrandMutation } from '@/hooks/mutations/admin-category-brand.mutation';
import { BrandForm } from './brand-form';

interface CreateBrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_VALUES: IBrandFormData = {
  name: '',
  description: '',
  website: '',
  isActive: true,
  logoFile: null,
  logoPreview: null,
};

export function CreateBrandDialog({ open, onOpenChange }: CreateBrandDialogProps) {
  const form = useForm<IBrandFormData>({ defaultValues: DEFAULT_VALUES });
  const createBrand = useCreateBrandMutation();

  // ✅ Gộp logoFile + logoPreview vào 1 state để tránh multiple setState trong useEffect
  const [logoState, setLogoState] = useState<{ file: File | null; preview: string | null }>({
    file: null,
    preview: null,
  });

  const handleLogoChange = (file: File, previewUrl: string) => {
    setLogoState({ file, preview: previewUrl });
  };

  const handleLogoRemove = () => {
    setLogoState({ file: null, preview: null });
  };

  const buildFormData = (values: IBrandFormData): FormData => {
    const fd = new FormData();
    fd.append('name', values.name);
    if (values.description) fd.append('description', values.description);
    if (values.website) fd.append('website', values.website);
    fd.append('isActive', String(values.isActive));
    if (logoState.file) fd.append('logo', logoState.file);
    return fd;
  };

  const handleSubmit = (values: IBrandFormData) => {
    const formData = buildFormData(values);
    createBrand.mutate(formData, {
      onSuccess: () => {
        form.reset(DEFAULT_VALUES);
        setLogoState({ file: null, preview: null });
        onOpenChange(false);
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset(DEFAULT_VALUES);
      setLogoState({ file: null, preview: null });
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm thương hiệu mới</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Điền thông tin để tạo thương hiệu mới.
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <BrandForm
              form={form}
              logoPreview={logoState.preview}
              onLogoChange={handleLogoChange}
              onLogoRemove={handleLogoRemove}
            />
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={createBrand.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" variant="primary-pink" disabled={createBrand.isPending}>
                {createBrand.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Tạo thương hiệu
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
