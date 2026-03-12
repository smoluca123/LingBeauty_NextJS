'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { UserFormData } from '../edit-user-dialog/edit-user-dialog';

// ============ Types ============
interface SettingsTabProps {
  form: UseFormReturn<UserFormData>;
}

// ============ Component ============
export function SettingsTab({ form }: SettingsTabProps) {
  return (
    <div className="space-y-4 p-1">
      {/* isActive */}
      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <FormLabel className="text-sm font-medium">
                Kích hoạt tài khoản
              </FormLabel>
              <p className="text-sm text-muted-foreground">
                Cho phép người dùng đăng nhập ngay sau khi tạo
              </p>
            </div>
            <Switch
              checked={field.value ?? true}
              onCheckedChange={field.onChange}
            />
          </FormItem>
        )}
      />

      {/* isEmailVerified */}
      <FormField
        control={form.control}
        name="isEmailVerified"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <FormLabel className="text-sm font-medium">
                Xác thực email trước
              </FormLabel>
              <p className="text-sm text-muted-foreground">
                Bỏ qua bước xác thực email — người dùng không cần click link
                xác nhận
              </p>
            </div>
            <Switch
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
            />
          </FormItem>
        )}
      />

      {/* isPhoneVerified */}
      <FormField
        control={form.control}
        name="isPhoneVerified"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <FormLabel className="text-sm font-medium">
                Xác thực số điện thoại trước
              </FormLabel>
              <p className="text-sm text-muted-foreground">
                Bỏ qua bước xác thực SĐT — đánh dấu SĐT đã xác thực
              </p>
            </div>
            <Switch
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
            />
          </FormItem>
        )}
      />
    </div>
  );
}
