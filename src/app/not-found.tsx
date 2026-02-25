import Link from 'next/link';
import { Home, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoBackButton } from '@/components/go-back-button';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-b from-background via-background to-secondary/30 px-4">
      {/* Decorative floating elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top-left blob */}
        <div className="absolute -left-20 -top-20 size-72 rounded-full bg-primary-pink/5 blur-3xl" />
        {/* Bottom-right blob */}
        <div className="absolute -bottom-20 -right-20 size-80 rounded-full bg-primary-pink/8 blur-3xl" />
        {/* Center subtle glow */}
        <div className="absolute left-1/2 top-1/3 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-pink/3 blur-[100px]" />

        {/* Floating sparkle dots */}
        <div className="absolute left-[15%] top-[20%] size-1.5 animate-pulse rounded-full bg-primary-pink/40" />
        <div className="absolute right-[20%] top-[30%] size-1 animate-pulse rounded-full bg-primary-pink/30 [animation-delay:0.5s]" />
        <div className="absolute bottom-[35%] left-[25%] size-1 animate-pulse rounded-full bg-primary-pink/25 [animation-delay:1s]" />
        <div className="absolute bottom-[25%] right-[15%] size-1.5 animate-pulse rounded-full bg-primary-pink/35 [animation-delay:1.5s]" />
        <div className="absolute left-[40%] top-[15%] size-1 animate-pulse rounded-full bg-primary-pink/20 [animation-delay:2s]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* 404 number with sparkle icon */}
        <div className="relative mb-4">
          <Sparkles className="absolute -right-8 -top-4 size-6 animate-pulse text-primary-pink/60" />
          <h1 className="bg-linear-to-r from-primary-pink via-primary-pink/80 to-primary-pink/60 bg-clip-text text-[8rem] font-extrabold leading-none tracking-tighter text-transparent sm:text-[10rem]">
            404
          </h1>
          <Sparkles className="absolute -bottom-2 -left-6 size-5 animate-pulse text-primary-pink/40 [animation-delay:0.7s]" />
        </div>

        {/* Decorative divider */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-12 bg-linear-to-r from-transparent to-primary-pink/40" />
          <div className="size-1.5 rounded-full bg-primary-pink/50" />
          <div className="h-px w-12 bg-linear-to-l from-transparent to-primary-pink/40" />
        </div>

        {/* Title */}
        <h2 className="mb-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Trang không tồn tại
        </h2>

        {/* Description */}
        <p className="mb-8 max-w-md text-base leading-relaxed text-muted-foreground">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          Hãy quay lại trang chủ để khám phá thêm nhé!
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="primary-pink" size="lg" asChild>
            <Link href="/">
              <Home className="size-4" />
              Về trang chủ
            </Link>
          </Button>

          <Button variant="outline" size="lg" asChild>
            <Link href="/collections">
              <Search className="size-4" />
              Tìm sản phẩm
            </Link>
          </Button>
        </div>

        {/* Back link */}
        <GoBackButton className="mt-6" />
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full text-primary-pink/5"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50C240 80 480 20 720 50C960 80 1200 20 1440 50V100H0V50Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}
