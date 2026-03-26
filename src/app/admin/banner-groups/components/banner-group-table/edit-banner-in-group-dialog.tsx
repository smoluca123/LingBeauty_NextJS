'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { IBannerDataType } from '@/lib/types/interfaces/apis/banner.interfaces'
import { BannerEditForm } from '@/app/admin/banners/components/shared/banner-edit-form'

interface EditBannerInGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  banner: IBannerDataType | null
  groupId: string | undefined
}

export function EditBannerInGroupDialog({
  open,
  onOpenChange,
  banner,
}: EditBannerInGroupDialogProps) {
  if (!banner) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Chỉnh sửa banner</DialogTitle>
          <DialogDescription>Cập nhật thông tin banner</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4 max-h-[calc(90vh-140px)]">
          <BannerEditForm
            key={banner.id}
            banner={banner}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
