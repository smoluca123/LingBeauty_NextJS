'use client';

import { MoreHorizontal, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AddressActionsMenuProps {
  addressId: string;
  isDefault: boolean;
  onEdit: (id: string) => void;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Dropdown menu for address actions (set default, edit, delete)
 * Pure presentational component that delegates actions to parent
 */
export function AddressActionsMenu({
  addressId,
  isDefault,
  onEdit,
  onSetDefault,
  onDelete,
}: AddressActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!isDefault && (
          <DropdownMenuItem onClick={() => onSetDefault(addressId)}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Đặt làm mặc định
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onEdit(addressId)}>
          <Pencil className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(addressId)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
