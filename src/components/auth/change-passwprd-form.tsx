'use no memo';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LoadingButton from '@/components/ui/loading-button';
import { useChangePasswordMutation } from '@/hooks/mutations/auth.mutation';
import { changePasswordSchema } from '@/lib/schemas';
import type { ChangePasswordFormValues } from '@/lib/types/forms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface IProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export function ChangePasswordForm({ onSuccess, onClose }: IProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate, isPending } = useChangePasswordMutation();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit(onSubmit)(e);
        }}
        className="space-y-4"
      >
        {/* Current Password */}
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mật khẩu hiện tại <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="h-11 rounded-lg border-input pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* New Password */}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mật khẩu mới <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu mới"
                    className="h-11 rounded-lg border-input pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm New Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Xác nhận mật khẩu mới{' '}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu mới"
                    className="h-11 rounded-lg border-input pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="rounded-full"
          >
            Hủy
          </Button>
          <LoadingButton
            type="submit"
            loading={isPending}
            variant="primary-pink"
            className="rounded-full"
          >
            Đổi mật khẩu
          </LoadingButton>
        </DialogFooter>
      </form>
    </Form>
  );
}
