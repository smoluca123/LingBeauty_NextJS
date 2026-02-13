import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { mockAdminRoles } from '@/lib/mock-data/admin';
import { UserFormData } from './edit-user-dialog';

// ============ Types ============
interface RolesTabProps {
  form: UseFormReturn<UserFormData>;
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
            {/* Header Section */}
            <div>
              <FormLabel className="text-base">Chọn vai trò cho người dùng</FormLabel>
              <p className="text-sm text-muted-foreground mt-1">
                Người dùng có thể có nhiều vai trò khác nhau
              </p>
            </div>

            {/* Roles List */}
            <div className="space-y-3">
              {mockAdminRoles.map((role) => {
                const isSelected = field.value.some((r) => r.id === role.id);
                
                return (
                  <div
                    key={role.id}
                    className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, role]);
                        } else {
                          field.onChange(field.value.filter((r) => r.id !== role.id));
                        }
                      }}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 space-y-1">
                      <label
                        htmlFor={`role-${role.id}`}
                        className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {role.name}
                        {role.isSystem && (
                          <Badge variant="outline" className="text-xs">
                            Hệ thống
                          </Badge>
                        )}
                      </label>
                      
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                      
                      {/* Permissions Preview */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {role.permissions.slice(0, 5).map((permission) => (
                          <Badge
                            key={permission.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {permission.name.split('.')[1]}
                          </Badge>
                        ))}
                        {role.permissions.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{role.permissions.length - 5}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Roles Summary */}
            {field.value.length > 0 && (
              <div className="rounded-lg border border-primary-pink/20 bg-primary-pink/5 p-4">
                <p className="text-sm font-medium text-primary-pink">
                  Đã chọn {field.value.length} vai trò
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((role) => (
                    <Badge key={role.id} variant="primary-pink">
                      {role.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FormItem>
      )}
    />
  );
}
