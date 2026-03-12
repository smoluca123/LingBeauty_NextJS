import { Package } from 'lucide-react';

interface InventoryEmptyStateProps {
  title: string;
  description: string;
}

export function InventoryEmptyState({ title, description }: InventoryEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
      <Package className="h-12 w-12" />
      <p className="text-lg font-medium">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  );
}
