import Link from 'next/link';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { IAdminUserDataType, getUserRoles } from '@/lib/types/interfaces/apis/admin-user.interfaces';
import { getInitials, formatDate } from './helpers';
import UserAvatar from '@/components/user-avatar';

interface UserRowProps {
  user: IAdminUserDataType;
  isSelected: boolean;
  onToggleSelect: (userId: string) => void;
  onEdit: (user: IAdminUserDataType) => void;
  onDelete: (user: IAdminUserDataType) => void;
  onBan: (user: IAdminUserDataType) => void;
}

export function UserRow({ user, isSelected, onToggleSelect, onEdit, onDelete, onBan }: UserRowProps) {
  const roles = getUserRoles(user);
  return (
    <TableRow data-selected={isSelected} className={isSelected ? 'bg-muted/40' : ''}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(user.id)}
          aria-label={`Chọn ${user.firstName} ${user.lastName}`}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
         <UserAvatar fallbackName={getInitials(user.firstName, user.lastName)} avatarUrl={user.avatar || undefined}  />
          <div>
            <Link
              href={`/admin/users/${user.id}`}
              className="font-medium hover:underline"
            >
              {user.lastName} {user.firstName}
            </Link>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span>{user.email}</span>
          {user.isEmailVerified ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span>{user.phone}</span>
          {user.isPhoneVerified ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {roles.length > 0 ? (
            roles.map((role) => (
              <Badge key={role.id} variant="outline">
                {role.name}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">
              Chưa có vai trò
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-center">
        {user.isEmailVerified ? (
          <Badge className="bg-green-500!">Đã xác thực</Badge>
        ) : (
          <Badge variant="secondary">Chưa xác thực</Badge>
        )}
      </TableCell>
      <TableCell className="text-center">
        {user.isBanned ? (
          <Badge variant="destructive">Bị cấm</Badge>
        ) : user.isActive ? (
          <Badge className="border-b-pink-200">Hoạt động</Badge>
        ) : (
          <Badge variant="secondary">Không hoạt động</Badge>
        )}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(user.createdAt)}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${user.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {!user.isBanned ? (
              <DropdownMenuItem
                onClick={() => onBan(user)}
                className="text-orange-600"
              >
                <Ban className="mr-2 h-4 w-4" />
                Cấm người dùng
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => onBan(user)}
                className="text-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Bỏ cấm
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDelete(user)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
