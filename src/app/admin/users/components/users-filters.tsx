import { ArrowUpDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  IAdminRoleDataType,
  UserSortBy,
  UserSortOrder,
} from '@/lib/types/interfaces/apis/admin-user.interfaces';

// ============ Types ============

type StatusFilterValue = 'all' | 'active' | 'inactive' | 'banned';
type VerifiedFilterValue = 'all' | 'verified' | 'unverified';

interface UsersFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilterValue;
  onStatusChange: (value: StatusFilterValue) => void;
  verifiedFilter: VerifiedFilterValue;
  onVerifiedChange: (value: VerifiedFilterValue) => void;
  sortBy: UserSortBy;
  onSortByChange: (value: UserSortBy) => void;
  order: UserSortOrder;
  onOrderChange: (value: UserSortOrder) => void;
  roles: IAdminRoleDataType[];
}

// ============ Component ============

export function UsersFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  verifiedFilter,
  onVerifiedChange,
  sortBy,
  onSortByChange,
  order,
  onOrderChange,
}: UsersFiltersProps) {
  const toggleOrder = () => onOrderChange(order === 'asc' ? 'desc' : 'asc');

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: Search + Sort controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Tìm theo tên, email, username…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
            aria-label="Tìm kiếm người dùng"
          />
        </div>

        {/* Sort By */}
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Ngày tạo</SelectItem>
            <SelectItem value="updatedAt">Ngày cập nhật</SelectItem>
            <SelectItem value="firstName">Tên</SelectItem>
            <SelectItem value="lastName">Họ</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>

        {/* Order toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleOrder}
          title={order === 'asc' ? 'Tăng dần' : 'Giảm dần'}
          aria-label="Đổi chiều sắp xếp"
        >
          <ArrowUpDown
            className={`h-4 w-4 transition-transform ${order === 'desc' ? 'rotate-180' : ''}`}
          />
        </Button>
      </div>

      {/* Row 2: Status + Verified filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Status */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="inactive">Không hoạt động</SelectItem>
            <SelectItem value="banned">Bị cấm</SelectItem>
          </SelectContent>
        </Select>

        {/* Verified */}
        <Select value={verifiedFilter} onValueChange={onVerifiedChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Xác thực email" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả xác thực</SelectItem>
            <SelectItem value="verified">Đã xác thực email</SelectItem>
            <SelectItem value="unverified">Chưa xác thực email</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
