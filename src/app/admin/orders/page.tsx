import { Suspense } from 'react'
import { OrdersContent } from './components'
import { Skeleton } from '@/components/ui/skeleton'

function OrdersPageSkeleton() {
  return (
    <div className="flex flex-col h-full gap-4 md:gap-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <Skeleton className="h-12 w-full" />
      <Skeleton className="flex-1 w-full" />
    </div>
  )
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<OrdersPageSkeleton />}>
      <OrdersContent />
    </Suspense>
  )
}
