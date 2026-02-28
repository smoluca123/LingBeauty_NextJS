'use client';

import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { ICreateUserAdminPayload } from '@/lib/apis/client/actions/admin-user.actions';
import { useAdminUserRoles } from '../hooks';

// ============ Types ============
interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: ICreateUserAdminPayload) => void;
  isPending?: boolean;
}

type AddUserFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
  roleId: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
};

// ============ Component ============
export function AddUserDialog({
  open,
  onOpenChange,
  onAdd,
  isPending = false,
}: AddUserDialogProps) {
  const { data: rolesResponse, isLoading: isRolesLoading } = useAdminUserRoles();
  const roles = rolesResponse?.data ?? [];

  const form = useForm<AddUserFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      username: '',
      roleId: '',
      isActive: true,
      isEmailVerified: false,
      isPhoneVerified: false,
    },
  });

  const handleSubmit = (data: AddUserFormData) => {
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: 'Mật khẩu xác nhận không khớp',
      });
      return;
    }

    const payload: ICreateUserAdminPayload = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      username: data.username,
      roleId: data.roleId || undefined,
      isActive: data.isActive,
      isEmailVerified: data.isEmailVerified,
      isPhoneVerified: data.isPhoneVerified,
    };

    onAdd(payload);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) form.reset();
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Tạo tài khoản người dùng mới trong hệ thống
          </p>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex-1 overflow-hidden flex flex-col gap-4"
          >
            <Tabs defaultValue="basic" className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                <TabsTrigger value="settings">Cài đặt</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto mt-4">
                {/* === Basic Info Tab === */}
                <TabsContent value="basic" className="mt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="lastName"
                      rules={{ required: 'Vui lòng nhập họ' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nguyễn" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="firstName"
                      rules={{ required: 'Vui lòng nhập tên' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên *</FormLabel>
                          <FormControl>
                            <Input placeholder="Văn A" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    rules={{
                      required: 'Vui lòng nhập email',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email không hợp lệ' },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="user@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="username"
                    rules={{
                      required: 'Vui lòng nhập username',
                      minLength: { value: 3, message: 'Tối thiểu 3 ký tự' },
                      pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Chỉ chứa chữ, số và gạch dưới' },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username *</FormLabel>
                        <FormControl>
                          <Input placeholder="username123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    rules={{ required: 'Vui lòng nhập số điện thoại' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại *</FormLabel>
                        <FormControl>
                          <Input placeholder="+84901234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    rules={{
                      required: 'Vui lòng nhập mật khẩu',
                      minLength: { value: 6, message: 'Tối thiểu 6 ký tự' },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu *</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    rules={{ required: 'Vui lòng xác nhận mật khẩu' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xác nhận mật khẩu *</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* === Settings Tab === */}
                <TabsContent value="settings" className="mt-0 space-y-4">
                  {/* Role selector */}
                  <FormField
                    control={form.control}
                    name="roleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vai trò</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isRolesLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={isRolesLoading ? 'Đang tải...' : 'Chọn vai trò (mặc định: USER)'} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* isActive */}
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <FormLabel className="text-base">Kích hoạt tài khoản</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Cho phép người dùng đăng nhập ngay
                          </p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
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
                          <FormLabel className="text-base">Email đã xác thực</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Bỏ qua bước xác thực email
                          </p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
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
                          <FormLabel className="text-base">SĐT đã xác thực</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Bỏ qua bước xác thực số điện thoại
                          </p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </div>
            </Tabs>

            <div className="flex justify-end gap-2 border-t pt-4 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button type="submit" variant="primary-pink" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Tạo người dùng
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
