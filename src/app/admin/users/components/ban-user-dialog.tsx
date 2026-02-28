import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { IAdminUserDataType } from '@/lib/types/interfaces/apis/admin-user.interfaces';

interface BanUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IAdminUserDataType | null;
  onConfirm: () => void;
}

export function BanUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
}: BanUserDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận cấm người dùng</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn cấm người dùng &#34;{user?.lastName}{' '}
            {user?.firstName}&#34;? Người dùng sẽ không thể đăng nhập.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            Cấm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
