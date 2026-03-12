import { Loader2 } from 'lucide-react';

interface InventoryLoadingProps {
  message?: string;
}

export function InventoryLoading({ message = 'Đang tải...' }: InventoryLoadingProps) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        {message && <span className="text-sm">{message}</span>}
      </div>
    </div>
  );
}
