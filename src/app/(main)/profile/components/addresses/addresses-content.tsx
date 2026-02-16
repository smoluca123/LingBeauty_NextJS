'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useGetMyAddressesQuery } from '@/hooks/querys/address.query';
import { useAddMyAddress } from '@/hooks/mutations/address.mutation';
import { AddressFormValues } from '@/lib/zod-schemas/addresses.schema';
import { AddressCard } from './address-card';
import { AddressCardSkeleton } from './address-card-skeleton';
import { AddressFormDialog } from './components';
import { Pagination } from '@/components/pagination';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/constants/api';

// ============ Main Component ============
export function AddressesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(
    Number(searchParams.get('page')) || DEFAULT_PAGE,
  );
  const [limit] = useState(Number(searchParams.get('limit')) || DEFAULT_LIMIT);

  // Fetch addresses from API
  const { data, isLoading, error } = useGetMyAddressesQuery({
    page,
    limit,
  });

  // Mutations
  const addAddressMutation = useAddMyAddress();

  // Local state for add dialog only
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  // Handlers
  const handleAddAddress = () => {
    setFormDialogOpen(true);
  };

  const handleFormSubmit = async (formData: AddressFormValues) => {
    try {
      await addAddressMutation.mutateAsync(formData);

      await queryClient.invalidateQueries({
        queryKey: ['addresses'],
      });

      // Close dialog
      setFormDialogOpen(false);
    } catch {
      // Error handling with toast
      toast.error('Không thể thêm địa chỉ. Vui lòng thử lại.');
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    setPage(page);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? 'Đang tải...'
              : error
                ? 'Không thể tải địa chỉ'
                : `${data?.data.totalCount || 0} địa chỉ đã lưu`}
          </p>
          <Button
            onClick={handleAddAddress}
            className="h-10 rounded-full bg-primary-pink hover:bg-primary-pink/90 text-white font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm địa chỉ
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <AddressCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-destructive">
              Có lỗi xảy ra khi tải danh sách địa chỉ. Vui lòng thử lại sau.
            </p>
          </div>
        )}

        {/* Address List */}
        {!isLoading && !error && data?.data && data.data.items.length > 0 && (
          <div className="grid gap-4">
            {data?.data.items.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && data?.data && data.data.items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Bạn chưa có địa chỉ nào được lưu.
            </p>
            <Button
              onClick={handleAddAddress}
              className="rounded-full bg-primary-pink hover:bg-primary-pink/90 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm địa chỉ đầu tiên
            </Button>
          </div>
        )}

        {/* Pagination */}
        {!isLoading &&
          !error &&
          data?.data.totalPage &&
          data.data.totalPage > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.data.totalPage}
              onPageChange={handlePageChange}
              className="mt-6"
            />
          )}
      </div>

      {/* Add Address Form Dialog */}
      <AddressFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSubmit={handleFormSubmit}
        isSubmitting={addAddressMutation.isPending}
      />
    </>
  );
}
