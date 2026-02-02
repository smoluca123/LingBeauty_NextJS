import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

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
      {loading && <Loader2 className='size-5 animate-spin' />}
      {children}
    </Button>
  );
}
