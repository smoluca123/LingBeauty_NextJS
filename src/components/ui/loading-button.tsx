import { Button } from '@/components/ui/button';
import { ButtonProps } from '@/lib/types/interfaces/utils.interfaces';
import { cn } from '@/lib/utils/utils';
import { Loader2 } from 'lucide-react';

interface ILoadingButtonProps extends ButtonProps {
  loading: boolean;
}

export default function LoadingButton({
  loading,
  disabled,
  children,
  className,
  ...props
}: ILoadingButtonProps) {
  return (
    <Button
      disabled={loading || disabled}
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      {loading && <Loader2 className="size-5 animate-spin" />}
      {children}
    </Button>
  );
}
