'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'

import { newsletterSchema, type NewsletterFormValues } from './schema'

export function Newsletter() {
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
    },
  })

  function onSubmit(data: NewsletterFormValues) {
    // TODO: Implement newsletter subscription API
    if (process.env.NODE_ENV === 'development') {
      console.log('Newsletter subscription:', data)
    }
  }

  return (
    <section className="relative py-4 md:py-5 overflow-hidden bg-linear-to-r from-primary-pink via-primary-pink to-primary-pink/95">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-linear-to-br from-transparent via-white/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          {/* Text Content */}
          <div className="text-white text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold italic tracking-wide">
              NHẬN BẢN TIN LÀM ĐẸP
            </h2>
            <p className="text-sm md:text-base opacity-95 mt-1.5">
              Đừng bỏ lỡ hàng ngàn sản phẩm và chương trình siêu hấp dẫn
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full md:w-auto shrink-0"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="relative">
                    <div className="flex items-stretch rounded-full overflow-hidden shadow-lg backdrop-blur-sm bg-linear-to-r from-white/90 via-white/95 to-white/90">
                      <FormControl>
                        <Input
                          placeholder="Điền email của bạn"
                          type="email"
                          className="h-11 w-full md:w-[280px] rounded-none border-0 bg-transparent text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm px-5 font-medium"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="submit"
                        variant="ghost"
                        className="h-11 px-6 md:px-8 rounded-none bg-transparent text-primary-pink hover:text-primary-pink/80 font-bold text-sm tracking-wider border-l border-primary-pink/20 transition-all duration-300 cursor-pointer hover:bg-primary-pink/5"
                      >
                        THEO DÕI
                      </Button>
                    </div>
                    <FormMessage className="absolute -bottom-6 left-0 text-xs text-white/90 font-medium" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </section>
  )
}
