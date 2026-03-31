'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BlogPostsTab } from './posts/blog-posts-tab'
import { BlogTopicsTab } from './topics/blog-topics-tab'

export function BlogContent() {
  const [activeTab, setActiveTab] = useState('posts')

  return (
    <div className="flex flex-col h-full gap-4 md:gap-6 w-full min-w-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý Blog</h1>
          <p className="text-muted-foreground">
            Quản lý bài viết và chủ đề blog
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList className="w-fit">
          <TabsTrigger value="posts">Bài viết</TabsTrigger>
          <TabsTrigger value="topics">Chủ đề</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="flex-1 mt-4 min-h-0">
          <BlogPostsTab />
        </TabsContent>

        <TabsContent value="topics" className="flex-1 mt-4 min-h-0">
          <BlogTopicsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
