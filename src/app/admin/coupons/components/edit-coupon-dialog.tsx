'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CouponForm } from './coupon-form';
import { useUpdateCouponMutation } from '@/hooks/mutations/admin-coupon.mutation';
import type { ICouponDataType } from '@/lib/types/interfaces/apis/coupon.interfaces';
import { CouponType } from '@/lib/types/interfaces/coupon.interfaces';
import { CouponFormValues } from '@/lib/schemas';

// ── Types ──────────────────────────────────────────────────────────────────────

interface EditCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: ICouponDataType | null;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function EditCouponDialog({
  open,
  onOpenChange,
  coupon,
}: EditCouponDialogProps) {
  const updateMutation = useUpdateCouponMutation();

  const handleSubmit = (values: CouponFormValues) => {
    if (!coupon) return;

    updateMutation.mutate(
      {
        id: coupon.id,
        data: {
          type: values.type as CouponType,
          value: values.value,
          minPurchase: values.minPurchase,
          maxDiscount: values.maxDiscount,
          usageLimit: values.usageLimit,
          startDate: new Date(values.startDate).toISOString(),
          endDate: new Date(values.endDate).toISOString(),
          isActive: values.isActive,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const handleClose = () => {
    if (!updateMutation.isPending) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[550px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Sửa mã giảm giá</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin mã giảm giá {coupon?.code}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <CouponForm
            coupon={coupon}
            onSubmit={handleSubmit}
            onCancel={handleClose}
            isSubmitting={updateMutation.isPending}
            submitLabel='Cập nhật'
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
