'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { forgetPasswordSchema } from '@/lib/schemas'
import type { ForgetPasswordFormValues } from '@/lib/types/forms'

export default function ForgetPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ForgetPasswordFormValues>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onTouched',
  })

  async function onSubmit(data: ForgetPasswordFormValues) {
    setError(null)
    try {
      // TODO: Implement forget password API call
      if (process.env.NODE_ENV === 'development') {
        console.log('Forget password request:', data)
      }
      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi')
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-primary-pink/10 rounded-full flex items-center justify-center mb-2">
          <Mail className="h-6 w-6 text-primary-pink" />
        </div>
        <CardTitle className="text-2xl font-bold bg-linear-to-r from-primary-pink to-purple-500 bg-clip-text text-transparent">
          Quên mật khẩu?
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {isSubmitted
            ? 'Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.'
            : 'Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="text-center space-y-4">
            <div className="p-4 rounded-xl bg-green-50 text-green-700 text-sm">
              <p>
                Vui lòng kiểm tra hộp thư đến của bạn và làm theo hướng dẫn
                trong email để đặt lại mật khẩu.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl"
              onClick={() => setIsSubmitted(false)}
            >
              Gửi lại email
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        autoComplete="email"
                        className="h-11 rounded-xl border-2 transition-colors focus:border-primary-pink"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-primary-pink hover:bg-primary-pink/90 text-white font-semibold"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? 'Đang xử lý...'
                  : 'Gửi hướng dẫn'}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter>
        <Link
          href="/auth/login"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary-pink transition-colors mx-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại đăng nhập
        </Link>
      </CardFooter>
    </Card>
  )
}
