'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

function TabsUnderline({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
}

function TabsUnderlineList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'h-auto w-full inline-flex items-center justify-center gap-0 rounded-none border-b bg-transparent p-0',
        // 'bg-muted  text-muted-foreground inline-flex h-9  items-center justify-center rounded-lg p-[3px]',
        className,
      )}
      {...props}
    />
  );
}

function TabsUnderlineTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'h-10 flex-1 rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors data-[state=active]:border-b-primary-pink data-[state=active]:text-foreground data-[state=active]:shadow-none disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

function TabsUnderlineContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('mt-6 flex-1 outline-none', className)}
      {...props}
    />
  );
}

export {
  TabsUnderline,
  TabsUnderlineList,
  TabsUnderlineTrigger,
  TabsUnderlineContent,
};
