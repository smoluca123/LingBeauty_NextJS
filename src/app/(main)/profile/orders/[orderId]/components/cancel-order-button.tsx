'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCancelOrderMutation } from '@/hooks/mutations/order.mutation'

interface CancelOrderButtonProps {
  orderId: string
}

export function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const cancelMutation = useCancelOrderMutation(orderId)

  return (
    <Button
      variant="outline"
      size="sm"
      className="border-destructive text-destructive hover:bg-destructive/10"
      onClick={() => cancelMutation.mutate({})}
      disabled={cancelMutation.isPending}
    >
      {cancelMutation.isPending && (
        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
      )}
      Hủy đơn hàng
    </Button>
  )
}
