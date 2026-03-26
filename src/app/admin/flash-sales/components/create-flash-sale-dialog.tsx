/* eslint-disable react-hooks/incompatible-library */
'use client'

import { useEffect } from 'react'
import { Loader2, Zap } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateFlashSaleMutation } from '@/hooks/querys/admin-flash-sale.query'
import {
  FLASH_SALE_STATUS_OPTIONS,
  DEFAULT_FLASH_SALE_VALUES,
} from '@/app/admin/flash-sales/constants'
import { toast } from 'sonner'
import { generateSlug } from '@/lib/utils'
import {
  flashSaleCreateSchema,
  type FlashSaleCreateFormValues,
} from '@/lib/schemas'

// ── Types ──────────────────────────────────────────────────────────────────────

interface CreateFlashSaleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// ── Component ──────────────────────────────────────────────────────────────────

export function CreateFlashSaleDialog({
  open,
  onOpenChange,
}: CreateFlashSaleDialogProps) {
  const createMutation = useCreateFlashSaleMutation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<
    FlashSaleCreateFormValues,
    any,
    FlashSaleCreateFormValues
  >({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(flashSaleCreateSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      slug: '',
      startTime: formatDateForInput(new Date()),
      endTime: formatDateForInput(new Date(Date.now() + 24 * 60 * 60 * 1000)),
      status: DEFAULT_FLASH_SALE_VALUES.status,
      isActive: DEFAULT_FLASH_SALE_VALUES.isActive,
      sortOrder: DEFAULT_FLASH_SALE_VALUES.sortOrder,
    },
  })

  // Auto-generate slug from name
  useEffect(() => {
    const subscription = form.watch((value, { name: fieldName }) => {
      if (fieldName === 'name' && value.name && !form.getValues('slug')) {
        form.setValue('slug', generateSlug(value.name))
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: '',
        description: '',
        slug: '',
        startTime: formatDateForInput(new Date()),
        endTime: formatDateForInput(new Date(Date.now() + 24 * 60 * 60 * 1000)),
        status: DEFAULT_FLASH_SALE_VALUES.status,
        isActive: DEFAULT_FLASH_SALE_VALUES.isActive,
        sortOrder: DEFAULT_FLASH_SALE_VALUES.sortOrder,
      })
    }
  }, [open, form])

  const onSubmit = async (values: FlashSaleCreateFormValues) => {
    try {
      // Validate date range
      if (new Date(values.endTime) <= new Date(values.startTime)) {
        form.setError('endTime', {
          message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
        })
        return
      }

      await createMutation.mutateAsync({
        name: values.name,
        description: values.description,
        slug: values.slug,
        startTime: values.startTime,
        endTime: values.endTime,
        status: values.status,
        isActive: values.isActive,
        sortOrder: values.sortOrder,
      })
      toast.success('Tạo flash sale thành công')
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra')
    }
  }

  const isSubmitting = createMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Thêm Flash Sale mới
          </DialogTitle>
          <DialogDescription>
            Tạo đợt giảm giá nhanh với thời gian giới hạn
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên Flash Sale <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Flash Sale Cuối Tuần"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Slug <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="flash-sale-cuoi-tuan" {...field} />
                  </FormControl>
                  <FormDescription>
                    Đường dẫn URL cho flash sale (tự động tạo từ tên)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ngắn về đợt flash sale..."
                      className="min-h-20 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Bắt đầu <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Kết thúc <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status and Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FLASH_SALE_STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thứ tự ưu tiên</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} placeholder="0" {...field} />
                    </FormControl>
                    <FormDescription>Số càng nhỏ càng ưu tiên</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Active Switch */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Kích hoạt</FormLabel>
                    <FormDescription>
                      Flash sale sẽ được hiển thị trên website
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-pink hover:bg-primary-pink/90 text-white"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Tạo Flash Sale
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
