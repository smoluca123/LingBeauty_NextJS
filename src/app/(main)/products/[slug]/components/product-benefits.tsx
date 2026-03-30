import { Truck, ShieldCheck } from 'lucide-react'

export function ProductBenefits() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground sm:flex-row sm:justify-around">
      <div className="flex items-center gap-2">
        <Truck className="h-4 w-4 text-primary-pink" />
        <span>Miễn phí vận chuyển</span>
      </div>
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-primary-pink" />
        <span>Hàng chính hãng 100%</span>
      </div>
    </div>
  )
}
