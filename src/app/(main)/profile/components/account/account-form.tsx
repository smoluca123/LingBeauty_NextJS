'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces';
import { useUpdateUserInfomationMutation } from '@/hooks/mutations/user.mutation';
import LoadingButton from '@/components/ui/loading-button';
import { ChangePasswordDialog } from './change-password-dialog';
import { KeyRound } from 'lucide-react';

// ============ Schema ============
const accountFormSchema = z.object({
  firstName: z.string().min(1, 'Vui lòng nhập tên'),
  lastName: z.string().min(1, 'Vui lòng nhập họ'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(1, 'Vui lòng nhập số điện thoại'),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

// ============ Component ============
export function AccountForm({ user }: { user: IUserDataType }) {
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);

  const { mutate, isPending: isPendingUpdateUserInfomation } =
    useUpdateUserInfomationMutation();
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
    },
    mode: 'onTouched',
  });

  const onSubmit = (data: AccountFormValues) => {
    // TODO: Replace with actual API call when available
    console.log('📝 Profile update form data:', data);
    console.log('---');
    console.log('First Name:', data.firstName);
    console.log('Last Name:', data.lastName);
    console.log('Email:', data.email);
    console.log('Phone:', data.phone);
    console.log('---');
    mutate(data);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên"
                      className="h-11 rounded-lg border-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Họ <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập họ"
                      className="h-11 rounded-lg border-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      className="h-11 rounded-lg bg-muted border-input"
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Số điện thoại <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+ 84xxxxxxxxx"
                      className="h-11 rounded-lg border-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="min-w-30 rounded-full gap-2"
              onClick={() => setIsChangePasswordDialogOpen(true)}
            >
              <KeyRound className="h-4 w-4" />
              Đổi mật khẩu
            </Button>
            <LoadingButton
              type="submit"
              className="min-w-30 rounded-full"
              loading={isPendingUpdateUserInfomation}
              variant={'primary-pink'}
            >
              Lưu
            </LoadingButton>
          </div>
        </form>
      </Form>

      <ChangePasswordDialog
        open={isChangePasswordDialogOpen}
        onOpenChange={setIsChangePasswordDialogOpen}
      />
    </>
  );
}
