'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** When provided, pagination renders SEO-friendly <Link> elements instead of buttons */
  getPageHref?: (page: number) => string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  getPageHref,
  className,
}: PaginationProps) {
  // Don't render pagination if there's only 1 page or less
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const showEllipsisThreshold = 7;

    if (totalPages <= showEllipsisThreshold) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const buttonBaseClass =
    'flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-200';
  const activeClass =
    'border-primary-pink bg-primary-pink text-white shadow-md shadow-primary-pink/25';
  const inactiveClass =
    'border-gray-200 text-muted-foreground hover:border-primary-pink hover:bg-primary-pink/5 hover:text-primary-pink';
  const disabledClass = 'cursor-not-allowed border-gray-200 text-gray-300';

  /** Render a page item as <Link> (SEO) or <button> (client-only) */
  const renderPageItem = (page: number) => {
    const isActive = currentPage === page;
    const className = cn(
      'flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-all duration-200',
      isActive ? activeClass : inactiveClass,
    );

    if (getPageHref && !isActive) {
      return (
        <Link
          key={page}
          href={getPageHref(page)}
          className={className}
          aria-label={`Page ${page}`}
          scroll
        >
          {page}
        </Link>
      );
    }

    return (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={className}
        aria-label={`Page ${page}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {page}
      </button>
    );
  };

  /** Render prev/next as <Link> or <button> */
  const renderNavButton = (
    direction: 'prev' | 'next',
    disabled: boolean,
    targetPage: number,
  ) => {
    const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
    const label = direction === 'prev' ? 'Previous page' : 'Next page';

    if (getPageHref && !disabled) {
      return (
        <Link
          href={getPageHref(targetPage)}
          className={cn(buttonBaseClass, inactiveClass)}
          aria-label={label}
          scroll
        >
          <Icon className="h-4 w-4" />
        </Link>
      );
    }

    return (
      <button
        onClick={() => onPageChange(targetPage)}
        disabled={disabled}
        className={cn(
          buttonBaseClass,
          disabled ? disabledClass : inactiveClass,
        )}
        aria-label={label}
      >
        <Icon className="h-4 w-4" />
      </button>
    );
  };

  return (
    <nav
      className={cn('flex items-center justify-center gap-1', className)}
      aria-label="Pagination"
    >
      {/* Previous button */}
      {renderNavButton('prev', currentPage === 1, currentPage - 1)}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-10 w-10 items-center justify-center text-muted-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            renderPageItem(page)
          ),
        )}
      </div>

      {/* Next button */}
      {renderNavButton('next', currentPage === totalPages, currentPage + 1)}
    </nav>
  );
}
