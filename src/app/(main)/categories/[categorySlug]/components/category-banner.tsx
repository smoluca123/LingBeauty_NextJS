interface CategoryBannerProps {
  name: string;
  imageUrl?: string;
}

export function CategoryBanner({ name, imageUrl }: CategoryBannerProps) {
  return (
    <div className="relative w-full h-50 sm:h-70 md:h-85 lg:h-100 overflow-hidden rounded-2xl">
      {/* Background gradient layer */}
      <div className="absolute inset-0 bg-linear-to-br from-pink-300 via-rose-200 to-purple-300" />

      {/* Optional background image */}
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}

      {/* Decorative shapes */}
      <div className="absolute top-[10%] right-[10%] w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-[20%] left-[5%] w-20 h-20 sm:w-28 sm:h-28 bg-pink-200/20 rounded-full blur-lg" />
      <div className="absolute top-[30%] left-[30%] w-16 h-16 bg-purple-200/15 rounded-full blur-lg" />

      {/* Content overlay */}
      <div className="relative z-10 h-full container mx-auto flex items-center justify-between px-4">
        {/* Left side - Category name */}
        <div className="flex flex-col items-start gap-2">
          <span className="text-xs sm:text-sm text-white/80 font-medium tracking-wider uppercase">
            Danh mục
          </span>
          <div className="relative">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-lg tracking-tight">
              {name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base text-white/90 font-medium">
              Khám phá bộ sưu tập ✨
            </span>
          </div>
        </div>

        {/* Right side - Decorative elements */}
        <div className="hidden sm:flex flex-col gap-3 items-end">
          <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-center transform rotate-3 shadow-lg border border-white/10">
            <span className="text-xs font-medium opacity-80">BỘ SƯU TẬP</span>
            <div className="text-xl sm:text-2xl font-black">HOT 🔥</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-center transform -rotate-3 shadow-lg border border-white/10">
            <span className="text-xs font-medium opacity-80">ƯU ĐÃI</span>
            <div className="text-xl sm:text-2xl font-black">SỐC 💥</div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent" />
    </div>
  );
}
