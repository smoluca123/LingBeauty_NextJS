'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSyncDailyStats } from '@/app/admin/hooks';

export function SyncStatsButton() {
  const { mutate: syncStats, isPending } = useSyncDailyStats();
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const handleSync = () => {
    syncStats(undefined, {
      onSuccess: () => {
        setLastSynced(
          new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        );
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      {lastSynced && (
        <span className="text-xs text-muted-foreground">
          Đồng bộ lúc {lastSynced}
        </span>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleSync}
        disabled={isPending}
        className="gap-2"
      >
        <RefreshCw
          className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`}
          aria-hidden="true"
        />
        {isPending ? 'Đang đồng bộ...' : 'Đồng bộ dữ liệu'}
      </Button>
    </div>
  );
}
