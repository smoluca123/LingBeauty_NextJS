'use client'

import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  IAdminCategoryDataType,
  ICategoryFormData,
} from '@/lib/types/interfaces/apis/admin-category.interfaces'
import {
  useCreateCategoryMutation,
  useCreateSubCategoryMutation,
  useUpdateCategoryMutation,
} from '@/hooks/mutations/admin-category-brand.mutation'
import { CategoryForm } from './category-form'
import { categoryFormSchema } from './schema/category-form.schema'

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /**
   * Mode: 'create' hoặc 'edit'
   */
  mode: 'create' | 'edit'
  /**
   * Category đang edit (chỉ dùng khi mode='edit')
   */
  category?: IAdminCategoryDataType | null
  /**
   * Parent ID khi tạo mới (chỉ dùng khi mode='create')
   */
  parentId?: string | null
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
}

export function CategoryDialog({
  open,
  onOpenChange,
  mode,
  category,
  parentId,
}: CategoryDialogProps) {
  const form = useForm<ICategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const createCategory = useCreateCategoryMutation()
  const createSubCategory = useCreateSubCategoryMutation()
  const updateCategory = useUpdateCategoryMutation()

  // Derive imagePreview from form state
  const imagePreview =
    useWatch({ control: form.control, name: 'imagePreview' }) ?? null

  // Determine loading state based on mode
  const isPending =
    mode === 'create'
      ? parentId
        ? createSubCategory.isPending
        : createCategory.isPending
      : updateCategory.isPending

  // Pre-fill form khi dialog mở
  useEffect(() => {
    if (open) {
      if (mode === 'create') {
        // Mode tạo mới: reset về default + pre-populate parentId nếu có
        form.reset({
          ...DEFAULT_VALUES,
          parentId: typeof parentId === 'string' ? parentId : undefined,
        })
      } else if (mode === 'edit' && category) {
        // Mode edit: pre-fill dữ liệu từ category
        const existingPreview = category.imageMedia?.url ?? null
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
        })
      }
    }
  }, [open, mode, category, parentId, form])

  const buildFormData = (values: ICategoryFormData): FormData => {
    const fd = new FormData()
    fd.append('name', values.name)
    if (values.description) fd.append('description', values.description)
    fd.append('isActive', String(values.isActive))
    fd.append('sortOrder', String(values.sortOrder ?? 0))
    fd.append('type', values.type)
    if (values.brandId) fd.append('brandId', values.brandId)
    if (values.parentId) fd.append('parentId', values.parentId)
    // Chỉ gửi image nếu user đã chọn file mới
    if (values.imageFile) fd.append('image', values.imageFile)
    return fd
  }

  const handleSubmit = (values: ICategoryFormData) => {
    const formData = buildFormData(values)

    if (mode === 'create') {
      // Chọn API đúng: sub-category khi có parentId, root category khi không có
      const effectiveParentId = values.parentId || parentId

      if (effectiveParentId) {
        createSubCategory.mutate(
          { parentId: effectiveParentId, formData },
          { onSuccess: () => onOpenChange(false) },
        )
      } else {
        createCategory.mutate(formData, {
          onSuccess: () => onOpenChange(false),
        })
      }
    } else if (mode === 'edit' && category) {
      updateCategory.mutate(
        { id: category.id, formData },
        {
          onSuccess: () => {
            onOpenChange(false)
          },
        },
      )
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset(DEFAULT_VALUES)
    }
    onOpenChange(newOpen)
  }

  const handleImagePreviewChange = (preview: string | null) => {
    form.setValue('imagePreview', preview)
  }

  // Determine dialog title and description
  const getDialogContent = () => {
    if (mode === 'create') {
      return {
        title: parentId ? 'Thêm danh mục con' : 'Thêm danh mục mới',
        description: parentId
          ? 'Tạo danh mục con cho danh mục đã chọn.'
          : 'Chọn danh mục cha bên dưới để tạo danh mục con, hoặc để trống để tạo danh mục gốc.',
        submitLabel: parentId ? 'Tạo danh mục con' : 'Tạo danh mục',
      }
    } else {
      return {
        title: 'Chỉnh sửa danh mục',
        description: category ? `/${category.slug}` : '',
        submitLabel: 'Lưu thay đổi',
      }
    }
  }

  const dialogContent = getDialogContent()

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogContent.title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {dialogContent.description}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CategoryForm
              form={form}
              excludeCategoryId={mode === 'edit' ? category?.id : undefined}
              imagePreview={imagePreview}
              onImagePreviewChange={handleImagePreviewChange}
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
                {dialogContent.submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
