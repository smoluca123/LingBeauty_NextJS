import { TabsList, TabsTrigger } from '@/components/ui/tabs';

// ============ Types ============

export interface TabCounts {
  allProducts: number | undefined;
  allVariants: number | undefined;
  lowStockProducts: number | undefined;
  lowStockVariants: number | undefined;
  outOfStockProducts: number | undefined;
  outOfStockVariants: number | undefined;
}

interface TabTriggerConfig {
  value: string;
  label: string;
  badgeCount: number | undefined;
  badgeColorClass: string;
}

interface InventoryTabTriggersProps {
  counts: TabCounts;
}

// ============ Component ============

export function InventoryTabTriggers({ counts }: InventoryTabTriggersProps) {
  const tabs: TabTriggerConfig[] = [
    {
      value: 'all-products',
      label: 'Tất cả · SP',
      badgeCount: counts.allProducts,
      badgeColorClass: 'bg-blue-100 text-blue-700',
    },
    {
      value: 'all-variants',
      label: 'Tất cả · BT',
      badgeCount: counts.allVariants,
      badgeColorClass: 'bg-purple-100 text-purple-700',
    },
    {
      value: 'low-stock-products',
      label: 'Sắp hết · SP',
      badgeCount: counts.lowStockProducts,
      badgeColorClass: 'bg-orange-100 text-orange-700',
    },
    {
      value: 'low-stock-variants',
      label: 'Sắp hết · BT',
      badgeCount: counts.lowStockVariants,
      badgeColorClass: 'bg-orange-100 text-orange-700',
    },
    {
      value: 'out-of-stock-products',
      label: 'Hết hàng · SP',
      badgeCount: counts.outOfStockProducts,
      badgeColorClass: 'bg-red-100 text-red-700',
    },
    {
      value: 'out-of-stock-variants',
      label: 'Hết hàng · BT',
      badgeCount: counts.outOfStockVariants,
      badgeColorClass: 'bg-red-100 text-red-700',
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
