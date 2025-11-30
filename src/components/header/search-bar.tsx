'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const searchSchema = z.object({
  search: z.string().min(1, 'Vui lòng nhập từ khóa tìm kiếm'),
})

type SearchFormValues = z.infer<typeof searchSchema>

export function SearchBar() {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: '',
    },
  })

  function onSubmit(data: SearchFormValues) {
    console.log('Search form data:', data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-xl mx-auto">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="w-full">
              <div className="relative flex items-center w-full">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <FormControl>
                  <Input
                    placeholder="Mua 1 Tặng 1 Kem Chống Nắng"
                    className="pl-10 pr-12 h-9 md:h-10 w-full text-sm md:text-base"
                    {...field}
                  />
                </FormControl>
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 h-7 w-7 md:h-8 md:w-8"
                  aria-label="Tìm kiếm"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

