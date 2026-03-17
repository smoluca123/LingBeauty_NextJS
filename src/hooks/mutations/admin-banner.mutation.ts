import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminBannerQueryKeys } from '@/hooks/querys/admin-banner.query';
import {
  createBannerGroupClientAPI,
  updateBannerGroupClientAPI,
  deleteBannerGroupClientAPI,
  createBannerClientAPI,
  createBannerWithUploadClientAPI,
  updateBannerClientAPI,
  updateBannerWithUploadClientAPI,
  deleteBannerClientAPI,
  addBannerToGroupClientAPI,
  removeBannerFromGroupClientAPI,
} from '@/lib/apis/client/admin-banner.apis';

// ── Create Banner Group ──────────────────────────────────────────────────────

export const useCreateBannerGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      slug: string;
      description?: string;
      isActive?: boolean;
      startDate?: string;
      endDate?: string;
    }) => createBannerGroupClientAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminBannerQueryKeys.bannerGroups,
      });
      toast.success('Tạo nhóm banner thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Tạo nhóm banner thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Update Banner Group ──────────────────────────────────────────────────────

export const useUpdateBannerGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        slug?: string;
        description?: string;
        isActive?: boolean;
        startDate?: string;
        endDate?: string;
      };
    }) => updateBannerGroupClientAPI(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminBannerQueryKeys.bannerGroups,
      });
      queryClient.invalidateQueries({
        queryKey: adminBannerQueryKeys.bannerGroup(variables.id),
      });
      toast.success('Cập nhật nhóm banner thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Cập nhật nhóm banner thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Delete Banner Group ──────────────────────────────────────────────────────

export const useDeleteBannerGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBannerGroupClientAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminBannerQueryKeys.bannerGroups,
      });
      toast.success('Xóa nhóm banner thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Xóa nhóm banner thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Create Banner (without image) ────────────────────────────────────────────

export const useCreateBannerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: {
        type: 'TEXT' | 'IMAGE';
        position: 'MAIN_CAROUSEL' | 'SIDE_TOP' | 'SIDE_BOTTOM';
        badge?: string;
        title?: string;
        description?: string;
        highlight?: string;
        ctaText?: string;
        ctaLink?: string;
        subLabel?: string;
        gradientFrom?: string;
        gradientTo?: string;
        sortOrder?: number;
        isActive?: boolean;
      };
    }) => createBannerClientAPI(groupId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminBannerQueryKeys.bannerGroups,
      });
      queryClient.invalidateQueries({
        queryKey: adminBannerQueryKeys.bannerGroup(variables.groupId),
      });
      toast.success('Tạo banner thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Tạo banner thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Create Banner with Upload ────────────────────────────────────────────────

export const useCreateBannerWithUploadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      formData,
    }: {
      groupId: string;
      formData: FormData;
    }) => createBannerWithUploadClientAPI(groupId, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminBannerQueryKeys.bannerGroups,
      });
      queryClient.invalidateQueries({
        queryKey: adminBannerQueryKeys.bannerGroup(variables.groupId),
      });
      toast.success('Tạo banner thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Tạo banner thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Update Banner (without image) ────────────────────────────────────────────

export const useUpdateBannerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bannerId,
      data,
    }: {
      bannerId: string;
      data: {
        type?: 'TEXT' | 'IMAGE';
        position?: 'MAIN_CAROUSEL' | 'SIDE_TOP' | 'SIDE_BOTTOM';
        badge?: string;
        title?: string;
        description?: string;
        highlight?: string;
        ctaText?: string;
        ctaLink?: string;
        subLabel?: string;
        gradientFrom?: string;
        gradientTo?: string;
        sortOrder?: number;
        isActive?: boolean;
      };
    }) => updateBannerClientAPI(bannerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminBannerQueryKeys.bannerGroups,
      });
      toast.success('Cập nhật banner thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Cập nhật banner thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Update Banner with Upload ────────────────────────────────────────────────

export const useUpdateBannerWithUploadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bannerId,
      formData,
    }: {
      bannerId: string;
      formData: FormData;
    }) => updateBannerWithUploadClientAPI(bannerId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminBannerQueryKeys.bannerGroups,
      });
      toast.success('Cập nhật banner thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Cập nhật banner thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Delete Banner ────────────────────────────────────────────────────────────

export const useDeleteBannerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bannerId: string) => deleteBannerClientAPI(bannerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminBannerQueryKeys.bannerGroups,
      });
      toast.success('Xóa banner thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Xóa banner thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Add Banner to Group ──────────────────────────────────────────────────────

export const useAddBannerToGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bannerId,
      groupId,
      sortOrder,
    }: {
      bannerId: string;
      groupId: string;
      sortOrder?: number;
    }) => addBannerToGroupClientAPI(bannerId, { groupId, sortOrder }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminBannerQueryKeys.bannerGroups,
      });
      queryClient.invalidateQueries({
        queryKey: adminBannerQueryKeys.bannerGroupsOfBanner(variables.bannerId),
      });
      toast.success('Thêm banner vào nhóm thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Thêm banner vào nhóm thất bại. Vui lòng thử lại.',
      );
    },
  });
};

// ── Remove Banner from Group ─────────────────────────────────────────────────

export const useRemoveBannerFromGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bannerId,
      groupId,
    }: {
      bannerId: string;
      groupId: string;
    }) => removeBannerFromGroupClientAPI(bannerId, groupId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminBannerQueryKeys.bannerGroups,
      });
      queryClient.invalidateQueries({
        queryKey: adminBannerQueryKeys.bannerGroupsOfBanner(variables.bannerId),
      });
      toast.success('Xóa banner khỏi nhóm thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Xóa banner khỏi nhóm thất bại. Vui lòng thử lại.',
      );
    },
  });
};
