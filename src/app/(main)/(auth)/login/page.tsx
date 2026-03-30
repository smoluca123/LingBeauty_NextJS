'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoginForm } from '@/components/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const handleLoginSuccess = () => {
    router.push(redirect)
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold bg-linear-to-r from-primary-pink to-purple-500 bg-clip-text text-transparent">
          Đăng nhập
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Chào mừng bạn trở lại! Vui lòng đăng nhập để tiếp tục.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm onSuccess={handleLoginSuccess} />
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Hoặc</span>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{' '}
          <Link
            href={`/register${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="font-semibold text-primary-pink hover:text-primary-pink/80 transition-colors"
          >
            Đăng ký ngay
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
