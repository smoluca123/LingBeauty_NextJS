'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BannerForm } from '@/app/admin/banners/components/shared/banner-form'

interface CreateBannerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groupId: string
}

export function CreateBannerDialog({
  open,
  onOpenChange,
  groupId,
}: CreateBannerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm banner mới</DialogTitle>
          <DialogDescription>Tạo banner mới trong nhóm này</DialogDescription>
        </DialogHeader>

        {open && (
          <BannerForm
            fixedGroupId={groupId}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
