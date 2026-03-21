import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils/utils';

export function NavigationBarLoading() {
  const randomWidths = [
    'w-20',
    'w-24',
    'w-28',
    'w-32',
    'w-24',
    'w-28',
    'w-20',
    'w-24',
  ];

  return (
    <nav className="relative py-2">
      <div className="overflow-hidden">
        <div className="flex gap-3 md:gap-4 lg:gap-5 px-2 md:px-0">
          {Array.from({ length: 12 }).map((_, index) => (
            <Skeleton
              key={index}
              className={cn(
                'h-8 rounded-md',
                randomWidths[index % randomWidths.length],
              )}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
