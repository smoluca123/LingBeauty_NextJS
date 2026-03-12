import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IAdminUserDataType } from '@/lib/types/interfaces/apis/admin-user.interfaces';
import { UserRow } from './user-row';

// ============ Skeleton ============

function UserRowSkeleton() {
  return (
    <TableRow>
      {Array.from({ length: 9 }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  );
}

// ============ Types ============

interface UsersTableProps {
  users: IAdminUserDataType[];
  isLoading?: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (userId: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (user: IAdminUserDataType) => void;
  onDelete: (user: IAdminUserDataType) => void;
  onBan: (user: IAdminUserDataType) => void;
}

// ============ Component ============

export function UsersTable({
  users,
  isLoading = false,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  onBan,
}: UsersTableProps) {
  const allSelected = users.length > 0 && users.every((u) => selectedIds.has(u.id));
  const someSelected = users.some((u) => selectedIds.has(u.id));

  return (
    <div className="rounded-lg border bg-card max-h-full overflow-auto">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                data-state={someSelected && !allSelected ? 'indeterminate' : undefined}
                onCheckedChange={onToggleSelectAll}
                aria-label="Chọn tất cả"
              />
            </TableHead>
            <TableHead>Người dùng</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead className="text-center">Xác thực</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="w-12.5"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <UserRowSkeleton key={i} />
            ))
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                Không tìm thấy người dùng nào.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                isSelected={selectedIds.has(user.id)}
                onToggleSelect={onToggleSelect}
                onEdit={onEdit}
                onDelete={onDelete}
                onBan={onBan}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
