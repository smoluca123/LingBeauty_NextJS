'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { IBannerGroupDataType } from '@/lib/types/interfaces/apis/banner.interfaces'
import { BannerForm } from '../shared/banner-form'

interface CreateBannerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: IBannerGroupDataType[]
  defaultGroupId: string | null
}

export function CreateBannerDialog({
  open,
  onOpenChange,
  groups,
  defaultGroupId,
}: CreateBannerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm banner mới</DialogTitle>
          <DialogDescription>Tạo banner mới trong nhóm</DialogDescription>
        </DialogHeader>

        {open && (
          <BannerForm
            groups={groups}
            defaultGroupId={defaultGroupId}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
