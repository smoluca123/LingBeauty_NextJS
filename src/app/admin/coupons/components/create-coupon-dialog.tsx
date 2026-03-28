'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CouponForm } from './coupon-form';
import { useCreateCouponMutation } from '@/hooks/mutations/admin-coupon.mutation';
import { CouponType } from '@/lib/types/interfaces/coupon.interfaces';
import { CouponFormValues } from '@/lib/schemas';

// ── Types ──────────────────────────────────────────────────────────────────────

interface CreateCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function CreateCouponDialog({
  open,
  onOpenChange,
}: CreateCouponDialogProps) {
  const createMutation = useCreateCouponMutation();

  const handleSubmit = (values: CouponFormValues) => {
    createMutation.mutate(
      {
        code: values.code,
        type: values.type as CouponType,
        value: values.value,
        minPurchase: values.minPurchase,
        maxDiscount: values.maxDiscount,
        usageLimit: values.usageLimit,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        isActive: values.isActive,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[550px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Thêm mã giảm giá mới</DialogTitle>
          <DialogDescription>
            Tạo mã giảm giá mới để thu hút khách hàng
          </DialogDescription>
        </DialogHeader>

        {open && (
          <CouponForm
            onSubmit={handleSubmit}
            onCancel={handleClose}
            isSubmitting={createMutation.isPending}
            submitLabel='Tạo mã giảm giá'
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
