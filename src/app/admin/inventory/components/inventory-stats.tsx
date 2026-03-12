import { Package, PackageX, TrendingDown, Layers } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import { StatCard } from '../../components';
import type { IInventoryOverview } from '@/lib/types/interfaces/apis/admin-inventory.interfaces';

interface InventoryStatsProps {
  overview: IInventoryOverview | undefined;
}

export function InventoryStats({ overview }: InventoryStatsProps) {
  const lowStockCount = overview?.lowStockCount ?? 0;
  const outOfStockCount = overview?.outOfStockCount ?? 0;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng sản phẩm"
          value={overview?.totalProducts ?? 0}
          icon={Package}
        />
        <StatCard
          title="Tổng biến thể"
          value={overview?.totalVariants ?? 0}
          icon={Layers}
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
        <div className="flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 mt-4">
          <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0" />
          <div>
            <p className="font-medium text-orange-800">
              Cảnh báo: {lowStockCount} sản phẩm/biến thể sắp hết hàng
            </p>
            <p className="text-sm text-orange-600">Hãy kiểm tra và bổ sung kịp thời</p>
          </div>
        </div>
      )}
    </>
  );
}
