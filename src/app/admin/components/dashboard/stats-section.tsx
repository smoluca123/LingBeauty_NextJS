import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { StatCard } from '../stat-card';

export function StatsSection() {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Tổng doanh thu"
        value="328.000.000₫"
        description="+12.5% so với tháng trước"
        icon={DollarSign}
        trend="up"
      />
      <StatCard
        title="Đơn hàng"
        value="909"
        description="+8.2% so với tháng trước"
        icon={ShoppingCart}
        trend="up"
      />
      <StatCard
        title="Sản phẩm"
        value="156"
        description="12 sản phẩm sắp hết hàng"
        icon={Package}
      />
      <StatCard
        title="Người dùng"
        value="2,345"
        description="+156 người dùng mới"
        icon={Users}
        trend="up"
      />
    </div>
  );
}
