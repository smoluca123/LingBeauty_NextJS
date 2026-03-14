'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
  useInventoryOverviewQuery,
  useAllProductsQuery,
  useAllVariantsQuery,
  useLowStockProductsQuery,
  useLowStockVariantsQuery,
  useOutOfStockProductsQuery,
  useOutOfStockVariantsQuery,
} from '@/hooks/querys/admin-inventory.query';
import type { IInventoryOverview } from '@/lib/types/interfaces/apis/admin-inventory.interfaces';
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { InventoryRow } from './inventory-table';
import { InventoryStats } from './inventory-stats';
import { InventoryTabTriggers } from './inventory-tab-triggers';
import { InventoryTabLayout } from './inventory-tab-layout';

// ============ Types ============

type TabKey =
  | 'all-products'
  | 'all-variants'
  | 'low-stock-products'
  | 'low-stock-variants'
  | 'out-of-stock-products'
  | 'out-of-stock-variants';

// ============ Tab Configuration ============

interface TabConfig {
  value: TabKey;
  useQuery: (page: number, limit: number, search?: string, status?: string) => {
    data: unknown;
    isLoading: boolean;
  };
  serverSearch?: boolean;
  showStatusFilter?: boolean;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  emptyTitle: string;
  emptyDescription: string;
  paginationAriaLabel?: string;
}

const TAB_CONFIGS: TabConfig[] = [
  {
    value: 'all-products',
    useQuery: useAllProductsQuery,
    serverSearch: true,
    showStatusFilter: true,
    searchPlaceholder: 'Tìm theo tên sản phẩm, SKU…',
    searchAriaLabel: 'Tìm kiếm kho hàng sản phẩm',
    emptyTitle: 'Không có sản phẩm nào',
    emptyDescription: 'Chưa có dữ liệu kho hàng.',
    paginationAriaLabel: 'Phân trang kho hàng sản phẩm',
  },
  {
    value: 'all-variants',
    useQuery: useAllVariantsQuery,
    serverSearch: true,
    showStatusFilter: true,
    searchPlaceholder: 'Tìm theo tên sản phẩm, biến thể, SKU…',
    searchAriaLabel: 'Tìm kiếm kho hàng biến thể',
    emptyTitle: 'Không có biến thể nào',
    emptyDescription: 'Chưa có dữ liệu kho hàng biến thể.',
    paginationAriaLabel: 'Phân trang kho hàng biến thể',
  },
  {
    value: 'low-stock-products',
    useQuery: useLowStockProductsQuery,
    emptyTitle: 'Không có sản phẩm nào sắp hết',
    emptyDescription: 'Tất cả sản phẩm đơn giản đang có đủ tồn kho.',
    searchPlaceholder: 'Tìm sản phẩm sắp hết theo tên, SKU…',
  },
  {
    value: 'low-stock-variants',
    useQuery: useLowStockVariantsQuery,
    emptyTitle: 'Không có biến thể nào sắp hết',
    emptyDescription: 'Tất cả biến thể đang có đủ tồn kho.',
    searchPlaceholder: 'Tìm biến thể sắp hết theo tên, SKU…',
  },
  {
    value: 'out-of-stock-products',
    useQuery: useOutOfStockProductsQuery,
    emptyTitle: 'Không có sản phẩm nào hết hàng',
    emptyDescription: 'Tất cả sản phẩm đơn giản đang còn hàng.',
    searchPlaceholder: 'Tìm sản phẩm hết hàng theo tên, SKU…',
  },
  {
    value: 'out-of-stock-variants',
    useQuery: useOutOfStockVariantsQuery,
    emptyTitle: 'Không có biến thể nào hết hàng',
    emptyDescription: 'Tất cả biến thể đang còn hàng.',
    searchPlaceholder: 'Tìm biến thể hết hàng theo tên, SKU…',
  },
];

// ============ Helpers ============

/**
 * Extract totalCount from a paginated query result.
 * Each tab API returns: { data: { items, totalCount, currentPage, pageSize } }
 */
function extractTotalCount(data: unknown): number | undefined {
  const paginated = data as IApiPaginationResponseWrapperType<InventoryRow> | undefined;
  return paginated?.data?.totalCount;
}

// ============ Component ============

export function InventoryContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('all-products');

  // ── Overview for stats cards only ────────────────────────────────────────
  const { data: overviewData, isLoading: overviewLoading } = useInventoryOverviewQuery();
  const overview = (overviewData as { data?: IInventoryOverview } | undefined)?.data;

  // ── Per-tab count queries (page=1, limit=1) ───────────────────────────────
  // These lightweight queries fetch exactly 1 row each just to get totalCount.
  // TanStack Query caches by key, so when the user navigates to a tab the
  // full-page query (page=1, limit=20+) uses a different key and fetches independently.
  const { data: allProductsData } = useAllProductsQuery(1, 1);
  const { data: allVariantsData } = useAllVariantsQuery(1, 1);
  const { data: lowStockProductsData } = useLowStockProductsQuery(1, 1);
  const { data: lowStockVariantsData } = useLowStockVariantsQuery(1, 1);
  const { data: outOfStockProductsData } = useOutOfStockProductsQuery(1, 1);
  const { data: outOfStockVariantsData } = useOutOfStockVariantsQuery(1, 1);

  const tabCounts = {
    allProducts: extractTotalCount(allProductsData),
    allVariants: extractTotalCount(allVariantsData),
    lowStockProducts: extractTotalCount(lowStockProductsData),
    lowStockVariants: extractTotalCount(lowStockVariantsData),
    outOfStockProducts: extractTotalCount(outOfStockProductsData),
    outOfStockVariants: extractTotalCount(outOfStockVariantsData),
  };

  return (
    <div className="flex flex-col h-full gap-4 md:gap-6">
      {/* Header */}
      <div className="shrink-0">
        <h1 className="text-xl md:text-2xl font-bold">Kho hàng</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Quản lý tồn kho và theo dõi số lượng sản phẩm
        </p>
      </div>

      {/* Stats */}
      <div className="shrink-0">
        {overviewLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Đang tải thống kê...</span>
          </div>
        ) : (
          <InventoryStats overview={overview} />
        )}
      </div>

      {/* Tabs */}
      <div className="flex-1 min-h-0 flex flex-col">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabKey)}
          className="flex flex-col h-full gap-3"
        >
          <InventoryTabTriggers counts={tabCounts} />

          {TAB_CONFIGS.map((config) => (
            <TabsContent key={config.value} value={config.value} className="flex-1 min-h-0 mt-0">
              <InventoryTabLayout
                useQuery={config.useQuery}
                serverSearch={config.serverSearch}
                showStatusFilter={config.showStatusFilter}
                searchPlaceholder={config.searchPlaceholder}
                searchAriaLabel={config.searchAriaLabel}
                emptyTitle={config.emptyTitle}
                emptyDescription={config.emptyDescription}
                paginationAriaLabel={config.paginationAriaLabel}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
