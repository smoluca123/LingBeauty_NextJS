import { Package, PackageX, TrendingDown, AlertTriangle } from 'lucide-react';
import { StatCard } from '../../components';

interface InventoryStatsProps {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export function InventoryStats({
  totalProducts,
  lowStockCount,
  outOfStockCount,
}: InventoryStatsProps) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Tổng sản phẩm"
          value={totalProducts}
          icon={Package}
        />
        <StatCard
          title="Sắp hết hàng"
          value={lowStockCount}
          icon={TrendingDown}
          className={lowStockCount > 0 ? 'border-orange-200 bg-orange-50' : ''}
        />
        <StatCard
          title="Hết hàng"
          value={outOfStockCount}
          icon={PackageX}
          className={outOfStockCount > 0 ? 'border-red-200 bg-red-50' : ''}
        />
      </div>

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <div>
            <p className="font-medium text-orange-800">
              Cảnh báo: {lowStockCount} sản phẩm sắp hết hàng
            </p>
            <p className="text-sm text-orange-600">
              Hãy kiểm tra và bổ sung kịp thời
            </p>
          </div>
        </div>
      )}
    </>
  );
}
