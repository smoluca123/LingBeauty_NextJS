import { Sparkles, Star, ShoppingBag } from 'lucide-react';

/**
 * Custom banner for the all-products page.
 * Uses a gradient rose -> violet -> fuchsia color scheme.
 */
export function ProductsBanner() {
  return (
    <div className="relative w-full h-50 sm:h-70 md:h-85 lg:h-100 overflow-hidden rounded-2xl">
      {/* Background gradient layer */}
      <div className="absolute inset-0 bg-linear-to-br from-rose-400 via-fuchsia-400 to-violet-500" />

      {/* Animated decorative shapes */}
      <div className="absolute top-[8%] right-[8%] w-28 h-28 sm:w-36 sm:h-36 bg-white/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-[15%] left-[5%] w-24 h-24 sm:w-32 sm:h-32 bg-pink-200/15 rounded-full blur-lg animate-pulse delay-700" />
      <div className="absolute top-[35%] left-[25%] w-16 h-16 sm:w-20 sm:h-20 bg-violet-200/10 rounded-full blur-lg animate-pulse delay-300" />
      <div className="absolute bottom-[30%] right-[20%] w-14 h-14 sm:w-18 sm:h-18 bg-fuchsia-200/10 rounded-full blur-md" />

      {/* Content overlay */}
      <div className="relative z-10 h-full container mx-auto flex items-center justify-between px-4">
        {/* Left side - Page title */}
        <div className="flex flex-col items-start gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm text-white/80 font-medium tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Cửa hàng
          </span>
          <div className="relative">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-lg tracking-tight">
              Sản Phẩm
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base text-white/90 font-medium">
              Khám phá tất cả sản phẩm ✨
            </span>
          </div>
        </div>

        {/* Right side - Decorative badges */}
        <div className="hidden sm:flex flex-col gap-3 items-end">
          <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-center transform rotate-3 shadow-lg border border-white/10">
            <span className="text-xs font-medium opacity-80 flex items-center gap-1 justify-center">
              <Star className="w-3 h-3" />
              CHẤT LƯỢNG
            </span>
            <div className="text-xl sm:text-2xl font-black">CHÍNH HÃNG</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-center transform -rotate-3 shadow-lg border border-white/10">
            <span className="text-xs font-medium opacity-80 flex items-center gap-1 justify-center">
              <ShoppingBag className="w-3 h-3" />
              GIAO HÀNG
            </span>
            <div className="text-xl sm:text-2xl font-black">TOÀN QUỐC</div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent" />
    </div>
  );
}
