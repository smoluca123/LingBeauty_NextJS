'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ICategoryDataType } from '@/lib/types/interfaces/apis/header.interfaces'

interface NavigationBarClientProps {
  categories: ICategoryDataType[]
}

export function NavigationBarClient({ categories }: NavigationBarClientProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const handleMouseEnter = useCallback((categoryName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setOpenCategory(categoryName)
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpenCategory(null)
    }, 200)
  }, [])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!emblaApi) return

    const timer = setTimeout(() => {
      onSelect()
    }, 0)

    return () => clearTimeout(timer)
  }, [emblaApi, onSelect])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <nav className="relative py-2">
      {canScrollPrev && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {canScrollNext && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3 md:gap-4 lg:gap-5 px-2 md:px-0">
          {categories.map((category) => (
            <Popover
              key={category.name}
              open={openCategory === category.name}
              onOpenChange={(open) => {
                if (!open && openCategory === category.name) {
                  handleMouseLeave()
                }
              }}
            >
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter(category.name)}
                onMouseLeave={handleMouseLeave}
              >
                <PopoverTrigger asChild>
                  <Link href={`/categories/${category.slug}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap hover:bg-accent hover:text-accent-foreground text-xs md:text-sm px-3 md:px-4"
                      onPointerDown={(e) => e.preventDefault()}
                    >
                      {category.name}
                    </Button>
                  </Link>
                </PopoverTrigger>

                {/* Invisible bridge để hover qua khoảng trống không bị tắt */}
                {openCategory === category.name &&
                  category.children.length > 0 && (
                    <div className="absolute left-0 top-full w-56 h-3 z-40" />
                  )}

                {category.children.length > 0 && (
                  <PopoverContent
                    align="start"
                    className="w-56 p-1 mt-3"
                    onMouseEnter={() => handleMouseEnter(category.name)}
                    onMouseLeave={handleMouseLeave}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <div className="flex flex-col">
                      {category.children.map((item) => {
                        if (item.type === 'BRAND') {
                          return (
                            <Link
                              key={item.brand.id}
                              href={`/collections/${item.brand.slug}`}
                              className="px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                              {item.brand.name}
                            </Link>
                          )
                        }
                        return (
                          <Link
                            key={item.name}
                            href={`/categories/${item.slug}`}
                            className="px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>
                  </PopoverContent>
                )}
              </div>
            </Popover>
          ))}
        </div>
      </div>
    </nav>
  )
}
