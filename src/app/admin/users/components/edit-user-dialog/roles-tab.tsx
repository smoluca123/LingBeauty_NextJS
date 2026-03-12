'use client';

import { useWatch } from 'react-hook-form';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { IAdminRoleDataType } from '@/lib/types/interfaces/apis/admin-user.interfaces';
import { UserFormData } from './edit-user-dialog';

// ============ Types ============
interface RolesTabProps {
  form: UseFormReturn<UserFormData>;
  availableRoles: IAdminRoleDataType[];
}

// ============ Component ============
export function RolesTab({ form, availableRoles }: RolesTabProps) {
  const selectedRoleIds = useWatch({
    control: form.control,
    name: 'roleIds',
  }) ?? [];

  return (
    <FormField
      control={form.control}
      name="roleIds"
      render={({ field }) => {
        return (
          <FormItem>
            <div className="space-y-4">
              {/* Header */}
              <div>
                <FormLabel className="text-base">
                  Chọn vai trò cho người dùng
                </FormLabel>
                <p className="text-sm text-muted-foreground mt-1">
                  Người dùng có thể có nhiều vai trò khác nhau
                </p>
              </div>

              {/* Roles List */}
              <div className="space-y-3">
                {availableRoles.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Không có vai trò nào.
                  </p>
                ) : (
                  availableRoles.map((role) => {
                    const isSelected = selectedRoleIds.includes(role.id);
                    const perms = role.permissions ?? [];

                    return (
                      <div
                        key={role.id}
                        className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                      >
                        <Checkbox
                          id={`role-${role.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            const next = checked
                              ? [...selectedRoleIds, role.id]
                              : selectedRoleIds.filter((id) => id !== role.id);
                            field.onChange(next);
                          }}
                          className="mt-1"
                        />

                        <div className="flex-1 space-y-1">
                          <label
                            htmlFor={`role-${role.id}`}
                            className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer"
                          >
                            {role.name}
                            {role.isSystem && (
                              <Badge variant="outline" className="text-xs">
                                Hệ thống
                              </Badge>
                            )}
                          </label>

                          {role.description && (
                            <p className="text-sm text-muted-foreground">
                              {role.description}
                            </p>
                          )}

                          {perms.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {perms.slice(0, 5).map((perm) => (
                                <Badge
                                  key={perm.id}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {perm.name.split('.')[1] ?? perm.name}
                                </Badge>
                              ))}
                              {perms.length > 5 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{perms.length - 5}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Selected Roles Summary */}
              {selectedRoleIds.length > 0 && (
                <div className="rounded-lg border border-primary-pink/20 bg-primary-pink/5 p-4">
                  <p className="text-sm font-medium text-primary-pink">
                    Đã chọn {selectedRoleIds.length} vai trò
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedRoleIds.map((roleId) => {
                      const role = availableRoles.find((r) => r.id === roleId);
                      return (
                        <Badge key={roleId} variant="primary-pink">
                          {role?.name ?? roleId}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </FormItem>
        );
      }}
    />
  );
}
