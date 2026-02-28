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
  const isUnbanning = user?.isBanned === true;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isUnbanning ? 'Xác nhận bỏ cấm người dùng' : 'Xác nhận cấm người dùng'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isUnbanning
              ? `Bạn có chắc chắn muốn bỏ cấm người dùng "${user?.lastName} ${user?.firstName}"? Người dùng sẽ có thể đăng nhập trở lại.`
              : `Bạn có chắc chắn muốn cấm người dùng "${user?.lastName} ${user?.firstName}"? Người dùng sẽ không thể đăng nhập.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              isUnbanning
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }
          >
            {isUnbanning ? 'Bỏ cấm' : 'Cấm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
