import { OrdersContent } from '../components';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Đơn hàng</h1>
      <OrdersContent />
    </div>
  );
}
