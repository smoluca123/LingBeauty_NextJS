import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getAllAdminProductsClientAPI,
  getProductByIdClientAPI,
  createProductClientAPI,
  updateProductClientAPI,
  getProductImagesClientAPI,
  uploadProductImageClientAPI,
  updateProductImageClientAPI,
  deleteProductImageClientAPI,
  deleteProductClientAPI,
  getProductVariantsClientAPI,
  addProductVariantClientAPI,
  updateProductVariantClientAPI,
  deleteProductVariantClientAPI,
  getProductBadgesClientAPI,
  addProductBadgeClientAPI,
  updateProductBadgeClientAPI,
  deleteProductBadgeClientAPI,
} from '@/lib/apis/client/admin-product.apis';
import type {
  IAdminProductFilters,
  IAdminProductBadge,
  IAdminProductVariant,
  ICreateProductPayload,
  ICreateProductVariantPayload,
  IUpdateProductPayload,
  IUpdateProductImagePayload,
  IUpdateProductVariantPayload,
  ICreateProductBadgePayload,
  IUpdateProductBadgePayload,
} from '@/lib/types/interfaces/apis/admin-product.interfaces';

// ── Query Keys ────────────────────────────────────────────────────────────────

export const adminProductQueryKeys = {
  all: ['admin', 'products'] as const,
  list: (params: IAdminProductFilters) =>
    ['admin', 'products', 'list', params] as const,
  detail: (productId: string) =>
    ['admin', 'products', 'detail', productId] as const,
};

// ── Get All Products (Admin) ──────────────────────────────────────────────────

export const useAdminProductsQuery = (params: IAdminProductFilters = {}) =>
  useQuery({
    queryKey: adminProductQueryKeys.list(params),
    queryFn: () => getAllAdminProductsClientAPI(params),
    staleTime: 1000 * 30, // 30 giây
    placeholderData: (prev) => prev, // giữ data cũ khi đang fetch trang mới
  });

// ── Get Product by ID (Admin) ─────────────────────────────────────────────────

export const useAdminProductByIdQuery = (productId: string | null) =>
  useQuery({
    queryKey: adminProductQueryKeys.detail(productId ?? ''),
    queryFn: () => getProductByIdClientAPI(productId!),
    enabled: !!productId,
    staleTime: 1000 * 60, // 1 phút
  });

// ── Create Product (Admin) ────────────────────────────────────────────────────

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateProductPayload) => createProductClientAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProductQueryKeys.all });
      toast.success('Tạo sản phẩm thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Tạo sản phẩm thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Update Product (Admin) ────────────────────────────────────────────────────

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: IUpdateProductPayload;
    }) => updateProductClientAPI(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProductQueryKeys.all });
      toast.success('Cập nhật sản phẩm thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Cập nhật sản phẩm thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Query Keys for Images ──────────────────────────────────────────────────────

export const productImageQueryKeys = {
  images: (productId: string) =>
    ['admin', 'products', productId, 'images'] as const,
};

// ── Get Product Images ─────────────────────────────────────────────────────────

export const useProductImagesQuery = (productId: string | null) =>
  useQuery({
    queryKey: productImageQueryKeys.images(productId ?? ''),
    queryFn: () => getProductImagesClientAPI(productId!),
    enabled: !!productId,
    staleTime: 1000 * 30,
  });

// ── Upload Product Image ───────────────────────────────────────────────────────

export const useUploadProductImageMutation = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      uploadProductImageClientAPI(productId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productImageQueryKeys.images(productId),
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Upload ảnh thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Set Primary Image ──────────────────────────────────────────────────────────

export const useSetPrimaryProductImageMutation = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      imageId,
      data,
    }: {
      imageId: string;
      data: IUpdateProductImagePayload;
    }) => updateProductImageClientAPI(productId, imageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productImageQueryKeys.images(productId),
      });
      queryClient.invalidateQueries({ queryKey: adminProductQueryKeys.all });
      toast.success('Đã đặt làm ảnh chính!');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Cập nhật ảnh thất bại.',
      );
    },
  });
};

// ── Update Product Image (sortOrder, alt, isPrimary) ──────────────────────────

export const useUpdateProductImageMutation = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      imageId,
      data,
    }: {
      imageId: string;
      data: IUpdateProductImagePayload;
    }) => updateProductImageClientAPI(productId, imageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productImageQueryKeys.images(productId),
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Cập nhật ảnh thất bại.',
      );
    },
  });
};

// ── Delete Product Image ───────────────────────────────────────────────────────

export const useDeleteProductImageMutation = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) =>
      deleteProductImageClientAPI(productId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productImageQueryKeys.images(productId),
      });
      queryClient.invalidateQueries({ queryKey: adminProductQueryKeys.all });
      toast.success('Đã xóa ảnh!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Xóa ảnh thất bại.');
    },
  });
};

// ── Delete Product (Admin) ───────────────────────────────────────────────────────

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => deleteProductClientAPI(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProductQueryKeys.all });
      toast.success('Xóa sản phẩm thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Xóa sản phẩm thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Query Keys for Variants ────────────────────────────────────────────────────

export const productVariantQueryKeys = {
  variants: (productId: string) =>
    ['admin', 'products', productId, 'variants'] as const,
};

// ── Get Product Variants ───────────────────────────────────────────────────────

export const useProductVariantsQuery = (productId: string | null) =>
  useQuery({
    queryKey: productVariantQueryKeys.variants(productId ?? ''),
    queryFn: () => getProductVariantsClientAPI(productId!),
    enabled: !!productId,
    staleTime: 1000 * 30,
  });

// ── Add Product Variant ────────────────────────────────────────────────────────

export const useAddProductVariantMutation = (productId: string) => {
  const queryClient = useQueryClient();
  const qKey = productVariantQueryKeys.variants(productId);

  return useMutation({
    mutationFn: (data: ICreateProductVariantPayload) =>
      addProductVariantClientAPI(productId, data),
    onSuccess: (res) => {
      if (!res || !('data' in res) || !res.data) return;
      const newVariant = res.data as IAdminProductVariant;
      // Append vào cache — không re-fetch
      queryClient.setQueryData(
        qKey,
        (old: { data: IAdminProductVariant[] } | undefined) => {
          if (!old) return old;
          return { ...old, data: [...(old.data ?? []), newVariant] };
        },
      );
      toast.success('Thêm biến thể thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Thêm biến thể thất bại.',
      );
    },
  });
};

// ── Update Product Variant ─────────────────────────────────────────────────────

export const useUpdateProductVariantMutation = (productId: string) => {
  const queryClient = useQueryClient();
  const qKey = productVariantQueryKeys.variants(productId);

  return useMutation({
    mutationFn: ({
      variantId,
      data,
    }: {
      variantId: string;
      data: IUpdateProductVariantPayload;
    }) => updateProductVariantClientAPI(productId, variantId, data),
    onSuccess: (res) => {
      if (!res || !('data' in res) || !res.data) return;
      const updated = res.data as IAdminProductVariant;
      // Thay thế biến thể trong cache — không re-fetch
      queryClient.setQueryData(
        qKey,
        (old: { data: IAdminProductVariant[] } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((v) => (v.id === updated.id ? updated : v)),
          };
        },
      );
      toast.success('Cập nhật biến thể thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Cập nhật biến thể thất bại.',
      );
    },
  });
};

// ── Delete Product Variant ─────────────────────────────────────────────────────

export const useDeleteProductVariantMutation = (productId: string) => {
  const queryClient = useQueryClient();
  const qKey = productVariantQueryKeys.variants(productId);

  return useMutation({
    mutationFn: (variantId: string) =>
      deleteProductVariantClientAPI(productId, variantId),
    onSuccess: (_, variantId) => {
      // Xóa khỏi cache — không re-fetch
      queryClient.setQueryData(
        qKey,
        (old: { data: IAdminProductVariant[] } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((v) => v.id !== variantId),
          };
        },
      );
      toast.success('Xóa biến thể thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Xóa biến thể thất bại.',
      );
    },
  });
};

// ── Query Keys for Variant Images ──────────────────────────────────────────────

export const variantImageQueryKeys = {
  images: (productId: string, variantId: string) =>
    ['admin', 'products', productId, 'variants', variantId, 'images'] as const,
};

// ── Get Variant Images (filter from product images) ───────────────────────────

export const useVariantImagesQuery = (
  productId: string | null,
  variantId: string | null,
) =>
  useQuery({
    queryKey: variantImageQueryKeys.images(productId ?? '', variantId ?? ''),
    queryFn: async () => {
      const res = await getProductImagesClientAPI(productId!);
      const data = res && 'data' in res ? res.data : [];
      return {
        ...(res as object),
        data: (data ?? []).filter((img) => img.variantId === variantId),
      };
    },
    enabled: !!productId && !!variantId,
    staleTime: 1000 * 30,
  });

// ── Upload Variant Image ──────────────────────────────────────────────────────

export const useUploadVariantImageMutation = (
  productId: string,
  variantId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => {
      formData.append('variantId', variantId);
      return uploadProductImageClientAPI(productId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: variantImageQueryKeys.images(productId, variantId),
      });
      queryClient.invalidateQueries({
        queryKey: productImageQueryKeys.images(productId),
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Upload ảnh biến thể thất bại.',
      );
    },
  });
};

// ── Delete Variant Image ──────────────────────────────────────────────────────

export const useDeleteVariantImageMutation = (
  productId: string,
  variantId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) =>
      deleteProductImageClientAPI(productId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: variantImageQueryKeys.images(productId, variantId),
      });
      queryClient.invalidateQueries({
        queryKey: productImageQueryKeys.images(productId),
      });
      queryClient.invalidateQueries({ queryKey: adminProductQueryKeys.all });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Xóa ảnh biến thể thất bại.',
      );
    },
  });
};

// ── Query Keys for Badges ──────────────────────────────────────────────────────

export const productBadgeQueryKeys = {
  badges: (productId: string) =>
    ['admin', 'products', productId, 'badges'] as const,
};

// ── Get Product Badges ─────────────────────────────────────────────────────────

export const useProductBadgesQuery = (productId: string | null) =>
  useQuery({
    queryKey: productBadgeQueryKeys.badges(productId ?? ''),
    queryFn: () => getProductBadgesClientAPI(productId!),
    enabled: !!productId,
    staleTime: 1000 * 60, // 60s - badges ít thay đổi
  });

// ── Add Product Badge ──────────────────────────────────────────────────────────

export const useAddProductBadgeMutation = (productId: string) => {
  const queryClient = useQueryClient();
  const qKey = productBadgeQueryKeys.badges(productId);

  return useMutation({
    mutationFn: (data: ICreateProductBadgePayload) =>
      addProductBadgeClientAPI(productId, data),
    onSuccess: (res) => {
      if (!res || !('data' in res) || !res.data) return;
      const newBadge = res.data as IAdminProductBadge;
      // Cập nhật cache trực tiếp — không re-fetch
      queryClient.setQueryData(
        qKey,
        (old: { data: IAdminProductBadge[] } | undefined) => {
          if (!old) return old;
          return { ...old, data: [...(old.data ?? []), newBadge] };
        },
      );
      toast.success('Thêm badge thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Thêm badge thất bại.',
      );
    },
  });
};

// ── Update Product Badge ───────────────────────────────────────────────────────

export const useUpdateProductBadgeMutation = (productId: string) => {
  const queryClient = useQueryClient();
  const qKey = productBadgeQueryKeys.badges(productId);

  return useMutation({
    mutationFn: ({
      badgeId,
      data,
    }: {
      badgeId: string;
      data: IUpdateProductBadgePayload;
    }) => updateProductBadgeClientAPI(productId, badgeId, data),
    onSuccess: (res) => {
      if (!res || !('data' in res) || !res.data) return;
      const updated = res.data as IAdminProductBadge;
      // Thay thế badge được cập nhật trong cache — không re-fetch
      queryClient.setQueryData(
        qKey,
        (old: { data: IAdminProductBadge[] } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((b) => (b.id === updated.id ? updated : b)),
          };
        },
      );
      toast.success('Cập nhật badge thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Cập nhật badge thất bại.',
      );
    },
  });
};

// ── Delete Product Badge ───────────────────────────────────────────────────────

export const useDeleteProductBadgeMutation = (productId: string) => {
  const queryClient = useQueryClient();
  const qKey = productBadgeQueryKeys.badges(productId);

  return useMutation({
    mutationFn: (badgeId: string) =>
      deleteProductBadgeClientAPI(productId, badgeId),
    onSuccess: (_, badgeId) => {
      // Xóa badge khỏi cache — không re-fetch
      queryClient.setQueryData(
        qKey,
        (old: { data: IAdminProductBadge[] } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((b) => b.id !== badgeId),
          };
        },
      );
      toast.success('Xóa badge thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Xóa badge thất bại.',
      );
    },
  });
};
