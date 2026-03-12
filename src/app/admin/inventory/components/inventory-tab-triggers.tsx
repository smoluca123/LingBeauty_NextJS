import type { IInventoryOverview } from '@/lib/types/interfaces/apis/admin-inventory.interfaces';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

// ============ Types ============

interface TabTriggerConfig {
  value: string;
  label: string;
  badgeCount?: number;
  badgeColorClass: string;
}

interface InventoryTabTriggersProps {
  overview: IInventoryOverview | undefined;
}

// ============ Component ============

export function InventoryTabTriggers({ overview }: InventoryTabTriggersProps) {
  const tabs: TabTriggerConfig[] = [
    {
      value: 'all-products',
      label: 'Tất cả · SP',
      badgeCount: overview?.totalProducts,
      badgeColorClass: 'bg-blue-100 text-blue-700',
    },
    {
      value: 'all-variants',
      label: 'Tất cả · BT',
      badgeCount: overview?.totalVariants,
      badgeColorClass: 'bg-purple-100 text-purple-700',
    },
    {
      value: 'low-stock-products',
      label: 'Sắp hết · SP',
      badgeCount: overview?.lowStockCount,
      badgeColorClass: 'bg-orange-100 text-orange-700',
    },
    {
      value: 'low-stock-variants',
      label: 'Sắp hết · BT',
      badgeCount: undefined,
      badgeColorClass: '',
    },
    {
      value: 'out-of-stock-products',
      label: 'Hết hàng · SP',
      badgeCount: overview?.outOfStockCount,
      badgeColorClass: 'bg-red-100 text-red-700',
    },
    {
      value: 'out-of-stock-variants',
      label: 'Hết hàng · BT',
      badgeCount: undefined,
      badgeColorClass: '',
    },
  ];

  return (
    <div className="shrink-0">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm py-2">
            {tab.label}
            {tab.badgeCount != null && tab.badgeCount > 0 && (
              <span
                className={`ml-1 rounded-full px-1.5 text-xs font-semibold ${tab.badgeColorClass}`}
              >
                {tab.badgeCount}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}
