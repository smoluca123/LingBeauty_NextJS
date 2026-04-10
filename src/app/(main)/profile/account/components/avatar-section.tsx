'use client'

import { useState } from 'react'
import { Camera } from 'lucide-react'
import UserAvatar from '@/components/user-avatar'
import { AvatarUploadDialog } from './avatar-upload-dialog'
import type { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces'

// ============ Props ============
interface IAvatarSectionProps {
  user: IUserDataType
}

// ============ Component ============
export function AvatarSection({ user }: IAvatarSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const avatarUrl = user.avatar?.media?.url
  const fullName = `${user.firstName} ${user.lastName}`.trim() || user.username

  return (
    <>
      {/* Clickable avatar with camera overlay */}
      <button
        type="button"
        aria-label="Thay đổi ảnh đại diện"
        className="group relative size-20 shrink-0 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-pink focus-visible:ring-offset-2"
        onClick={() => setIsDialogOpen(true)}
      >
        <UserAvatar
          avatarUrl={avatarUrl}
          fallbackName={fullName}
          className="size-20 transition-opacity group-hover:opacity-75"
        />

        {/* Camera icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-colors group-hover:bg-black/30">
          <Camera className="size-5 text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-100" />
        </div>
      </button>

      {/* Upload Dialog */}
      <AvatarUploadDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  )
}
