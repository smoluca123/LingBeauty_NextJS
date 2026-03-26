import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createCategoryClientAPI,
  createSubCategoryClientAPI,
  updateCategoryClientAPI,
  deleteCategoryClientAPI,
} from '@/lib/apis/client/admin-category-brand.apis'
import {
  createBrandClientAPI,
  updateBrandClientAPI,
  deleteBrandClientAPI,
} from '@/lib/apis/client/admin-brand.apis'
import { adminCategoryBrandQueryKeys } from '@/hooks/querys/admin-category-brand.query'

// ── Create Category ───────────────────────────────────────────────────────────

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => createCategoryClientAPI(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryBrandQueryKeys.categories,
      })
      toast.success('Tạo danh mục thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Tạo danh mục thất bại. Vui lòng thử lại.',
      )
    },
  })
}

// ── Create Sub-Category (Admin) ───────────────────────────────────────────────

export const useCreateSubCategoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      parentId,
      formData,
    }: {
      parentId: string
      formData: FormData
    }) => createSubCategoryClientAPI(parentId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryBrandQueryKeys.categories,
      })
      toast.success('Tạo danh mục con thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Tạo danh mục con thất bại. Vui lòng thử lại.',
      )
    },
  })
}

// ── Update Category ───────────────────────────────────────────────────────────

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateCategoryClientAPI(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryBrandQueryKeys.categories,
      })
      toast.success('Cập nhật danh mục thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Cập nhật danh mục thất bại. Vui lòng thử lại.',
      )
    },
  })
}

// ── Delete Category ───────────────────────────────────────────────────────────

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCategoryClientAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryBrandQueryKeys.categories,
      })
      toast.success('Xóa danh mục thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Xóa danh mục thất bại. Vui lòng thử lại.',
      )
    },
  })
}

// ── Create Brand ──────────────────────────────────────────────────────────────

export const useCreateBrandMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => createBrandClientAPI(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryBrandQueryKeys.brands,
      })
      toast.success('Tạo thương hiệu thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Tạo thương hiệu thất bại. Vui lòng thử lại.',
      )
    },
  })
}

// ── Update Brand ──────────────────────────────────────────────────────────────

export const useUpdateBrandMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateBrandClientAPI(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryBrandQueryKeys.brands,
      })
      toast.success('Cập nhật thương hiệu thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Cập nhật thương hiệu thất bại. Vui lòng thử lại.',
      )
    },
  })
}

// ── Delete Brand ──────────────────────────────────────────────────────────────

export const useDeleteBrandMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBrandClientAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryBrandQueryKeys.brands,
      })
      toast.success('Xóa thương hiệu thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Xóa thương hiệu thất bại. Vui lòng thử lại.',
      )
    },
  })
}
