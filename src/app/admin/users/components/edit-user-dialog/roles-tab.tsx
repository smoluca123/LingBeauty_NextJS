import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { UserFormData } from './edit-user-dialog';

// ============ Types ============
interface RolesTabProps {
  form: UseFormReturn<UserFormData>;
  roles?: never; // No longer used — roles come from user.roleAssignments
}

// ============ Component ============
export function RolesTab({ form }: RolesTabProps) {
  return (
    <FormField
      control={form.control}
      name="roles"
      render={({ field }) => (
        <FormItem>
          <div className="space-y-4">
            {/* Header */}
            <div>
              <FormLabel className="text-base">Vai trò hiện tại</FormLabel>
              <p className="text-sm text-muted-foreground mt-1">
                Các vai trò đang được gán cho người dùng này
              </p>
            </div>

            {/* Role Assignments */}
            <div className="space-y-2">
              {field.value.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6 rounded-lg border">
                  Người dùng chưa có vai trò nào
                </p>
              ) : (
                field.value.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="text-sm font-medium">{assignment.role.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Gán lúc: {new Date(assignment.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <Badge variant="outline">{assignment.role.name}</Badge>
                  </div>
                ))
              )}
            </div>

            {/* Info note */}
            <p className="text-xs text-muted-foreground">
              Để thay đổi vai trò, vui lòng liên hệ quản trị viên hệ thống.
            </p>
          </div>
        </FormItem>
      )}
    />
  );
}
