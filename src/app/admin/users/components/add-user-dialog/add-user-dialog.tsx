'use client';

import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { BasicInfoTab } from '../edit-user-dialog/basic-info-tab';
import { RolesTab } from '../edit-user-dialog/roles-tab';
import { SettingsTab } from './settings-tab';
import { UserFormData } from '../edit-user-dialog/edit-user-dialog';

// ============ Types ============
interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: UserFormData) => void;
  availableRoles?: import('@/lib/types/interfaces/apis/admin-user.interfaces').IAdminRoleDataType[];
}

// ============ Component ============
export function AddUserDialog({
  open,
  onOpenChange,
  onAdd,
  availableRoles = [],
}: AddUserDialogProps) {
  const form = useForm<UserFormData>({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      username: '',
      password: '',
      confirmPassword: '',
      roleIds: [],
      isActive: true,
      isVerified: false,
      isBanned: false,
      isEmailVerified: false,
      isPhoneVerified: false,
    },
  });

  const handleSubmit = (data: UserFormData) => {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: 'Mật khẩu xác nhận không khớp',
      });
      return;
    }

    onAdd(data);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Thêm người dùng mới</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleOpenChange(false)}
              className="h-6 w-6 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Tạo tài khoản người dùng mới trong hệ thống
          </p>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <Tabs
              defaultValue="basic"
              className="flex-1 overflow-hidden flex flex-col"
            >
              <TabsList className="w-full justify-start">
                <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                <TabsTrigger value="roles">Vai trò</TabsTrigger>
                <TabsTrigger value="settings">Cài đặt</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto mt-4">
                {/* Tab: Basic Info */}
                <TabsContent value="basic" className="mt-0">
                  <BasicInfoTab form={form} isCreatingNew={true} />
                </TabsContent>

                {/* Tab: Roles */}
                <TabsContent value="roles" className="mt-0">
                  <RolesTab form={form} availableRoles={availableRoles} />
                </TabsContent>

                {/* Tab: Settings */}
                <TabsContent value="settings" className="mt-0">
                  <SettingsTab form={form} />
                </TabsContent>
              </div>
            </Tabs>

            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" variant="primary-pink">
                Tạo người dùng
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
