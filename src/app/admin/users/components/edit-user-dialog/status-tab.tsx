import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { UserFormData } from './edit-user-dialog';

// ============ Types ============
interface StatusTabProps {
  form: UseFormReturn<UserFormData>;
}

// ============ Component ============
export function StatusTab({ form }: StatusTabProps) {
  const watchedValues = form.watch();

  return (
    <div className="space-y-6">
      {/* Active Status */}
      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex items-start justify-between space-x-4 rounded-lg border p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
              <div className="space-y-1">
                <FormLabel className="text-base font-medium">
                  Kích hoạt tài khoản
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Cho phép người dùng đăng nhập và sử dụng hệ thống
                </p>
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Verified Status */}
      <FormField
        control={form.control}
        name="isVerified"
        render={({ field }) => (
          <FormItem className="flex items-start justify-between space-x-4 rounded-lg border p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="space-y-1">
                <FormLabel className="text-base font-medium">
                  Xác thực tài khoản
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Đánh dấu tài khoản đã được xác thực
                </p>
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Banned Status */}
      <FormField
        control={form.control}
        name="isBanned"
        render={({ field }) => (
          <FormItem className="flex items-start justify-between space-x-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start space-x-3">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="space-y-1">
                <FormLabel className="text-base font-medium text-red-900">
                  Cấm tài khoản
                </FormLabel>
                <p className="text-sm text-red-700">
                  Tài khoản bị cấm sẽ không thể đăng nhập. Hãy cẩn thận khi sử dụng tính năng này.
                </p>
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Status Summary */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <h4 className="text-sm font-medium mb-3">Tóm tắt trạng thái</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Trạng thái tài khoản:</span>
            <span className={watchedValues.isActive ? 'text-emerald-600 font-medium' : 'text-muted-foreground'}>
              {watchedValues.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Xác thực:</span>
            <span className={watchedValues.isVerified ? 'text-blue-600 font-medium' : 'text-muted-foreground'}>
              {watchedValues.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Bị cấm:</span>
            <span className={watchedValues.isBanned ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
              {watchedValues.isBanned ? 'Có' : 'Không'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
