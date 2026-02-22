import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import {
  loginApi,
  registerApi,
  logoutApi,
  changePasswordAPI,
} from '@/lib/apis/client/auth-apis';
import type {
  IChangePasswordData,
  ILoginCredentials,
  IRegisterData,
} from '@/lib/types/interfaces/apis/auth.interfaces';
import { toast } from 'sonner';

// ============ Auth Query Keys ============
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

// ============ Login Mutation ============
export const useLoginMutation = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: (credentials: ILoginCredentials) => loginApi(credentials),
    onSuccess: (userData) => {
      setUser(userData);
      toast.success('Đăng nhập thành công');
    },
    onError: () => {
      clearAuth();
    },
  });
};

// ============ Register Mutation ============
export const useRegisterMutation = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: (data: IRegisterData) => registerApi(data),
    onSuccess: (userData) => {
      setUser(userData);
      toast.success('Đăng ký thành công');
    },
    onError: () => {
      clearAuth();
    },
  });
};

// ============ Logout Mutation ============
export const useLogoutMutation = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutApi(),
    onSettled: () => {
      // Always clear auth state regardless of success/failure
      clearAuth();
      // Invalidate all queries to refetch after logout
      queryClient.clear();
    },
  });
};

// ============ Change Password Mutation ============
export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (data: IChangePasswordData) => changePasswordAPI(data),
    onSuccess: (data) => {
      toast.success(data.message || 'Đổi mật khẩu thành công');
    },
    onError: (error) => {
      toast.error((error as unknown as string) || 'Đổi mật khẩu thất bại');
    },
  });
};
