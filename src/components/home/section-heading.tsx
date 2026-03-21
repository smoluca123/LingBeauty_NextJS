import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/utils';

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
  action?: ReactNode;
};

export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  className,
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-start justify-between gap-4',
        className,
      )}
    >
      <div>
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-pink">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function SectionHeadingCenter({
  title,
  subtitle,
  eyebrow,
  className,
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        // 'flex flex-wrap items-center justify-between gap-4',
        className,
      )}
    >
      <div className="mx-auto">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-pink">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
