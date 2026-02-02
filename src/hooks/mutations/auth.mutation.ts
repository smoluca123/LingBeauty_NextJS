import { changePasswordAPI } from '@/lib/apis/client/auth-apis';
import { IChangePasswordData } from '@/lib/types/interfaces/apis/auth.interfaces';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useChangePasswordMutation = () => {
  const changePassword = async (data: IChangePasswordData) => {
    try {
      const response = await changePasswordAPI(data);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      toast.success(data.message || 'Change password successfully');
    },
    onError: (error) => {
      // Handle specific error codes
      toast.error((error as unknown as string) || 'Change password failed');
    },
  });

  return mutation;
};
