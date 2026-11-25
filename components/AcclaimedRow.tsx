'use client';

import React, { useRef } from 'react';
import { Check, ChevronLeft, ChevronRight, Play, Plus } from 'lucide-react';
import MediaImage from './MediaImage';
import type { MovieItem } from '@/lib/catalog';

interface AcclaimedRowProps {
  title: string;
  subtitle?: string;
  items: MovieItem[];
  myListIds: string[];
  onPlay: (movie: MovieItem) => void;
  onSelect: (movie: MovieItem) => void;
  onToggleMyList: (movieId: string) => void;
}

export default function AcclaimedRow({
  title,
  subtitle,
  items,
  myListIds,
  onPlay,
  onSelect,
  onToggleMyList,
}: AcclaimedRowProps) {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollRail = (direction: 'left' | 'right') => {
    const node = railRef.current;
    if (!node) return;
    const distance = Math.max(360, node.clientWidth * 0.78);
    node.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={title}
      className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 xl:px-14"
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-sans text-xl sm:text-[22px] font-bold tracking-[-0.015em] text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-xs sm:text-[13px] text-[#A3A3A3]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scrollRail('left')}
            aria-label={`Scroll ${title} left`}
            className="flex h-8 w-8 items-center justify-center rounded bg-[#1F1F1F] text-[#E5E2E1] hover:bg-[#282828] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollRail('right')}
            aria-label={`Scroll ${title} right`}
            className="flex h-8 w-8 items-center justify-center rounded bg-[#1F1F1F] text-[#E5E2E1] hover:bg-[#282828] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar py-3 -mx-1 px-1 snap-x snap-mandatory"
      >
        {items.map((movie) => {
          const isSaved = myListIds.includes(movie.id);
          return (
            <article
              key={movie.id}
              className="group relative w-[280px] sm:w-[320px] lg:w-[356px] shrink-0 snap-start rounded bg-[#1F1F1F] transition-all duration-300 ease-out hover:z-20 hover:scale-[1.04] hover:bg-[#282828] hover:shadow-[0_16px_38px_rgba(0,0,0,0.85)]"
            >
              {/* Borderless 16:9 Widescreen Media Frame */}
              <div className="relative aspect-video w-full overflow-hidden rounded-t bg-[#141414]">
                <button
                  type="button"
                  onClick={() => onSelect(movie)}
                  aria-label={`View details for ${movie.title}`}
                  className="relative block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                >
                  <MediaImage
                    src={movie.thumbnail}
                    youtubeId={movie.youtubeId}
                    alt={movie.title}
                    sizes="(max-width: 640px) 280px, 360px"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  />
                  {/* Measured Bottom Scrim */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F] via-[#141414]/20 to-transparent opacity-90 group-hover:from-[#282828] transition-colors"
                  />
                </button>

                {/* Top-Left Quality Label */}
                <span className="pointer-events-none absolute top-2.5 left-2.5 rounded bg-[#141414]/80 px-2 py-0.5 text-[10px] font-bold tracking-[0.05em] text-[#E5E2E1]">
                  {movie.quality.split('•')[0].trim()}
                </span>

                {/* Quick-Play Circular Icon with Smooth Hover Fade-In */}
                <button
                  type="button"
                  onClick={() => onPlay(movie)}
                  aria-label={`Play ${movie.title}`}
                  className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#141414] shadow-lg opacity-95 sm:opacity-0 sm:translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Play className="h-4 w-4 fill-current ml-0.5" aria-hidden="true" />
                </button>
              </div>

              {/* Clean Editorial Metadata Footer */}
              <div className="px-3.5 py-3">
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelect(movie)}
                    className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
                  >
                    <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-white truncate group-hover:text-white">
                      {movie.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-[#A3A3A3] tabular-nums truncate">
                      <span className="font-bold text-[#46D369] shrink-0">
                        {movie.matchScore}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{movie.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{movie.duration}</span>
                      <span aria-hidden="true">·</span>
                      <span className="rounded bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-semibold text-[#E5E2E1] shrink-0">
                        Hindi
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleMyList(movie.id)}
                    aria-label={
                      isSaved
                        ? `Remove ${movie.title} from My List`
                        : `Add ${movie.title} to My List`
                    }
                    aria-pressed={isSaved}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    {isSaved ? (
                      <Check className="h-4 w-4 text-[#46D369]" aria-hidden="true" />
                    ) : (
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
