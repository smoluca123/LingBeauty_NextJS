interface CollectionBannerProps {
  name: string;
}

export function CollectionBanner({ name }: CollectionBannerProps) {
  return (
    <div className="relative w-full h-50 sm:h-70 md:h-85 lg:h-100 overflow-hidden">
      {/* Background gradient layer */}
      <div className="absolute inset-0 bg-linear-to-b from-sky-300 via-sky-200 to-emerald-300" />

      {/* Grass layer at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%]">
        <div className="absolute inset-0 bg-linear-to-t from-green-500 via-green-400 to-transparent rounded-t-[100%] scale-x-150" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full container mx-auto flex items-center justify-between px-4">
        {/* Left side - Branding */}
        <div className="flex flex-col items-start gap-2">
          <span className="text-xs sm:text-sm text-primary-pink/80 font-medium">
            miffy<span className="text-[10px] align-top">at</span> BEAUTY BOX
          </span>
          <div className="relative">
            <span className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 text-white text-[10px] sm:text-xs px-2 py-1 bg-primary-pink/80 rounded-full transform -rotate-12">
              THEO CHÂN
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-lg tracking-tight">
              {name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs text-slate-600 font-medium">
              TÌM NIỀM VUI
            </span>
            <span className="text-lg sm:text-2xl md:text-3xl font-bold text-orange-400 drop-shadow">
              MỖI NGÀY ☀️
            </span>
          </div>
        </div>

        {/* Right side - Promo badges */}
        <div className="hidden sm:flex flex-col gap-3 items-end">
          <div className="bg-primary-pink text-white px-3 py-2 rounded-xl text-center transform rotate-6 shadow-lg">
            <span className="text-xs font-medium">GẤU BÔNG</span>
            <div className="text-xl sm:text-2xl font-black">
              25<span className="text-sm">CM</span>
            </div>
          </div>
          <div className="bg-primary-pink text-white px-3 py-2 rounded-xl text-center transform -rotate-6 shadow-lg">
            <span className="text-xs font-medium">MÓC KHÓA</span>
            <div className="text-xl sm:text-2xl font-black">
              12<span className="text-sm">CM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative rabbit silhouettes */}
      <div className="absolute bottom-[15%] left-[10%] w-8 h-12 sm:w-12 sm:h-16 bg-white/60 rounded-full" />
      <div className="absolute bottom-[20%] left-[20%] w-6 h-10 sm:w-10 sm:h-14 bg-white/40 rounded-full" />
      <div className="absolute bottom-[15%] right-[15%] w-10 h-14 sm:w-14 sm:h-20 bg-pink-200/60 rounded-full" />
      <div className="absolute bottom-[18%] right-[25%] w-8 h-12 sm:w-12 sm:h-16 bg-white/50 rounded-full" />
    </div>
  );
}
