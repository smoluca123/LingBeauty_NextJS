import { updateMyInformationAPI } from '@/lib/apis/server/user-apis';
import { UpdateUserInfomationValues } from '@/lib/zod-schemas/user-schema';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';

export const useUpdateUserInfomationMutation = () => {
  const { setUser } = useAuthStore();
  const updateUserInfomation = async (data: UpdateUserInfomationValues) => {
    try {
      const response = await updateMyInformationAPI(data);
      return response;
    } catch (error) {
      throw new Error(error as string);
    }
  };
  const mutation = useMutation({
    mutationFn: updateUserInfomation,
    onSuccess: (data) => {
      // remove accessToken from data
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { accessToken, ...restUserData } = data.data;
      setUser(restUserData);
      toast.success('Cập nhật thông tin thành công');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
