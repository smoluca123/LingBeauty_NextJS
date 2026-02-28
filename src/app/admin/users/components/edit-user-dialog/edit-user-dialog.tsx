'use client';

import { useEffect } from 'react';
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
import { IAdminUserDataType } from '@/lib/types/interfaces/apis/admin-user.interfaces';
import { IUserRoleAssignmentDataType } from '@/lib/types/interfaces/apis/user.interfaces';
import { BasicInfoTab } from './basic-info-tab';
import { RolesTab } from './roles-tab';
import { StatusTab } from './status-tab';

// ============ Types ============
interface EditUserDialogProps {
  user: IAdminUserDataType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: UserFormData) => void;
}

export interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
  roles: IUserRoleAssignmentDataType[];
  isActive: boolean;
  isVerified: boolean;
  isBanned: boolean;
  // Optional fields for creating new users
  password?: string;
  confirmPassword?: string;
}

// ============ Component ============
export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSave,
}: EditUserDialogProps) {
  const form = useForm<UserFormData>({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      username: '',
      roles: [],
      isActive: true,
      isVerified: false,
      isBanned: false,
    },
  });

  // Reset form when user changes
  useEffect(() => {
    if (user && open) {
      form.reset({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        username: user.username,
        roles: user.roleAssignments ?? [],
        isActive: user.isActive,
        isVerified: user.isVerified,
        isBanned: user.isBanned,
      });
    }
  }, [user, open, form]);

  const handleSubmit = (data: UserFormData) => {
    console.log('📝 Form Data:', data);
    console.log('👤 User ID:', user?.id);
    console.log('📧 Email:', data.email);
    console.log('👥 Roles:', data.roles.map(r => r.role.name));
    console.log('✅ Status:', {
      isActive: data.isActive,
      isVerified: data.isVerified,
      isBanned: data.isBanned,
    });
    
    onSave(data);
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
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
            {user.lastName} {user.firstName} (@{user.username})
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-1 overflow-hidden flex flex-col">
            <Tabs defaultValue="basic" className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                <TabsTrigger value="roles">Vai trò</TabsTrigger>
                <TabsTrigger value="status">Trạng thái</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto mt-4">
                <TabsContent value="basic" className="mt-0">
                  <BasicInfoTab form={form} />
                </TabsContent>

                <TabsContent value="roles" className="mt-0">
                  <RolesTab form={form} />
                </TabsContent>

                <TabsContent value="status" className="mt-0">
                  <StatusTab form={form} />
                </TabsContent>
              </div>
            </Tabs>

            <div className="flex justify-end gap-2 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" variant="primary-pink">
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
