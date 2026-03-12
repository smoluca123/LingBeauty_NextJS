import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getAllAdminCategoriesClientAPI,
  getAllAdminBrandsClientAPI,
  createCategoryClientAPI,
  createSubCategoryClientAPI,
  updateCategoryClientAPI,
  deleteCategoryClientAPI,
} from '@/lib/apis/client/admin-category-brand.apis';
import {
  getAllAdminBrandsPagedClientAPI,
  createBrandClientAPI,
  updateBrandClientAPI,
  deleteBrandClientAPI,
} from '@/lib/apis/client/admin-brand.apis';

// ── Query Keys ────────────────────────────────────────────────────────────────

export const adminCategoryBrandQueryKeys = {
  categories: ['admin', 'categories'] as const,
  brands: ['admin', 'brands'] as const,
};

// ── Get All Categories (Admin – for dropdowns) ───────────────────────────────

export const useAdminCategoriesQuery = () =>
  useQuery({
    queryKey: adminCategoryBrandQueryKeys.categories,
    queryFn: () => getAllAdminCategoriesClientAPI(),
    staleTime: 1000 * 60 * 5, // 5 phút – categories ít thay đổi
  });

// ── Get All Brands (Admin – for dropdowns) ───────────────────────────────────

export const useAdminBrandsQuery = () =>
  useQuery({
    queryKey: adminCategoryBrandQueryKeys.brands,
    queryFn: () => getAllAdminBrandsClientAPI(),
    staleTime: 1000 * 60 * 5, // 5 phút – brands ít thay đổi
  });

// ── Get All Brands Paged (Admin – for brands table) ──────────────────────────

export const useAdminBrandsPagedQuery = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  order?: 'asc' | 'desc';
}) =>
  useQuery({
    queryKey: [...adminCategoryBrandQueryKeys.brands, params],
    queryFn: () => getAllAdminBrandsPagedClientAPI(params),
    staleTime: 1000 * 60 * 2,
  });

// ── Create Category ───────────────────────────────────────────────────────────

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createCategoryClientAPI(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryBrandQueryKeys.categories,
      });
      toast.success('Tạo danh mục thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Tạo danh mục thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Create Sub-Category (Admin) ─────────────────────────────────────────────────────────────────────

export const useCreateSubCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ parentId, formData }: { parentId: string; formData: FormData }) =>
      createSubCategoryClientAPI(parentId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryBrandQueryKeys.categories,
      });
      toast.success('Tạo danh mục con thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Tạo danh mục con thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Update Category ───────────────────────────────────────────────────────────

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateCategoryClientAPI(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryBrandQueryKeys.categories,
      });
      toast.success('Cập nhật danh mục thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Cập nhật danh mục thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Delete Category ───────────────────────────────────────────────────────────

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategoryClientAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryBrandQueryKeys.categories,
      });
      toast.success('Xóa danh mục thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Xóa danh mục thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Create Brand ──────────────────────────────────────────────────────────────

export const useCreateBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createBrandClientAPI(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryBrandQueryKeys.brands,
      });
      toast.success('Tạo thương hiệu thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Tạo thương hiệu thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Update Brand ──────────────────────────────────────────────────────────────

export const useUpdateBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateBrandClientAPI(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryBrandQueryKeys.brands,
      });
      toast.success('Cập nhật thương hiệu thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Cập nhật thương hiệu thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Delete Brand ──────────────────────────────────────────────────────────────

export const useDeleteBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBrandClientAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryBrandQueryKeys.brands,
      });
      toast.success('Xóa thương hiệu thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Xóa thương hiệu thất bại. Vui lòng thử lại.',
      );
    },
  });
};
