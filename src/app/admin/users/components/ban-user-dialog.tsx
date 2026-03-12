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
  const isBanning = !user?.isBanned;
  const fullName = `${user?.lastName ?? ''} ${user?.firstName ?? ''}`.trim();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isBanning ? 'Xác nhận cấm người dùng' : 'Xác nhận bỏ cấm người dùng'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBanning
              ? `Bạn có chắc chắn muốn cấm người dùng "${fullName}"? Người dùng sẽ không thể đăng nhập.`
              : `Bạn có chắc chắn muốn bỏ cấm người dùng "${fullName}"? Người dùng sẽ có thể đăng nhập trở lại.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              isBanning
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }
          >
            {isBanning ? 'Cấm' : 'Bỏ cấm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
