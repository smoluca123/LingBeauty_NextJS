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

interface UsersTableProps {
  users: IAdminUserDataType[];
  onEdit: (user: IAdminUserDataType) => void;
  onDelete: (user: IAdminUserDataType) => void;
  onBan: (user: IAdminUserDataType) => void;
}

export function UsersTable({ users, onEdit, onDelete, onBan }: UsersTableProps) {
  return (
    <div className="rounded-lg border bg-card max-h-[50vh] overflow-auto">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
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
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Không tìm thấy người dùng nào.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
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
