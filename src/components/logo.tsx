import Link from 'next/link';
import { IPropsWithClassName } from '@/lib/types/interfaces/utils.interfaces';
import { cn } from '@/lib/utils/utils';

interface ILogoProps extends IPropsWithClassName {
  classNames?: {
    container?: string;
    link?: string;
    uploadIcon?: string;
    text?: string;
  };
}

export function Logo({ className, classNames }: ILogoProps) {
  return (
    <div className={cn('text-center', className, classNames?.container)}>
      <Link
        href="/"
        className={cn('inline-flex items-center space-x-2', classNames?.link)}
      >
        {/* <div
          className={cn(
            'h-10 w-10 rounded-2xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center',
            classNames?.uploadIcon
          )}
        >
          <Upload className="h-5 w-5 text-white" />
        </div> */}
        <span
          className={cn(
            'text-2xl font-bold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent',
            classNames?.text,
          )}
        >
          Ling <span className="text-primary-pink">Beauty</span>
        </span>
      </Link>
    </div>
  );
}
