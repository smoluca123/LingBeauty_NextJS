import { cn } from '@/lib/utils/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

// ============ Types ============
interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  className?: string;
}

// ============ Component ============
export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {description && (
            <div className="flex items-center gap-1">
              {trend === 'up' && (
                <TrendingUp
                  className="h-3 w-3 text-green-600"
                  aria-hidden="true"
                />
              )}
              {trend === 'down' && (
                <TrendingDown
                  className="h-3 w-3 text-red-600"
                  aria-hidden="true"
                />
              )}
              <p
                className={cn(
                  'text-xs text-muted-foreground',
                  trend === 'up' && 'text-green-600',
                  trend === 'down' && 'text-red-600',
                )}
              >
                {description}
              </p>
            </div>
          )}
        </div>
        <div className="rounded-full bg-primary-pink/10 p-3">
          <Icon className="h-6 w-6 text-primary-pink" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
