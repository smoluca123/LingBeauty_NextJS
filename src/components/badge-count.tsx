export default function BadgeCount({ count }: { count: number }) {
  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-pink text-[10px] font-bold text-white leading-none">
      {count > 99 ? '99+' : count}
    </span>
  )
}
