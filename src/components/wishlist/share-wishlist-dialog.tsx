'use client'

import { useState } from 'react'
import { Share2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useCreateSharedWishlist } from '@/hooks/mutations/wishlist.mutation'
import { toast } from 'sonner'

export function ShareWishlistDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [expiresAt, setExpiresAt] = useState('')
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const createSharedWishlist = useCreateSharedWishlist()

  const handleCreate = async () => {
    try {
      const response = await createSharedWishlist.mutateAsync(
        {
          title: title || undefined,
          description: description || undefined,
          isPublic,
          expiresAt: expiresAt || undefined,
        },
        {
          onSuccess: (data) => {
            toast.success(data.message)
            setShareUrl(response.data.shareUrl)
          },
          onError: (err) => {
            toast.error(err.message)
          },
        },
      )
    } catch (error) {
      // Error handled by mutation
      console.log(error)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Đã sao chép link!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Không thể sao chép link')
    }
  }

  const handleClose = () => {
    setOpen(false)
    setTitle('')
    setDescription('')
    setIsPublic(false)
    setExpiresAt('')
    setShareUrl('')
    setCopied(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Chia sẻ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chia sẻ danh sách yêu thích</DialogTitle>
          <DialogDescription>
            Tạo link để chia sẻ danh sách yêu thích của bạn với người khác
          </DialogDescription>
        </DialogHeader>

        {!shareUrl ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề (tùy chọn)</Label>
              <Input
                id="title"
                placeholder="Ví dụ: Danh sách quà sinh nhật"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả (tùy chọn)</Label>
              <Textarea
                id="description"
                placeholder="Thêm mô tả cho danh sách của bạn"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="public">Công khai</Label>
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires">Ngày hết hạn (tùy chọn)</Label>
              <Input
                id="expires"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>

            <Button
              onClick={handleCreate}
              disabled={createSharedWishlist.isPending}
              className="w-full"
            >
              {createSharedWishlist.isPending
                ? 'Đang tạo...'
                : 'Tạo link chia sẻ'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Link chia sẻ</Label>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Link đã được tạo thành công! Bạn có thể chia sẻ link này với bạn
              bè.
            </p>

            <Button onClick={handleClose} className="w-full">
              Đóng
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
