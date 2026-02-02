import { buttonVariants } from '@/components/ui/button';
import { VariantProps } from 'class-variance-authority';

export interface IPropsWithClassName {
  className?: string;
}

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };
