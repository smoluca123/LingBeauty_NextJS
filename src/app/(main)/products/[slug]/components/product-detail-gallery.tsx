'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react'
import { cn } from '@/lib/utils/style-utils'
import { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces'

interface ProductDetailGalleryProps {
  product: IProductDataType
}

export function ProductDetailGallery({ product }: ProductDetailGalleryProps) {
  // Build image list from all product images (sorted by isPrimary first, then sortOrder)
  const images =
    product.images && product.images.length > 0
      ? product.images
      : []

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // Main carousel
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true })

  // Thumbnail carousel
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })

  // Sync selectedIndex when main carousel scrolls
  const onMainSelect = useCallback(() => {
    if (!mainApi) return
    const index = mainApi.selectedScrollSnap()
    setSelectedIndex(index)
    thumbApi?.scrollTo(index)
  }, [mainApi, thumbApi])

  useEffect(() => {
    if (!mainApi) return
    mainApi.on('select', onMainSelect)
    return () => {
      mainApi.off('select', onMainSelect)
    }
  }, [mainApi, onMainSelect])

  const scrollTo = useCallback(
    (index: number) => {
      mainApi?.scrollTo(index)
      setSelectedIndex(index)
    },
    [mainApi],
  )

  const scrollPrev = useCallback(() => mainApi?.scrollPrev(), [mainApi])
  const scrollNext = useCallback(() => mainApi?.scrollNext(), [mainApi])

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-muted flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Không có ảnh</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* ── Main Carousel ─────────────────────────────── */}
      <div className="group relative overflow-hidden rounded-2xl bg-muted">
        <div ref={mainRef} className="overflow-hidden">
          <div className="flex touch-pan-y">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="relative aspect-square min-w-0 flex-[0_0_100%] cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
              >
                <Image
                  src={img.media?.url}
                  alt={img.alt || `${product.name} - Ảnh ${index + 1}`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  priority={index === 0}
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>

        {/* Zoom hint */}
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/40 p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn className="h-4 w-4 text-white" />
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                scrollPrev()
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 transition-all hover:bg-black/60 group-hover:opacity-100"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                scrollNext()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 transition-all hover:bg-black/60 group-hover:opacity-100"
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Counter dot */}
        {images.length > 1 && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, index) => (
              <span
                key={index}
                className={cn(
                  'block h-1.5 rounded-full transition-all duration-300',
                  index === selectedIndex
                    ? 'w-4 bg-white'
                    : 'w-1.5 bg-white/50',
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Thumbnail Carousel ─────────────────────────── */}
      {images.length > 1 && (
        <div ref={thumbRef} className="overflow-hidden">
          <div className="flex gap-2 touch-pan-y">
            {images.map((img, index) => (
              <button
                key={img.id}
                onClick={() => scrollTo(index)}
                className={cn(
                  'relative h-16 w-16 flex-[0_0_64px] overflow-hidden rounded-lg border-2 transition-all',
                  index === selectedIndex
                    ? 'border-primary-pink shadow-sm opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-90',
                )}
                aria-label={`Xem ảnh ${index + 1}`}
              >
                <Image
                  src={img.media?.url}
                  alt={img.alt || `Ảnh ${index + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Lightbox ───────────────────────────────────── */}
      {isLightboxOpen && (
        <Lightbox
          images={images}
          initialIndex={selectedIndex}
          onClose={() => setIsLightboxOpen(false)}
          productName={product.name}
        />
      )}
    </div>
  )
}

// ─── Lightbox Component ────────────────────────────────────────────────────────
interface LightboxImage {
  id: string
  alt?: string | null
  media?: { url: string }
  sortOrder?: number
}

interface LightboxProps {
  images: LightboxImage[]
  initialIndex: number
  productName: string
  onClose: () => void
}

function Lightbox({
  images,
  initialIndex,
  productName,
  onClose,
}: LightboxProps) {
  const [lightboxRef, lightboxApi] = useEmblaCarousel({
    startIndex: initialIndex,
    loop: true,
  })

  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const onSelect = useCallback(() => {
    if (!lightboxApi) return
    setCurrentIndex(lightboxApi.selectedScrollSnap())
  }, [lightboxApi])

  useEffect(() => {
    lightboxApi?.on('select', onSelect)
    return () => {
      lightboxApi?.off('select', onSelect)
    }
  }, [lightboxApi, onSelect])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') lightboxApi?.scrollPrev()
      if (e.key === 'ArrowRight') lightboxApi?.scrollNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxApi, onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        onClick={onClose}
        aria-label="Đóng"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Counter */}
      <p className="absolute top-4 left-1/2 -translate-x-1/2 text-sm font-medium text-white/80">
        {currentIndex + 1} / {images.length}
      </p>

      {/* Embla lightbox */}
      <div
        className="w-full max-w-4xl px-14"
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={lightboxRef} className="overflow-hidden">
          <div className="flex">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="relative aspect-square min-w-0 flex-[0_0_100%]"
              >
                <Image
                  src={img.media?.url ?? ''}
                  alt={img.alt || `${productName} - Ảnh ${index + 1}`}
                  fill
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="object-contain"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox nav */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => lightboxApi?.scrollPrev()}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => lightboxApi?.scrollNext()}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
