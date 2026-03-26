'use client'

import { useCallback, useMemo, useState, useEffect } from 'react'
import {
  Loader2,
  Plus,
  Trash2,
  Info,
  FolderTree,
  Inbox,
  LayoutList,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  useAddBannerToGroupMutation,
  useRemoveBannerFromGroupMutation,
} from '@/hooks/mutations/admin-banner.mutation'
import { useBannerGroupsOfBannerQuery } from '@/hooks/querys/admin-banner.query'
import type {
  IBannerDataType,
  IBannerGroupDataType,
} from '@/lib/types/interfaces/apis/banner.interfaces'
import { BannerEditForm } from '../shared/banner-edit-form'

interface EditBannerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  banner: (IBannerDataType & { groupId?: string }) | null
  groups: IBannerGroupDataType[]
}

export function EditBannerDialog({
  open,
  onOpenChange,
  banner,
  groups,
}: EditBannerDialogProps) {
  const [activeTab, setActiveTab] = useState('info')

  // Reset tab when dialog opens
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        setActiveTab('info')
      })
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">Chỉnh sửa banner</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin banner {banner?.title ? `"${banner.title}"` : ''}
          </DialogDescription>
        </DialogHeader>

        {banner && (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2 h-11">
                <TabsTrigger value="info" className="gap-2 text-sm">
                  <LayoutList className="h-4 w-4" />
                  Thông tin Banner
                </TabsTrigger>
                <TabsTrigger value="groups" className="gap-2 text-sm">
                  <FolderTree className="h-4 w-4" />
                  Quản lý Nhóm
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="info" className="mt-0 m-0">
              <ScrollArea className="h-[calc(90vh-180px)]">
                <div className="px-6 pb-6 pt-4">
                  <BannerEditForm
                    key={banner.id}
                    banner={banner}
                    onSuccess={() => onOpenChange(false)}
                    onCancel={() => onOpenChange(false)}
                  />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="groups" className="mt-0 m-0">
              <ScrollArea className="h-[calc(90vh-180px)]">
                <div className="px-6 pb-6 pt-4">
                  <GroupManagementTab banner={banner} allGroups={groups} />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ==================== TAB 2: GROUP MANAGEMENT ====================

function GroupManagementTab({
  banner,
  allGroups,
}: {
  banner: IBannerDataType & { groupId?: string }
  allGroups: IBannerGroupDataType[]
}) {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('')

  // Get all groups of this banner
  const { data: bannerGroupsData, isLoading: isLoadingGroups } =
    useBannerGroupsOfBannerQuery(banner.id)

  const addToGroupMutation = useAddBannerToGroupMutation()
  const removeFromGroupMutation = useRemoveBannerFromGroupMutation()

  // bannerGroupsData trả về dạng pagination với items
  const bannerGroups: IBannerGroupDataType[] = useMemo(
    () => bannerGroupsData?.data?.items ?? [],
    [bannerGroupsData?.data?.items],
  )

  const availableGroups = useMemo(() => {
    const currentGroupIds = new Set(bannerGroups.map((g) => g.id))
    return allGroups.filter(
      (g: IBannerGroupDataType) => !currentGroupIds.has(g.id),
    )
  }, [allGroups, bannerGroups])

  const handleAddToGroup = useCallback(async () => {
    if (!selectedGroupId) return
    await addToGroupMutation.mutateAsync({
      groupId: selectedGroupId,
      bannerId: banner.id,
    })
    setSelectedGroupId('')
  }, [selectedGroupId, banner.id, addToGroupMutation])

  const handleRemoveFromGroup = useCallback(
    async (groupId: string) => {
      await removeFromGroupMutation.mutateAsync({
        groupId,
        bannerId: banner.id,
      })
    },
    [banner.id, removeFromGroupMutation],
  )

  const isLoading = isLoadingGroups
  const isMutating =
    addToGroupMutation.isPending || removeFromGroupMutation.isPending

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tổng nhóm</CardDescription>
            <CardTitle className="text-2xl">{bannerGroups.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Nhóm khả dụng</CardDescription>
            <CardTitle className="text-2xl">{availableGroups.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Trạng thái banner</CardDescription>
            <CardTitle className="text-lg">
              {banner.isActive ? (
                <Badge variant="default" className="bg-green-500">
                  Đang hoạt động
                </Badge>
              ) : (
                <Badge variant="secondary">Đã tắt</Badge>
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Separator />

      {/* Add to group */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm vào nhóm
        </h4>
        <div className="flex gap-2">
          <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Chọn nhóm để thêm..." />
            </SelectTrigger>
            <SelectContent>
              {availableGroups.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  Không có nhóm nào khả dụng
                </div>
              ) : (
                availableGroups.map((group: IBannerGroupDataType) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAddToGroup}
            disabled={
              !selectedGroupId || addToGroupMutation.isPending || isMutating
            }
          >
            {addToGroupMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Thêm
          </Button>
        </div>
      </div>

      <Separator />

      {/* Current groups list */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <FolderTree className="h-4 w-4" />
          Các nhóm hiện tại
        </h4>

        {bannerGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border rounded-lg">
            <Inbox className="h-10 w-10 mb-2 opacity-50" />
            <p className="text-sm">Banner chưa thuộc nhóm nào</p>
          </div>
        ) : (
          <div className="space-y-2">
            {bannerGroups.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                        <FolderTree className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground">
                          Slug: {item.slug}
                        </span>
                      </div>
                      {item.isActive ? (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          Hoạt động
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          Tắt
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveFromGroup(item.id)}
                      disabled={removeFromGroupMutation.isPending || isMutating}
                    >
                      {removeFromGroupMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <p>
          Một banner có thể thuộc về nhiều nhóm khác nhau. Việc xóa banner khỏi
          nhóm sẽ không xóa banner khỏi hệ thống.
        </p>
      </div>
    </div>
  )
}
