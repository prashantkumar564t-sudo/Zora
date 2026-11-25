'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { CATEGORY_FILTERS, type CategoryFilter } from '@/lib/catalog';

interface CategoryFilterBarProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  totalCount: number;
  hasExtraFilters?: boolean;
  onResetAll?: () => void;
}

export default function CategoryFilterBar({
  activeCategory,
  onSelectCategory,
  totalCount,
  hasExtraFilters = false,
  onResetAll,
}: CategoryFilterBarProps) {
  const showReset = activeCategory !== 'All' || hasExtraFilters;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 xl:px-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filter catalog by category"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5"
        >
          {CATEGORY_FILTERS.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                aria-pressed={isActive}
                className={`inline-flex h-9 items-center rounded-full px-4 text-xs sm:text-[13px] font-semibold whitespace-nowrap shrink-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                  isActive
                    ? 'bg-white text-[#141414]'
                    : 'bg-[#1F1F1F] text-[#A3A3A3] border border-white/10 hover:bg-[#282828] hover:text-white'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {showReset && onResetAll && (
          <div className="flex items-center gap-3 text-xs text-[#A3A3A3] shrink-0">
            <span className="tabular-nums">
              {totalCount} {totalCount === 1 ? 'title' : 'titles'}
            </span>
            <button
              type="button"
              onClick={onResetAll}
              className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-[#E50914] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded px-1 py-0.5"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
