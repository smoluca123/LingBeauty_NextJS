/* eslint-disable jsx-a11y/alt-text */
'use client'

import { Button } from '@/components/ui/button'
import { Bold, Italic, Underline, Image, Hash } from 'lucide-react'

/**
 * Demo component để show các trạng thái của toolbar buttons
 * Chỉ dùng để reference, không dùng trong production
 */
export function ToolbarButtonDemo() {
  return (
    <div className="space-y-8 p-8 bg-background">
      <div>
        <h3 className="text-lg font-semibold mb-4">Toolbar Button States</h3>

        {/* Normal State */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Normal (Inactive)</p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active State */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Active</p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-primary-pink text-white hover:bg-primary-pink/90 shadow-sm ring-1 ring-primary-pink/20 transition-all relative"
            >
              <Bold className="h-4 w-4" />
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white rounded-full" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-primary-pink text-white hover:bg-primary-pink/90 shadow-sm ring-1 ring-primary-pink/20 transition-all relative"
            >
              <Italic className="h-4 w-4" />
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white rounded-full" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-primary-pink text-white hover:bg-primary-pink/90 shadow-sm ring-1 ring-primary-pink/20 transition-all relative"
            >
              <Underline className="h-4 w-4" />
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white rounded-full" />
            </Button>
          </div>
        </div>

        {/* Disabled State */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Disabled</p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled
              className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground opacity-50 cursor-not-allowed transition-all"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled
              className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground opacity-50 cursor-not-allowed transition-all"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled
              className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground opacity-50 cursor-not-allowed transition-all"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Special Buttons (Image, Hashtag) */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Special Buttons (Normal)
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-primary-pink hover:bg-primary-pink/10 transition-all"
            >
              <Hash className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Special Buttons (Active/Open)
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-primary-pink text-white hover:bg-primary-pink/90 transition-all"
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-primary-pink text-white hover:bg-primary-pink/90 transition-all"
            >
              <Hash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Color Reference */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Color Reference</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-pink rounded" />
            <div>
              <p className="font-medium">Primary Pink</p>
              <p className="text-sm text-muted-foreground">Active background</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-muted rounded" />
            <div>
              <p className="font-medium">Muted</p>
              <p className="text-sm text-muted-foreground">
                Hover background (normal)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-background border rounded flex items-center justify-center">
              <span className="text-muted-foreground">Aa</span>
            </div>
            <div>
              <p className="font-medium">Muted Foreground</p>
              <p className="text-sm text-muted-foreground">Normal icon color</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
