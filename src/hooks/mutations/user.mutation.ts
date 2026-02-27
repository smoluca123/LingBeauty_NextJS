'use client';

import { UpdateUserInfomationValues } from '@/lib/zod-schemas/user-schema';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';
import {
  updateMyInformationAPI,
  uploadAvatarAPI,
} from '@/lib/apis/client/user-apis';

// ============ Helper ============
// Extracts a displayable message string from any thrown value.
function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message || fallback;
  if (typeof error === 'string') return error || fallback;
  return fallback;
}

// ============ Update User Information Mutation ============
export const useUpdateUserInfomationMutation = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: UpdateUserInfomationValues) =>
      updateMyInformationAPI(data),
    onSuccess: (data) => {
      setUser(data.data);
      toast.success(data.message || 'Cập nhật thông tin thành công');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Cập nhật thông tin thất bại'));
    },
  });
};

// ============ Upload Avatar Mutation ============
export const useUploadAvatarMutation = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (avatarFile: File) => uploadAvatarAPI({ avatar: avatarFile }),
    onSuccess: (data) => {
      setUser(data.data);
      toast.success('Cập nhật ảnh đại diện thành công');
    },
    onError: (error) => {
      console.log(error);
      toast.error(getErrorMessage(error, 'Cập nhật ảnh đại diện thất bại'));
    },
  });
};
