'use client'

import { useEffect } from 'react'
import { Loader2, Percent, Banknote, Calendar } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ICouponDataType } from '@/lib/types/interfaces/apis/coupon.interfaces'
import {
  COUPON_TYPE_OPTIONS,
  COUPON_VALIDATION,
} from '@/app/admin/coupons/constants'
import { couponSchema, type CouponFormValues } from '@/lib/schemas'

// ── Types ──────────────────────────────────────────────────────────────────────

interface CouponFormProps {
  coupon?: ICouponDataType | null
  onSubmit: (values: CouponFormValues) => void
  onCancel: () => void
  isSubmitting?: boolean
  submitLabel?: string
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const formatDateForInput = (date: Date | string): string => {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

// ── Component ──────────────────────────────────────────────────────────────────

export function CouponForm({
  coupon,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = 'Lưu',
}: CouponFormProps) {
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: '',
      type: 'PERCENTAGE',
      value: 10,
      isActive: true,
      startDate: '',
      endDate: '',
    },
  })

  // Reset form when coupon changes (for edit mode)
  useEffect(() => {
    if (coupon) {
      form.reset({
        code: coupon.code,
        type: coupon.type,
        value: Number(coupon.value),
        minPurchase: coupon.minPurchase
          ? Number(coupon.minPurchase)
          : undefined,
        maxDiscount: coupon.maxDiscount
          ? Number(coupon.maxDiscount)
          : undefined,
        usageLimit: coupon.usageLimit ?? undefined,
        isActive: coupon.isActive,
        startDate: formatDateForInput(coupon.startDate),
        endDate: formatDateForInput(coupon.endDate),
      })
    } else {
      form.reset({
        code: '',
        type: 'PERCENTAGE',
        value: 10,
        isActive: true,
        startDate: formatDateForInput(new Date()),
        endDate: formatDateForInput(
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        ),
      })
    }
  }, [coupon, form])
  const watchType = useWatch({
    control: form.control,
    name: 'type',
  })
  // Update maxDiscount validation when type changes
  useEffect(() => {
    if (watchType === 'FIXED') {
      form.setValue('maxDiscount', undefined)
    }
  }, [watchType, form])

  const handleSubmit = (e: React.FormEvent) => {
    form.handleSubmit((values) => {
      // Validate date range
      if (new Date(values.endDate) <= new Date(values.startDate)) {
        form.setError('endDate', {
          message: 'Ngày kết thúc phải sau ngày bắt đầu',
        })
        return
      }

      // Validate max value based on type
      if (
        watchType === 'PERCENTAGE' &&
        values.value > COUPON_VALIDATION.MAX_PERCENTAGE
      ) {
        form.setError('value', {
          message: `Giá trị phần trăm không được vượt quá ${COUPON_VALIDATION.MAX_PERCENTAGE}%`,
        })
        return
      }

      onSubmit(values)
    })(e)
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Code */}
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã giảm giá *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="VD: WELCOME10"
                  className="font-mono uppercase"
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  disabled={!!coupon}
                />
              </FormControl>
              <FormDescription>
                Chỉ chứa chữ hoa, số và dấu gạch dưới
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type and Value Row */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại giảm giá *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!!coupon}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COUPON_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          {option.value === 'PERCENTAGE' ? (
                            <Percent className="h-4 w-4" />
                          ) : (
                            <Banknote className="h-4 w-4" />
                          )}
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Giá trị giảm *
                  {watchType === 'PERCENTAGE' && (
                    <span className="text-muted-foreground font-normal ml-1">
                      (%)
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    max={
                      watchType === 'PERCENTAGE'
                        ? COUPON_VALIDATION.MAX_PERCENTAGE
                        : COUPON_VALIDATION.MAX_FIXED_DISCOUNT
                    }
                    placeholder={
                      watchType === 'PERCENTAGE' ? 'VD: 10' : 'VD: 50000'
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Min Purchase and Max Discount Row */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="minPurchase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đơn hàng tối thiểu</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    step={1000}
                    placeholder="VD: 200000"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormDescription>Để trống nếu không giới hạn</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxDiscount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Giảm tối đa
                  {watchType === 'FIXED' && (
                    <span className="text-muted-foreground font-normal ml-1">
                      (Chỉ áp dụng cho %)
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    step={1000}
                    placeholder="VD: 50000"
                    disabled={watchType === 'FIXED'}
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Usage Limit */}
        <FormField
          control={form.control}
          name="usageLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới hạn sử dụng</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={1}
                  placeholder="VD: 100"
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                    )
                  }
                />
              </FormControl>
              <FormDescription>
                Để trống nếu không giới hạn số lượt sử dụng
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày bắt đầu *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} type="date" className="pl-10" />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày kết thúc *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} type="date" className="pl-10" />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Is Active */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Kích hoạt</FormLabel>
                <FormDescription>
                  Mã giảm giá sẽ có hiệu lực khi được kích hoạt
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit Buttons */}
        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button type="submit" variant="primary-pink" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
