'use client';

import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TablePagination } from '@/app/admin/components';
import { usePagination } from '@/app/admin/hooks';
import { InventoryStats } from './inventory-stats';
import { InventoryFilters } from './inventory-filters';
import { InventoryTable, getInventoryData, InventoryItem } from './inventory-table';
import { AdjustInventoryDialog } from './adjust-inventory-dialog';
import { AddProductDialog } from './add-product-dialog';

export function InventoryContent() {
  const [inventory] = useState(getInventoryData());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const {
      resetPage,
      paginate,
      getPaginationProps,
    } = usePagination();
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);

  // Stats
  const totalProducts = inventory.length;
  const lowStockCount = inventory.filter((i) => i.status === 'low_stock').length;
  const outOfStockCount = inventory.filter((i) => i.status === 'out_of_stock').length;

  // Filter
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productSku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  // Pagination
  const paginatedInventory = useMemo(
    () => paginate(filteredInventory),
    [filteredInventory, paginate]
  );

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    resetPage();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    resetPage();
  };

  // Removed handlePageSizeChange since handled by hook

  const handleAdjust = (item: InventoryItem) => {
    setSelectedItem(item);
    setAdjustDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header */}
      <div className="shrink-0 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kho hàng</h1>
          <p className="text-muted-foreground">
            Quản lý tồn kho và theo dõi số lượng sản phẩm
          </p>
        </div>
        <Button
          onClick={() => setAddProductDialogOpen(true)}
          variant="primary-pink"
          className="shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Stats & Alert */}
      <div className="shrink-0">
        <InventoryStats
          totalProducts={totalProducts}
          lowStockCount={lowStockCount}
          outOfStockCount={outOfStockCount}
        />
      </div>

      {/* Filters */}
      <div className="shrink-0">
        <InventoryFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Table - takes remaining space and scrolls */}
      <div className="flex-1 min-h-0">
        <InventoryTable inventory={paginatedInventory} onAdjust={handleAdjust} />
      </div>

      {/* Pagination */}
      <div className="shrink-0">
        <TablePagination
          {...getPaginationProps(filteredInventory.length)}
        />
      </div>

      {/* Adjust Dialog */}
      <AdjustInventoryDialog
        open={adjustDialogOpen}
        onOpenChange={setAdjustDialogOpen}
        item={selectedItem}
      />

      {/* Add Product Dialog */}
      <AddProductDialog
        open={addProductDialogOpen}
        onOpenChange={setAddProductDialogOpen}
      />
    </div>
  );
}
