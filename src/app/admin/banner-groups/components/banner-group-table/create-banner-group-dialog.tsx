'use client'
'use no memo'

import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useCreateBannerGroupMutation } from '@/hooks/mutations/admin-banner.mutation'
import { generateSlug } from '@/lib/utils'

// ── Schema ───────────────────────────────────────────────────────────────────

const formSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên nhóm'),
  slug: z.string().min(1, 'Vui lòng nhập slug'),
  description: z.string().optional(),
  isActive: z.boolean(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

// ── Types ──────────────────────────────────────────────────────────────────────

interface CreateBannerGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ── Component ──────────────────────────────────────────────────────────────────

export function CreateBannerGroupDialog({
  open,
  onOpenChange,
}: CreateBannerGroupDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm nhóm banner</DialogTitle>
          <DialogDescription>
            Tạo nhóm banner mới để quản lý các banner liên quan
          </DialogDescription>
        </DialogHeader>

        {open && <CreateBannerGroupForm onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}

// ── Form Component ─────────────────────────────────────────────────────────────

function CreateBannerGroupForm({ onClose }: { onClose: () => void }) {
  const createMutation = useCreateBannerGroupMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      isActive: true,
      startDate: '',
      endDate: '',
    },
  })

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    form.setValue('name', value, { shouldValidate: true })

    // Auto-generate slug if it's empty or matches the previous auto-generated slug
    const currentSlug = form.getValues('slug')
    if (!currentSlug || currentSlug === generateSlug(value.slice(0, -1))) {
      form.setValue('slug', generateSlug(value), { shouldValidate: true })
    }
  }

  const onSubmit = async (data: FormValues) => {
    await createMutation.mutateAsync({
      name: data.name,
      slug: data.slug,
      description: data.description || undefined,
      isActive: data.isActive,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
    })

    onClose()
  }

  const handleClose = () => {
    if (!createMutation.isPending) {
      onClose()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên nhóm <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={handleNameChange}
                    placeholder="VD: Banner Tết 2026"
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
                  <Input {...field} placeholder="VD: tet-2026" />
                </FormControl>
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
                    {...field}
                    placeholder="Mô tả về nhóm banner này..."
                    rows={3}
                  />
                </FormControl>
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
                  <FormLabel>Ngày bắt đầu</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
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
                  <FormLabel>Ngày kết thúc</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Active Status */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-2">
                <div className="space-y-0.5">
                  <FormLabel>Kích hoạt</FormLabel>
                  <FormMessage />
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
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={createMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary-pink"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              'Tạo nhóm'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
