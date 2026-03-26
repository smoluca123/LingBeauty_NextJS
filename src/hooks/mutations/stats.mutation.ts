import { useMutation } from '@tanstack/react-query'
import { syncDailyStatsClientAPI } from '@/lib/apis/client/stats.apis'

// ── Sync daily stats (mutation) ───────────────────────────────────────────────

export const useSyncDailyStatsMutation = () =>
  useMutation({
    mutationFn: () => syncDailyStatsClientAPI(),
  })
