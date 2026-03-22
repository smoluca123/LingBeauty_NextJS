'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  count?: number;
}

export function CustomCheckbox({
  checked,
  onChange,
  label,
  count,
}: CustomCheckboxProps) {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      className="flex cursor-pointer items-center gap-3 group py-1.5 px-2 -mx-2 rounded-lg hover:bg-white/60 transition-colors"
    >
      <div
        className={cn(
          'flex h-[18px] w-[18px] items-center justify-center rounded-md border-2 transition-all duration-200 shadow-sm shrink-0',
          checked
            ? 'border-primary-pink bg-primary-pink'
            : 'border-gray-300 bg-white group-hover:border-primary-pink/50',
        )}
      >
        {checked && <Check className="h-3 w-3 text-white stroke-3" />}
      </div>
      <span
        className={cn(
          'text-sm transition-colors flex items-center gap-1.5 select-none',
          checked
            ? 'text-foreground font-medium'
            : 'text-muted-foreground group-hover:text-foreground',
        )}
      >
        {label}
        {count !== undefined && (
          <span className="text-xs text-muted-foreground/60 bg-white/50 px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </span>
    </div>
  );
}
