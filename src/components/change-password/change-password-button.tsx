import { ChangePasswordDialog } from '@/components/change-password/change-password-dialog';
import { Button } from '@/components/ui/button';
import { ButtonProps } from '@/lib/types/interfaces/utils.interfaces';
import { cn } from '@/lib/utils';
import { KeyRound } from 'lucide-react';
import { useState } from 'react';

export default function ChangePasswordButton(props: ButtonProps) {
  const { onClick } = props;
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={cn('', props.className)}
        {...props}
        onClick={(e) => {
          onClick?.(e);
          setIsChangePasswordDialogOpen(true);
        }}
      >
        <KeyRound className="h-4 w-4" />
        Đổi mật khẩu
      </Button>
      <ChangePasswordDialog
        open={isChangePasswordDialogOpen}
        onOpenChange={setIsChangePasswordDialogOpen}
      />
    </>
  );
}
